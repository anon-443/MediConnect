from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.db.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer)
    date = Column(String)
    time = Column(String)
    reason = Column(String)
    status = Column(String, default="pending")