# ─────────────────────────────────────────────────────────────
# MEDICAL RECORDS MODEL
# From Assignment 1 DFD: Process 5.0 — Medical Records
# «secrecy» tag — data hidden from unauthorized users
# «integrity» tag — data cannot be tampered
# ─────────────────────────────────────────────────────────────
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from app.db.database import Base
from datetime import datetime


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id             = Column(Integer, primary_key=True, index=True)
    patient_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id      = Column(Integer, ForeignKey("doctors.id"), nullable=True)

    # ── Record Details ──
    record_type    = Column(String(100), nullable=False)   # diagnosis / prescription / lab_result / note
    title          = Column(String(200), nullable=False)
    description    = Column(Text, nullable=True)
    diagnosis      = Column(Text, nullable=True)
    prescription   = Column(Text, nullable=True)
    notes          = Column(Text, nullable=True)

    # ── Timestamps ──
    created_at     = Column(DateTime, default=datetime.utcnow)
    updated_at     = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
