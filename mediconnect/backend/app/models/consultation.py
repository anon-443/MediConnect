from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from app.db.database import Base
from datetime import datetime


class Consultation(Base):
    __tablename__ = "consultations"

    id          = Column(Integer, primary_key=True, index=True)
    patient_id  = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id   = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    reason      = Column(String(500), nullable=True)
    status      = Column(String(50), default="pending")   # pending / confirmed / completed / cancelled
    diagnosis   = Column(Text, nullable=True)
    prescription= Column(Text, nullable=True)
    notes       = Column(Text, nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)