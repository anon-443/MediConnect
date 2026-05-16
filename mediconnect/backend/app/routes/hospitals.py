from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
import math

from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.hospital import Hospital
from app.models.user import User

router = APIRouter()


# ─────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────
class HospitalCreate(BaseModel):
    name:        str
    city:        str
    address:     Optional[str] = None
    phone:       Optional[str] = None
    type:        Optional[str] = None
    beds:        Optional[int] = None
    specialties: Optional[str] = None
    latitude:    Optional[float] = None
    longitude:   Optional[float] = None


# ─────────────────────────────────────────────
# RBAC — Admin only for write operations
# ─────────────────────────────────────────────
def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ─────────────────────────────────────────────
# HAVERSINE FORMULA — Calculate distance between
# two coordinates in kilometers
# ─────────────────────────────────────────────
def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371  # Earth radius in kilometers
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return round(R * c, 2)


# ─────────────────────────────────────────────
# GET ALL HOSPITALS
# ─────────────────────────────────────────────
@router.get("/")
def get_hospitals(
    search:   Optional[str] = Query(None),
    city:     Optional[str] = Query(None),
    type:     Optional[str] = Query(None),
    page:     int           = Query(1, ge=1),
    limit:    int           = Query(20, ge=1, le=100),
    db:       Session       = Depends(get_db),
    current_user: User      = Depends(get_current_user)
):
    query = db.query(Hospital).filter(Hospital.is_active == True)

    if search:
        query = query.filter(Hospital.name.ilike(f"%{search}%"))

    if city:
        query = query.filter(Hospital.city.ilike(f"%{city}%"))

    if type:
        query = query.filter(Hospital.type.ilike(f"%{type}%"))

    total     = query.count()
    hospitals = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page":  page,
        "limit": limit,
        "data": [
            {
                "id":          h.id,
                "name":        h.name,
                "city":        h.city,
                "address":     h.address,
                "phone":       h.phone,
                "type":        h.type,
                "beds":        h.beds,
                "specialties": h.specialties,
                "latitude":    h.latitude,
                "longitude":   h.longitude,
            }
            for h in hospitals
        ]
    }


# ─────────────────────────────────────────────
# GET NEARBY HOSPITALS — Using Haversine formula
# No external API needed — pure math calculation
# ─────────────────────────────────────────────
@router.get("/nearby")
def get_nearby_hospitals(
    lat:    float         = Query(..., description="User latitude"),
    lng:    float         = Query(..., description="User longitude"),
    radius: float         = Query(50.0, description="Search radius in km"),
    limit:  int           = Query(10, ge=1, le=50),
    db:     Session       = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    # Get all hospitals that have coordinates
    hospitals = db.query(Hospital).filter(
        Hospital.is_active  == True,
        Hospital.latitude   != None,
        Hospital.longitude  != None
    ).all()

    # Calculate distance for each hospital
    nearby = []
    for h in hospitals:
        distance = haversine_distance(lat, lng, h.latitude, h.longitude)
        if distance <= radius:
            nearby.append({
                "id":          h.id,
                "name":        h.name,
                "city":        h.city,
                "address":     h.address,
                "phone":       h.phone,
                "type":        h.type,
                "beds":        h.beds,
                "specialties": h.specialties,
                "latitude":    h.latitude,
                "longitude":   h.longitude,
                "distance_km": distance,
            })

    # Sort by distance — nearest first
    nearby.sort(key=lambda x: x["distance_km"])

    return {
        "total":       len(nearby),
        "user_lat":    lat,
        "user_lng":    lng,
        "radius_km":   radius,
        "data":        nearby[:limit]
    }


# ─────────────────────────────────────────────
# GET SINGLE HOSPITAL
# ─────────────────────────────────────────────
@router.get("/{hospital_id}")
def get_hospital(
    hospital_id:  int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    h = db.query(Hospital).filter(
        Hospital.id       == hospital_id,
        Hospital.is_active == True
    ).first()

    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")

    return {
        "id":          h.id,
        "name":        h.name,
        "city":        h.city,
        "address":     h.address,
        "phone":       h.phone,
        "type":        h.type,
        "beds":        h.beds,
        "specialties": h.specialties,
        "latitude":    h.latitude,
        "longitude":   h.longitude,
    }


# ─────────────────────────────────────────────
# CREATE HOSPITAL — Admin only
# ─────────────────────────────────────────────
@router.post("/")
def create_hospital(
    data:         HospitalCreate,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(require_admin)
):
    hospital = Hospital(**data.dict())
    db.add(hospital)
    db.commit()
    db.refresh(hospital)

    return {
        "message": "Hospital created successfully",
        "id":      hospital.id,
        "name":    hospital.name
    }


# ─────────────────────────────────────────────
# DELETE HOSPITAL — Admin only (soft delete)
# ─────────────────────────────────────────────
@router.delete("/{hospital_id}")
def delete_hospital(
    hospital_id:  int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(require_admin)
):
    h = db.query(Hospital).filter(Hospital.id == hospital_id).first()

    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")

    h.is_active = False
    db.commit()

    return {"message": "Hospital deleted", "id": hospital_id}
