from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.disease import Disease
from app.models.user import User

router = APIRouter()


class DiseaseCreate(BaseModel):
    name:        str
    category:    Optional[str] = None
    description: str
    symptoms:    Optional[str] = None
    causes:      Optional[str] = None
    treatment:   Optional[str] = None
    prevention:  Optional[str] = None
    severity:    Optional[str] = "moderate"

class DiseaseUpdate(BaseModel):
    name:        Optional[str] = None
    category:    Optional[str] = None
    description: Optional[str] = None
    symptoms:    Optional[str] = None
    causes:      Optional[str] = None
    treatment:   Optional[str] = None
    prevention:  Optional[str] = None
    severity:    Optional[str] = None


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/")
def get_diseases(
    page:     int           = Query(1, ge=1),
    limit:    int           = Query(12, ge=1, le=100),
    search:   Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db:       Session       = Depends(get_db),
    current_user: User      = Depends(get_current_user)
):
    query = db.query(Disease).filter(Disease.is_active == True)
    if search:
        query = query.filter(Disease.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(Disease.category.ilike(f"%{category}%"))

    total    = query.count()
    diseases = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total, "page": page, "limit": limit,
        "data": [{"id": d.id, "name": d.name, "category": d.category,
                  "description": d.description, "symptoms": d.symptoms,
                  "causes": d.causes, "treatment": d.treatment,
                  "prevention": d.prevention, "severity": d.severity}
                 for d in diseases]
    }


@router.get("/search/query")
def search_diseases(
    q:  str     = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    diseases = db.query(Disease).filter(
        Disease.name.ilike(f"%{q}%"), Disease.is_active == True
    ).limit(20).all()
    return {"query": q, "total": len(diseases),
            "data": [{"id": d.id, "name": d.name, "category": d.category} for d in diseases]}


@router.get("/{disease_id}")
def get_disease(
    disease_id: int,
    db:         Session = Depends(get_db),
    current_user: User  = Depends(get_current_user)
):
    d = db.query(Disease).filter(Disease.id == disease_id, Disease.is_active == True).first()
    if not d:
        raise HTTPException(status_code=404, detail="Disease not found")
    return {"id": d.id, "name": d.name, "category": d.category, "description": d.description,
            "symptoms": d.symptoms, "causes": d.causes, "treatment": d.treatment,
            "prevention": d.prevention, "severity": d.severity}


@router.post("/")
def create_disease(
    data: DiseaseCreate,
    db:   Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    if db.query(Disease).filter(Disease.name.ilike(data.name)).first():
        raise HTTPException(status_code=400, detail="Disease already exists")
    d = Disease(**data.dict())
    db.add(d); db.commit(); db.refresh(d)
    return {"message": "Disease created", "id": d.id, "name": d.name}


@router.put("/{disease_id}")
def update_disease(
    disease_id: int,
    data: DiseaseUpdate,
    db:   Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    d = db.query(Disease).filter(Disease.id == disease_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Disease not found")
    for field, val in data.dict(exclude_none=True).items():
        setattr(d, field, val)
    db.commit(); db.refresh(d)
    return {"message": "Disease updated", "id": d.id, "name": d.name}


@router.delete("/{disease_id}")
def delete_disease(
    disease_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    d = db.query(Disease).filter(Disease.id == disease_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Disease not found")
    d.is_active = False
    db.commit()
    return {"message": "Disease deleted", "id": disease_id}
