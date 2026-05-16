from sqlalchemy import Column, Integer, String, Boolean, Text
from app.db.database import Base

class Disease(Base):
    __tablename__ = "diseases"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(200), nullable=False, index=True)
    category    = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    symptoms    = Column(Text, nullable=True)   # comma-separated or JSON string
    causes      = Column(Text, nullable=True)
    treatment   = Column(Text, nullable=True)
    prevention  = Column(Text, nullable=True)
    severity    = Column(String(20), default="moderate")
    is_active   = Column(Boolean, default=True)
