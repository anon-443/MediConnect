from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.disease import Disease
from app.core.roles import get_current_user, require_doctor, require_admin

router = APIRouter()

# Anyone logged in can VIEW diseases
@router.get("/")
def get_diseases(
    page: int = 1,
    limit: int = 12,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Disease)
    
    if search:
        query = query.filter(Disease.name.ilike(f"%{search}%"))
    
    total = query.count()
    start = (page - 1) * limit
    diseases = query.offset(start).limit(limit).all()
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": [
            {
                "id": d.id,
                "name": d.name,
                "description": d.description,
            }
            for d in diseases
        ]
    }

# ONLY DOCTORS can add new diseases
@router.post("/")
def create_disease(
    disease_data: dict,
    current_user: dict = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    return {"message": "Disease added - Doctor access confirmed"}

# ONLY ADMINS can delete diseases
@router.delete("/{disease_id}")
def delete_disease(
    disease_id: int,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return {"message": f"Disease {disease_id} deleted - Admin access confirmed"}