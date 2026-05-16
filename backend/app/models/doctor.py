from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)

    experience = Column(String, nullable=True)
    fee = Column(String, nullable=True)
    hospital = Column(String, nullable=True)