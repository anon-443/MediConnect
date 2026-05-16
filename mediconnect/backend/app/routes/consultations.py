from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.consultation import Consultation
from app.models.doctor import Doctor
from app.models.user import User

router = APIRouter()


# ─────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────
class ConsultationCreate(BaseModel):
    doctor_id: int
    reason:    Optional[str] = None


class ConsultationUpdate(BaseModel):
    diagnosis:    Optional[str] = None
    prescription: Optional[str] = None
    notes:        Optional[str] = None
    status:       Optional[str] = None


# ─────────────────────────────────────────────
# RBAC — Doctor only for updating diagnosis
# ─────────────────────────────────────────────
def require_doctor_or_admin(current_user: User = Depends(get_current_user)):
    if current_user.role not in ["doctor", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only doctors or admins can perform this action"
        )
    return current_user


# ─────────────────────────────────────────────
# POST /consultations — Patient books consultation
# ─────────────────────────────────────────────
@router.post("/")
def book_consultation(
    data:         ConsultationCreate,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    # Only patients can book
    if current_user.role not in ["patient", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only patients can book consultations"
        )

    # Check doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == data.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    consultation = Consultation(
        patient_id = current_user.id,
        doctor_id  = data.doctor_id,
        reason     = data.reason,
        status     = "pending"
    )

    db.add(consultation)
    db.commit()
    db.refresh(consultation)

    return {
        "message": "Consultation booked successfully",
        "consultation": {
            "id":         consultation.id,
            "patient_id": consultation.patient_id,
            "doctor_id":  consultation.doctor_id,
            "doctor_name":doctor.name,
            "specialty":  doctor.specialty,
            "reason":     consultation.reason,
            "status":     consultation.status,
            "created_at": consultation.created_at,
        }
    }


# ─────────────────────────────────────────────
# GET /consultations/{id} — Get consultation detail
# ─────────────────────────────────────────────
@router.get("/{consultation_id}")
def get_consultation(
    consultation_id: int,
    db:              Session = Depends(get_db),
    current_user:    User    = Depends(get_current_user)
):
    c = db.query(Consultation).filter(
        Consultation.id == consultation_id
    ).first()

    if not c:
        raise HTTPException(status_code=404, detail="Consultation not found")

    # Only the patient who booked, or doctor, or admin can view
    if current_user.role == "patient" and c.patient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Get doctor details
    doctor = db.query(Doctor).filter(Doctor.id == c.doctor_id).first()

    return {
        "id":           c.id,
        "patient_id":   c.patient_id,
        "doctor_id":    c.doctor_id,
        "doctor_name":  doctor.name if doctor else None,
        "specialty":    doctor.specialty if doctor else None,
        "reason":       c.reason,
        "status":       c.status,
        "diagnosis":    c.diagnosis,
        "prescription": c.prescription,
        "notes":        c.notes,
        "created_at":   c.created_at,
        "updated_at":   c.updated_at,
    }


# ─────────────────────────────────────────────
# PUT /consultations/{id} — Doctor updates diagnosis
# ─────────────────────────────────────────────
@router.put("/{consultation_id}")
def update_consultation(
    consultation_id: int,
    data:            ConsultationUpdate,
    db:              Session = Depends(get_db),
    current_user:    User    = Depends(require_doctor_or_admin)
):
    c = db.query(Consultation).filter(
        Consultation.id == consultation_id
    ).first()

    if not c:
        raise HTTPException(status_code=404, detail="Consultation not found")

    # Update fields if provided
    if data.diagnosis    is not None: c.diagnosis    = data.diagnosis
    if data.prescription is not None: c.prescription = data.prescription
    if data.notes        is not None: c.notes        = data.notes
    if data.status       is not None:
        # Validate status values
        valid_statuses = ["pending", "confirmed", "completed", "cancelled"]
        if data.status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {valid_statuses}"
            )
        c.status = data.status

    db.commit()
    db.refresh(c)

    return {
        "message":      "Consultation updated successfully",
        "id":           c.id,
        "status":       c.status,
        "diagnosis":    c.diagnosis,
        "prescription": c.prescription,
        "notes":        c.notes,
        "updated_at":   c.updated_at,
    }


# ─────────────────────────────────────────────
# GET /consultations/patient/history
# Patient views their own consultation history
# ─────────────────────────────────────────────
@router.get("/patient/history")
def get_patient_consultations(
    status:       Optional[str] = Query(None),
    db:           Session       = Depends(get_db),
    current_user: User          = Depends(get_current_user)
):
    query = db.query(Consultation).filter(
        Consultation.patient_id == current_user.id
    )

    if status:
        query = query.filter(Consultation.status == status)

    consultations = query.order_by(Consultation.created_at.desc()).all()

    result = []
    for c in consultations:
        doctor = db.query(Doctor).filter(Doctor.id == c.doctor_id).first()
        result.append({
            "id":           c.id,
            "doctor_id":    c.doctor_id,
            "doctor_name":  doctor.name if doctor else None,
            "specialty":    doctor.specialty if doctor else None,
            "reason":       c.reason,
            "status":       c.status,
            "diagnosis":    c.diagnosis,
            "prescription": c.prescription,
            "created_at":   c.created_at,
        })

    return {
        "total": len(result),
        "data":  result
    }


# ─────────────────────────────────────────────
# DELETE /consultations/{id} — Cancel consultation
# ─────────────────────────────────────────────
@router.delete("/{consultation_id}")
def cancel_consultation(
    consultation_id: int,
    db:              Session = Depends(get_db),
    current_user:    User    = Depends(get_current_user)
):
    c = db.query(Consultation).filter(
        Consultation.id == consultation_id
    ).first()

    if not c:
        raise HTTPException(status_code=404, detail="Consultation not found")

    # Only the patient who booked or admin can cancel
    if current_user.role == "patient" and c.patient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    if c.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel a completed consultation"
        )

    c.status = "cancelled"
    db.commit()

    return {"message": "Consultation cancelled", "id": consultation_id}
