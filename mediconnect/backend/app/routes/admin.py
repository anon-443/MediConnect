# ─────────────────────────────────────────────────────────────
# ADMIN MANAGEMENT ROUTES
# From Assignment 1 DFD: Process 6.0 — Admin Management
# «rbac» — admin only access throughout
# Includes: Stats, User management, Doctor verification,
#           Audit log viewing
# ─────────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.user         import User
from app.models.doctor       import Doctor
from app.models.appointment  import Appointment
from app.models.disease      import Disease
from app.models.hospital     import Hospital
from app.models.consultation import Consultation
from app.models.audit_log    import AuditLog
from app.core.audit_logger   import log_action, AuditAction

router = APIRouter()


# ─────────────────────────────────────────────
# RBAC — Admin only for everything here
# ─────────────────────────────────────────────
def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return current_user


# ─────────────────────────────────────────────
# GET /admin/stats — Dashboard Statistics
# From DFD Process 6.0 — Admin sees full system stats
# ─────────────────────────────────────────────
@router.get("/stats")
def get_admin_stats(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(require_admin)
):
    total_users         = db.query(User).count()
    total_patients      = db.query(User).filter(User.role == "patient").count()
    total_doctors       = db.query(User).filter(User.role == "doctor").count()
    total_admins        = db.query(User).filter(User.role == "admin").count()
    active_users        = db.query(User).filter(User.is_active == True).count()
    total_appointments  = db.query(Appointment).count()
    total_consultations = db.query(Consultation).count()
    total_diseases      = db.query(Disease).count()
    total_hospitals     = db.query(Hospital).count()
    total_audit_logs    = db.query(AuditLog).count()

    # Pending consultations
    pending_consults = db.query(Consultation).filter(
        Consultation.status == "pending"
    ).count()

    # Failed login attempts in audit logs
    failed_logins = db.query(AuditLog).filter(
        AuditLog.action == AuditAction.LOGIN_FAILED
    ).count()

    # Unauthorized access attempts
    unauthorized_attempts = db.query(AuditLog).filter(
        AuditLog.action == AuditAction.UNAUTHORIZED
    ).count()

    log_action(db, AuditAction.ADMIN_ACTION,
               user_id=current_user.id, user_role="admin",
               resource="admin_stats", status="success",
               details="Admin viewed system stats")

    return {
        "users": {
            "total":    total_users,
            "patients": total_patients,
            "doctors":  total_doctors,
            "admins":   total_admins,
            "active":   active_users,
        },
        "activity": {
            "total_appointments":  total_appointments,
            "total_consultations": total_consultations,
            "pending_consults":    pending_consults,
        },
        "content": {
            "total_diseases":  total_diseases,
            "total_hospitals": total_hospitals,
        },
        "security": {
            "total_audit_logs":       total_audit_logs,
            "failed_login_attempts":  failed_logins,
            "unauthorized_attempts":  unauthorized_attempts,
        }
    }


# ─────────────────────────────────────────────
# GET /admin/users — List all users
# ─────────────────────────────────────────────
@router.get("/users")
def get_all_users(
    role:         Optional[str] = Query(None),
    is_active:    Optional[bool] = Query(None),
    page:         int            = Query(1, ge=1),
    limit:        int            = Query(20, ge=1, le=100),
    db:           Session        = Depends(get_db),
    current_user: User           = Depends(require_admin)
):
    query = db.query(User)

    if role:
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)

    total = query.count()
    users = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page":  page,
        "data": [
            {
                "id":         u.id,
                "name":       u.name,
                "email":      u.email,
                "role":       u.role,
                "is_active":  u.is_active,
                "created_at": u.created_at,
            }
            for u in users
        ]
    }


