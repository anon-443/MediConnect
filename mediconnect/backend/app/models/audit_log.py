# ─────────────────────────────────────────────────────────────
# AUDIT LOG MODEL
# From Assignment 1: "Audit Logs detect unauthorized record access"
# Every sensitive action is recorded here for security review
# ─────────────────────────────────────────────────────────────
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.db.database import Base
from datetime import datetime


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, nullable=True)        # who did the action (null = anonymous)
    user_role   = Column(String(50), nullable=True)     # patient / doctor / admin
    action      = Column(String(100), nullable=False)   # LOGIN, LOGOUT, VIEW_RECORD, etc.
    resource    = Column(String(100), nullable=True)    # which resource was accessed
    resource_id = Column(Integer, nullable=True)        # id of the resource
    ip_address  = Column(String(50), nullable=True)     # client IP address
    status      = Column(String(20), default="success") # success / failed / blocked
    details     = Column(Text, nullable=True)           # extra info
    timestamp   = Column(DateTime, default=datetime.utcnow)
