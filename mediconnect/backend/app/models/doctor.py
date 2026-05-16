from sqlalchemy import Column, Integer, String, Boolean
from app.db.database import Base
class Doctor(Base):
    __tablename__ = "doctors"

    id             = Column(Integer, primary_key=True, index=True)
    name           = Column(String(200), nullable=False)
    specialty      = Column(String(100), nullable=False)
    experience     = Column(String(100), nullable=True)
    fee            = Column(String(50), nullable=True)
    hospital       = Column(String(200), nullable=True)

    # ── License Verification (Assignment 1 requirement) ──
    license_number = Column(String(100), nullable=True, unique=True)
    is_verified    = Column(Boolean, default=False)   # Admin must verify doctor

    # ── Availability ──
    is_available   = Column(Boolean, default=True)
