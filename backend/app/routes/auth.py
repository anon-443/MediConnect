from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import re

from app.db.database import get_db
from app.schemas import UserCreate, UserOut, LoginRequest
from app.core import security
from app.email import send_reset_email
from app.models.user import User
from app.core.deps import get_current_user
from app.core.roles import require_admin, require_doctor

router = APIRouter()

MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def validate_password_strength(password: str):
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    if not re.search(r'[A-Z]', password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")
    if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
        raise HTTPException(status_code=400, detail="Password must contain at least one special character")


# ---------------- REGISTER ----------------
@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Password strength validation
    validate_password_strength(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=security.hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ---------------- LOGIN ----------------
@router.post("/login")
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    # If user not found — generic error (don't reveal if email exists)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Check if account is locked
    if user.locked_until and datetime.utcnow() < user.locked_until:
        remaining = int((user.locked_until - datetime.utcnow()).total_seconds() / 60)
        raise HTTPException(
            status_code=403,
            detail=f"Account locked due to too many failed attempts. Try again in {remaining} minutes."
        )

    # Check password
    if not security.verify_password(data.password, user.hashed_password):
        user.failed_attempts = (user.failed_attempts or 0) + 1

        if user.failed_attempts >= MAX_ATTEMPTS:
            user.locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_MINUTES)
            db.commit()
            raise HTTPException(
                status_code=403,
                detail=f"Account locked after {MAX_ATTEMPTS} failed attempts. Try again in {LOCKOUT_MINUTES} minutes."
            )

        db.commit()
        remaining = MAX_ATTEMPTS - user.failed_attempts
        raise HTTPException(
            status_code=401,
            detail=f"Invalid email or password. {remaining} attempts remaining."
        )

    # Check if account is disabled
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account has been disabled")

    # Successful login — reset failed attempts
    user.failed_attempts = 0
    user.locked_until = None
    db.commit()

    access = security.create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    refresh = security.create_refresh_token({
        "sub": str(user.id),
        "role": user.role
    })

    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True
    )

    return {
        "access_token": access,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }


# ---------------- FORGOT PASSWORD ----------------
@router.post("/forgot-password")
async def forgot_password(payload: dict, db: Session = Depends(get_db)):

    email = payload.get("email")
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"message": "If email exists, reset link will be sent"}

    token = security.create_reset_token(user.email)
    reset_link = f"http://localhost:3000/reset-password?token={token}"
    await send_reset_email(user.email, reset_link)

    return {"message": "Reset link sent to email"}


# ---------------- RESET PASSWORD ----------------
@router.post("/reset-password")
def reset_password(payload: dict, db: Session = Depends(get_db)):

    token = payload.get("token")
    new_password = payload.get("new_password")

    if not token or not new_password:
        raise HTTPException(status_code=400, detail="Token and new password are required")

    # Validate new password strength
    validate_password_strength(new_password)

    try:
        email = security.verify_reset_token(token)
    except:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = security.hash_password(new_password)
    db.commit()

    return {"message": "Password reset successful"}


# ---------------- ME ----------------
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ---------------- ROLE TEST ENDPOINTS ----------------
@router.get("/admin-test")
def admin_only_test(current_user = Depends(require_admin)):
    return {"message": "You are an admin! Full access granted."}

@router.get("/doctor-test")
def doctor_only_test(current_user = Depends(require_doctor)):
    return {"message": "You are a doctor! Medical access granted."}