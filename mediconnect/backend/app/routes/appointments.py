from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.appointment import Appointment
from app.models.user import User

router = APIRouter()


# =========================
# CREATE APPOINTMENT
# =========================
@router.post("/")
def create_appointment(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # validate date format
        datetime.strptime(data["date"], "%Y-%m-%d")

        new_appt = Appointment(
            user_id=current_user.id,
            doctor_id=data["doctor_id"],
            date=data["date"],
            time=data["time"],
            reason=data.get("reason", ""),
            status="pending"
        )

        db.add(new_appt)
        db.commit()
        db.refresh(new_appt)

        return {
            "message": "Appointment created",
            "appointment": {
                "id": new_appt.id,
                "user_id": new_appt.user_id,
                "doctor_id": new_appt.doctor_id,
                "date": new_appt.date,
                "time": new_appt.time,
                "reason": new_appt.reason,
                "status": new_appt.status
            }
        }

    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing field: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# GET APPOINTMENTS
# =========================
@router.get("/")
def get_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    appts = db.query(Appointment).filter(
        Appointment.user_id == current_user.id
    ).all()

    return {
        "total": len(appts),
        "data": appts
    }


# =========================
# CANCEL APPOINTMENT
# =========================
@router.delete("/{appointment_id}")
def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    appt = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.user_id == current_user.id
    ).first()

    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt.status = "cancelled"
    db.commit()

    return {
        "message": "Cancelled",
        "appointment": {
            "id": appt.id,
            "status": appt.status
        }
    }