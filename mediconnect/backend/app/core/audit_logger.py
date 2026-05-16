# ─────────────────────────────────────────────────────────────
# AUDIT LOGGER UTILITY
# From Assignment 1 Misuse Case Mitigation:
# "Audit Logs detect unauthorized record access after the fact"
# Call log_action() from any route to record security events
# ─────────────────────────────────────────────────────────────
from sqlalchemy.orm import Session
from fastapi import Request
from app.models.audit_log import AuditLog
from datetime import datetime


# ── Action constants — use these everywhere for consistency ──
class AuditAction:
    LOGIN           = "LOGIN"
    LOGIN_FAILED    = "LOGIN_FAILED"
    LOGIN_BLOCKED   = "LOGIN_BLOCKED"
    LOGOUT          = "LOGOUT"
    REGISTER        = "REGISTER"
    VIEW_DISEASE    = "VIEW_DISEASE"
    VIEW_HOSPITAL   = "VIEW_HOSPITAL"
    VIEW_DOCTOR     = "VIEW_DOCTOR"
    VIEW_RECORD     = "VIEW_RECORD"
    CREATE_APPT     = "CREATE_APPOINTMENT"
    CANCEL_APPT     = "CANCEL_APPOINTMENT"
    BOOK_CONSULT    = "BOOK_CONSULTATION"
    VIEW_CONSULT    = "VIEW_CONSULTATION"
    UPDATE_CONSULT  = "UPDATE_CONSULTATION"
    CANCEL_CONSULT  = "CANCEL_CONSULTATION"
    CREATE_RECORD   = "CREATE_MEDICAL_RECORD"
    VIEW_MED_RECORD = "VIEW_MEDICAL_RECORD"
    UPDATE_RECORD   = "UPDATE_MEDICAL_RECORD"
    PASSWORD_RESET  = "PASSWORD_RESET"
    ADMIN_ACTION    = "ADMIN_ACTION"
    UNAUTHORIZED    = "UNAUTHORIZED_ACCESS_ATTEMPT"


def get_client_ip(request: Request) -> str:
    """Get real client IP — works behind proxy too"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


def log_action(
    db:          Session,
    action:      str,
    request:     Request      = None,
    user_id:     int          = None,
    user_role:   str          = None,
    resource:    str          = None,
    resource_id: int          = None,
    status:      str          = "success",
    details:     str          = None,
):
    """
    Record an audit log entry.
    Call this from any route after sensitive operations.
    
    Example:
        log_action(db, AuditAction.LOGIN, request=request,
                   user_id=user.id, user_role=user.role,
                   resource="auth", status="success")
    """
    ip = get_client_ip(request) if request else None

    entry = AuditLog(
        user_id     = user_id,
        user_role   = user_role,
        action      = action,
        resource    = resource,
        resource_id = resource_id,
        ip_address  = ip,
        status      = status,
        details     = details,
        timestamp   = datetime.utcnow()
    )

    db.add(entry)
    db.commit()