# ─────────────────────────────────────────────
# PUT /admin/users/{id}/deactivate
# Admin can deactivate any user account
# ─────────────────────────────────────────────
@router.put("/users/{user_id}/deactivate")
def deactivate_user(
    user_id:      int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate your own account")

    user.is_active = False
    db.commit()

    log_action(db, AuditAction.ADMIN_ACTION,
               user_id=current_user.id, user_role="admin",
               resource="users", resource_id=user_id,
               status="success", details=f"Admin deactivated user {user.email}")

    return {"message": f"User {user.name} deactivated", "id": user_id}


# ─────────────────────────────────────────────
# PUT /admin/users/{id}/activate
# Admin re-activates a user
# ─────────────────────────────────────────────
@router.put("/users/{user_id}/activate")
def activate_user(
    user_id:      int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = True
    db.commit()

    log_action(db, AuditAction.ADMIN_ACTION,
               user_id=current_user.id, user_role="admin",
               resource="users", resource_id=user_id,
               status="success", details=f"Admin activated user {user.email}")

    return {"message": f"User {user.name} activated", "id": user_id}


# ─────────────────────────────────────────────
# PUT /admin/doctors/{id}/verify
# From Assignment 1: "License Verification ensures
# only real doctors can register"
# ─────────────────────────────────────────────
@router.put("/doctors/{doctor_id}/verify")
def verify_doctor(
    doctor_id:    int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(require_admin)
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    doctor.is_verified = True
    db.commit()

    log_action(db, AuditAction.ADMIN_ACTION,
               user_id=current_user.id, user_role="admin",
               resource="doctors", resource_id=doctor_id,
               status="success",
               details=f"Admin verified doctor {doctor.name} (License: {doctor.license_number})")

    return {
        "message":        f"Doctor {doctor.name} verified successfully",
        "doctor_id":      doctor_id,
        "is_verified":    True,
        "license_number": doctor.license_number
    }


# ─────────────────────────────────────────────
# GET /admin/audit-logs — View security audit logs
# Admin sees all security events
# ─────────────────────────────────────────────
@router.get("/audit-logs")
def get_audit_logs(
    action:    Optional[str] = Query(None),
    user_id:   Optional[int] = Query(None),
    status:    Optional[str] = Query(None),
    page:      int           = Query(1, ge=1),
    limit:     int           = Query(50, ge=1, le=200),
    db:        Session       = Depends(get_db),
    current_user: User       = Depends(require_admin)
):
    query = db.query(AuditLog)

    if action:
        query = query.filter(AuditLog.action == action)
    if user_id:
        query = query.filter(AuditLog.user_id == user_id)
    if status:
        query = query.filter(AuditLog.status == status)

    total = query.count()
    logs  = query.order_by(AuditLog.timestamp.desc()).offset(
        (page - 1) * limit
    ).limit(limit).all()

    return {
        "total": total,
        "page":  page,
        "data": [
            {
                "id":          l.id,
                "user_id":     l.user_id,
                "user_role":   l.user_role,
                "action":      l.action,
                "resource":    l.resource,
                "resource_id": l.resource_id,
                "ip_address":  l.ip_address,
                "status":      l.status,
                "details":     l.details,
                "timestamp":   l.timestamp,
            }
            for l in logs
        ]
    }


# ─────────────────────────────────────────────
# GET /admin/audit-logs/security — Security summary
# Shows failed logins, unauthorized attempts etc.
# ─────────────────────────────────────────────
@router.get("/audit-logs/security")
def get_security_summary(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(require_admin)
):
    failed_logins = db.query(AuditLog).filter(
        AuditLog.action == AuditAction.LOGIN_FAILED
    ).order_by(AuditLog.timestamp.desc()).limit(20).all()

    blocked_ips = db.query(AuditLog).filter(
        AuditLog.action == AuditAction.LOGIN_BLOCKED
    ).order_by(AuditLog.timestamp.desc()).limit(20).all()

    unauthorized = db.query(AuditLog).filter(
        AuditLog.action == AuditAction.UNAUTHORIZED
    ).order_by(AuditLog.timestamp.desc()).limit(20).all()

    return {
        "failed_logins": [
            {"ip": l.ip_address, "timestamp": l.timestamp, "details": l.details}
            for l in failed_logins
        ],
        "blocked_ips": [
            {"ip": l.ip_address, "timestamp": l.timestamp}
            for l in blocked_ips
        ],
        "unauthorized_attempts": [
            {"user_id": l.user_id, "resource": l.resource, "timestamp": l.timestamp, "details": l.details}
            for l in unauthorized
        ]
    }
