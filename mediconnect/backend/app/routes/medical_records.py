# ─────────────────────────────────────────────────────────────
# MEDICAL RECORDS ROUTES
# From Assignment 1 DFD: Process 5.0 — Medical Records
# Security tags: «secrecy», «integrity», «rbac», «auth»
# Only the patient themselves or their doctor can view records
# ─────────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.medical_record import MedicalRecord
from app.models.user import User
from app.core.audit_logger import log_action, AuditAction

router = APIRouter()


# ─────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────
class RecordCreate(BaseModel):
    patient_id:   int
    doctor_id:    Optional[int] = None
    record_type:  str           # diagnosis / prescription / lab_result / note
    title:        str
    description:  Optional[str] = None
    diagnosis:    Optional[str] = None
    prescription: Optional[str] = None
    notes:        Optional[str] = None


class RecordUpdate(BaseModel):
    title:        Optional[str] = None
    description:  Optional[str] = None
    diagnosis:    Optional[str] = None
    prescription: Optional[str] = None
    notes:        Optional[str] = None


# ─────────────────────────────────────────────
# POST /records — Create a medical record
# Only doctor or admin can create
# ─────────────────────────────────────────────
@router.post("/")
def create_record(
    data:         RecordCreate,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    # «rbac» — only doctor or admin can create records
    if current_user.role not in ["doctor", "admin"]:
        # Log unauthorized attempt
        log_action(db, AuditAction.UNAUTHORIZED,
                   user_id=current_user.id, user_role=current_user.role,
                   resource="medical_records", status="failed",
                   details="Patient tried to create medical record")
        raise HTTPException(
            status_code=403,
            detail="Only doctors or admins can create medical records"
        )

    # Validate record type
    valid_types = ["diagnosis", "prescription", "lab_result", "note"]
    if data.record_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"record_type must be one of: {valid_types}"
        )

    # Check patient exists
    patient = db.query(User).filter(
        User.id   == data.patient_id,
        User.role == "patient"
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    record = MedicalRecord(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)

    # Log the action
    log_action(db, AuditAction.CREATE_RECORD,
               user_id=current_user.id, user_role=current_user.role,
               resource="medical_records", resource_id=record.id,
               status="success",
               details=f"Created {data.record_type} for patient {data.patient_id}")

    return {
        "message":   "Medical record created",
        "record_id": record.id,
        "type":      record.record_type,
        "title":     record.title
    }


# ─────────────────────────────────────────────
# GET /records/my — Patient views own records
# «secrecy» — only their own records
# ─────────────────────────────────────────────
@router.get("/my")
def get_my_records(
    record_type:  Optional[str] = Query(None),
    db:           Session       = Depends(get_db),
    current_user: User          = Depends(get_current_user)
):
    # Only patients can use this endpoint
    if current_user.role != "patient":
        raise HTTPException(
            status_code=403,
            detail="This endpoint is for patients only. Doctors use /records/patient/{id}"
        )

    query = db.query(MedicalRecord).filter(
        MedicalRecord.patient_id == current_user.id
    )

    if record_type:
        query = query.filter(MedicalRecord.record_type == record_type)

    records = query.order_by(MedicalRecord.created_at.desc()).all()

    # Log the view
    log_action(db, AuditAction.VIEW_MED_RECORD,
               user_id=current_user.id, user_role=current_user.role,
               resource="medical_records", status="success",
               details=f"Patient viewed their {len(records)} records")

    return {
        "total": len(records),
        "data": [
            {
                "id":           r.id,
                "record_type":  r.record_type,
                "title":        r.title,
                "description":  r.description,
                "diagnosis":    r.diagnosis,
                "prescription": r.prescription,
                "notes":        r.notes,
                "doctor_id":    r.doctor_id,
                "created_at":   r.created_at,
            }
            for r in records
        ]
    }


# ─────────────────────────────────────────────
# GET /records/patient/{patient_id}
# Doctor or Admin views patient records
# «secrecy» + «rbac» enforced
# ─────────────────────────────────────────────
@router.get("/patient/{patient_id}")
def get_patient_records(
    patient_id:   int,
    record_type:  Optional[str] = Query(None),
    db:           Session       = Depends(get_db),
    current_user: User          = Depends(get_current_user)
):
    # «rbac» — only doctor or admin
    if current_user.role not in ["doctor", "admin"]:
        log_action(db, AuditAction.UNAUTHORIZED,
                   user_id=current_user.id, user_role=current_user.role,
                   resource="medical_records", resource_id=patient_id,
                   status="failed",
                   details="Patient tried to view another patient's records")
        raise HTTPException(
            status_code=403,
            detail="Only doctors or admins can view patient records"
        )

    query = db.query(MedicalRecord).filter(
        MedicalRecord.patient_id == patient_id
    )

    if record_type:
        query = query.filter(MedicalRecord.record_type == record_type)

    records = query.order_by(MedicalRecord.created_at.desc()).all()

    # Log the access — important for audit trail
    log_action(db, AuditAction.VIEW_MED_RECORD,
               user_id=current_user.id, user_role=current_user.role,
               resource="medical_records", resource_id=patient_id,
               status="success",
               details=f"{current_user.role} viewed records of patient {patient_id}")

    return {
        "patient_id": patient_id,
        "total":      len(records),
        "data": [
            {
                "id":           r.id,
                "record_type":  r.record_type,
                "title":        r.title,
                "description":  r.description,
                "diagnosis":    r.diagnosis,
                "prescription": r.prescription,
                "notes":        r.notes,
                "created_at":   r.created_at,
            }
            for r in records
        ]
    }


# ─────────────────────────────────────────────
# GET /records/{id} — Get single record
# «secrecy» — patient can only see own record
# ─────────────────────────────────────────────
@router.get("/{record_id}")
def get_record(
    record_id:    int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    record = db.query(MedicalRecord).filter(
        MedicalRecord.id == record_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    # «secrecy» — patient can only view their own record
    if current_user.role == "patient" and record.patient_id != current_user.id:
        log_action(db, AuditAction.UNAUTHORIZED,
                   user_id=current_user.id, user_role=current_user.role,
                   resource="medical_records", resource_id=record_id,
                   status="failed",
                   details="Patient tried to view another patient's record")
        raise HTTPException(status_code=403, detail="Access denied")

    log_action(db, AuditAction.VIEW_MED_RECORD,
               user_id=current_user.id, user_role=current_user.role,
               resource="medical_records", resource_id=record_id,
               status="success")

    return {
        "id":           record.id,
        "patient_id":   record.patient_id,
        "doctor_id":    record.doctor_id,
        "record_type":  record.record_type,
        "title":        record.title,
        "description":  record.description,
        "diagnosis":    record.diagnosis,
        "prescription": record.prescription,
        "notes":        record.notes,
        "created_at":   record.created_at,
        "updated_at":   record.updated_at,
    }


# ─────────────────────────────────────────────
# PUT /records/{id} — Update record
# «integrity» — only doctor/admin can update
# ─────────────────────────────────────────────
@router.put("/{record_id}")
def update_record(
    record_id:    int,
    data:         RecordUpdate,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    if current_user.role not in ["doctor", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only doctors or admins can update records"
        )

    record = db.query(MedicalRecord).filter(
        MedicalRecord.id == record_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    if data.title        is not None: record.title        = data.title
    if data.description  is not None: record.description  = data.description
    if data.diagnosis    is not None: record.diagnosis    = data.diagnosis
    if data.prescription is not None: record.prescription = data.prescription
    if data.notes        is not None: record.notes        = data.notes

    db.commit()
    db.refresh(record)

    log_action(db, AuditAction.UPDATE_RECORD,
               user_id=current_user.id, user_role=current_user.role,
               resource="medical_records", resource_id=record_id,
               status="success")

    return {"message": "Record updated", "id": record.id}


# ─────────────────────────────────────────────
# DELETE /records/{id} — Admin only
# ─────────────────────────────────────────────
@router.delete("/{record_id}")
def delete_record(
    record_id:    int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    record = db.query(MedicalRecord).filter(
        MedicalRecord.id == record_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    db.delete(record)
    db.commit()

    log_action(db, AuditAction.ADMIN_ACTION,
               user_id=current_user.id, user_role=current_user.role,
               resource="medical_records", resource_id=record_id,
               status="success", details="Record deleted by admin")

    return {"message": "Record deleted", "id": record_id}
