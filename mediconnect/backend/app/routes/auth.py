from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas import UserCreate, UserOut, LoginRequest
from app.core import security
from app.core.rate_limiter import (
    check_rate_limit,
    record_failed_attempt,
    reset_attempts,
    get_client_ip
)
from app.email import send_reset_email
from app.models.user import User
from app.core.deps import get_current_user

router = APIRouter()


# ─────────────────────────────────────────────
# REGISTER
# ─────────────────────────────────────────────
@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):

    # Input validation — check empty fields
    if not user.name.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty")

    if not user.password or len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    # Check duplicate email
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Validate role
    allowed_roles = ["patient", "doctor", "admin"]
    if user.role not in allowed_roles:
        raise HTTPException(status_code=400, detail=f"Role must be one of: {allowed_roles}")

    new_user = User(
        name=user.name.strip(),
        email=user.email.lower().strip(),
        hashed_password=security.hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ─────────────────────────────────────────────
# LOGIN — WITH RATE LIMITING
# Max 5 failed attempts, then blocked 30 minutes
# ─────────────────────────────────────────────
@router.post("/login")
def login(
    data:     LoginRequest,
    request:  Request,
    response: Response,
    db:       Session = Depends(get_db)
):
    # Get client IP address
    ip = get_client_ip(request)

    # Check if IP is currently rate limited
    check_rate_limit(ip)

    # Find user by email
    user = db.query(User).filter(
        User.email == data.email.lower().strip()
    ).first()

    # Wrong email or password
    if not user or not security.verify_password(data.password, user.hashed_password):
        # Record failed attempt — will block after 5 failures
        record_failed_attempt(ip)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Check if user is active
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    # ── Login successful — reset failed attempts ──
    reset_attempts(ip)

    # Generate tokens
    access = security.create_access_token({
        "sub":  str(user.id),
        "role": user.role
    })

    refresh = security.create_refresh_token({
        "sub":  str(user.id),
        "role": user.role
    })

    # Set refresh token in HttpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        samesite="lax"
    )

    return {
        "access_token": access,
        "token_type":   "bearer",
        "user": {
            "id":    user.id,
            "name":  user.name,
            "email": user.email,
            "role":  user.role
        }
    }


# ─────────────────────────────────────────────
# LOGOUT
# ─────────────────────────────────────────────
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}


# ─────────────────────────────────────────────
# REFRESH TOKEN
# ─────────────────────────────────────────────
@router.post("/refresh")
def refresh_token(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("refresh_token")

    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")

    try:
        payload = security.decode_token(token)

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        user = db.query(User).filter(
            User.id == int(payload["sub"])
        ).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        new_access = security.create_access_token({
            "sub":  str(user.id),
            "role": user.role
        })

        return {"access_token": new_access, "token_type": "bearer"}

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ─────────────────────────────────────────────
# ME — Get current logged in user
# ─────────────────────────────────────────────
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id":         current_user.id,
        "name":       current_user.name,
        "email":      current_user.email,
        "role":       current_user.role,
        "is_active":  current_user.is_active,
        "created_at": current_user.created_at
    }


# ─────────────────────────────────────────────
# FORGOT PASSWORD
# ─────────────────────────────────────────────
@router.post("/forgot-password")
async def forgot_password(payload: dict, db: Session = Depends(get_db)):

    email = payload.get("email")

    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    user = db.query(User).filter(User.email == email.lower().strip()).first()

    # Always return same message for security — don't reveal if email exists
    if not user:
        return {"message": "If email exists, reset link will be sent"}

    token      = security.create_reset_token(user.email)
    reset_link = f"http://localhost:3000/reset-password?token={token}"

    await send_reset_email(user.email, reset_link)

    return {"message": "Reset link sent to email"}


# ─────────────────────────────────────────────
# RESET PASSWORD
# ─────────────────────────────────────────────
@router.post("/reset-password")
def reset_password(payload: dict, db: Session = Depends(get_db)):

    token        = payload.get("token")
    new_password = payload.get("new_password")

    if not token or not new_password:
        raise HTTPException(status_code=400, detail="Token and new password are required")

    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    try:
        email = security.verify_reset_token(token)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = security.hash_password(new_password)
    db.commit()

    return {"message": "Password reset successful"}
