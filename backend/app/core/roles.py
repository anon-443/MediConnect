from fastapi import HTTPException, Depends
from app.core.deps import get_current_user

def require_role(required_role: str):
    def role_checker(current_user = Depends(get_current_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=403, 
                detail=f"Access denied. {required_role} role required. Your role: {current_user.role}"
            )
        return current_user
    return role_checker

require_admin = require_role("admin")
require_doctor = require_role("doctor")
require_patient = require_role("patient")

def require_doctor_or_admin(current_user = Depends(get_current_user)):
    if current_user.role not in ["doctor", "admin"]:
        raise HTTPException(
            status_code=403, 
            detail="Access denied. Doctor or Admin role required"
        )
    return current_user