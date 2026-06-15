from sqlalchemy import Column, Integer, String, Text, ARRAY, TIMESTAMP
from sqlalchemy.sql import func
from app.db.database import Base

class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    symptoms = Column(ARRAY(String))
    description = Column(Text)
    precautions = Column(ARRAY(String))
    medication = Column(ARRAY(String))
    diet_recommendations = Column(ARRAY(String))
    created_at = Column(TIMESTAMP, server_default=func.now())