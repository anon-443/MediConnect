from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.models.doctor import Doctor
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter()


# =========================
# SCHEMA (FIX)
# =========================
class DoctorCreate(BaseModel):
    name: str
    specialty: str


# =========================
# CREATE DOCTOR
# =========================
@router.post("/")
def create_doctor(
    data: DoctorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # prevent duplicates
    existing = db.query(Doctor).filter(Doctor.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Doctor already exists")

    doctor = Doctor(
        name=data.name,
        specialty=data.specialty
    )

    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    return {
        "message": "Doctor created successfully",
        "doctor": {
            "id": doctor.id,
            "name": doctor.name,
            "specialty": doctor.specialty
        }
    }


# =========================
# GET ALL DOCTORS
# =========================
@router.get("/")
def get_doctors(
    search: Optional[str] = None,
    specialty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Doctor)

    if search:
        query = query.filter(Doctor.name.ilike(f"%{search}%"))

    if specialty:
        query = query.filter(Doctor.specialty.ilike(f"%{specialty}%"))

    doctors = query.all()

    return {
        "total": len(doctors),
        "data": [
            {
                "id": d.id,
                "name": d.name,
                "specialty": d.specialty
            }
            for d in doctors
        ]
    }


# =========================
# GET SINGLE DOCTOR
# =========================
@router.get("/{doctor_id}")
def get_doctor(
    doctor_id: int,
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return {
        "id": doctor.id,
        "name": doctor.name,
        "specialty": doctor.specialty
    }