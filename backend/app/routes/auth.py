from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas import UserCreate, UserOut, LoginRequest
from app.core import security
from app.email import send_reset_email
from app.models.user import User
from app.core.deps import get_current_user

router = APIRouter()


# ---------------- REGISTER ----------------
@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email exists")

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

    if not user or not security.verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

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
        "token_type": "bearer"
    }


# ---------------- FORGOT PASSWORD ----------------
@router.post("/forgot-password")
async def forgot_password(payload: dict, db: Session = Depends(get_db)):

    email = payload.get("email")

    user = db.query(User).filter(User.email == email).first()

    # security: always same response
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