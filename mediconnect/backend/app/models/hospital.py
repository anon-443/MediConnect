from sqlalchemy import Column, Integer, String, Float, Boolean
from app.db.database import Base


class Hospital(Base):
    __tablename__ = "hospitals"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(200), nullable=False)
    city        = Column(String(100), nullable=False)
    address     = Column(String(300), nullable=True)
    phone       = Column(String(50), nullable=True)
    type        = Column(String(50), nullable=True)   # Government / Private
    beds        = Column(Integer, nullable=True)
    specialties = Column(String(500), nullable=True)  # comma-separated
    latitude    = Column(Float, nullable=True)
    longitude   = Column(Float, nullable=True)
    is_active   = Column(Boolean, default=True)
