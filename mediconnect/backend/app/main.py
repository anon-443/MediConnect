from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base

# ── Import ALL models so tables are auto-created ──
from app.models.user           import User
from app.models.doctor         import Doctor
from app.models.appointment    import Appointment
from app.models.disease        import Disease
from app.models.hospital       import Hospital
from app.models.consultation   import Consultation
from app.models.medical_record import MedicalRecord
from app.models.audit_log      import AuditLog

# ── Import ALL routers ──
from app.routes.auth           import router as auth_router
from app.routes.doctors        import router as doctors_router
from app.routes.diseases       import router as diseases_router
from app.routes.appointments   import router as appointments_router
from app.routes.hospitals      import router as hospitals_router
from app.routes.consultations  import router as consultations_router
from app.routes.medical_records import router as records_router
from app.routes.admin          import router as admin_router

# Auto-create all tables in PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediConnect API",
    version="2.0.0",
    description="""
    Web-Based Disease Information, Hospital Finder & Doctor Consultation Platform.
    
    Security Features:
    - JWT Authentication with refresh tokens
    - Role-Based Access Control (Patient / Doctor / Admin)
    - Rate Limiting on login (5 attempts → 30 min block)
    - Audit Logging for all sensitive operations
    - Doctor License Verification
    - Medical Record Secrecy (patients see only their own)
    - bcrypt password hashing
    - SQL Injection protection via SQLAlchemy ORM
    - CORS configuration
    - Input validation via Pydantic
    - Secure password reset token
    """
)

# ── CORS Middleware ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register ALL routers ──
app.include_router(auth_router,          prefix="/auth",            tags=["Auth"])
app.include_router(doctors_router,       prefix="/doctors",         tags=["Doctors"])
app.include_router(diseases_router,      prefix="/diseases",        tags=["Diseases"])
app.include_router(appointments_router,  prefix="/appointments",    tags=["Appointments"])
app.include_router(hospitals_router,     prefix="/hospitals",       tags=["Hospitals"])
app.include_router(consultations_router, prefix="/consultations",   tags=["Consultations"])
app.include_router(records_router,       prefix="/records",         tags=["Medical Records"])
app.include_router(admin_router,         prefix="/admin",           tags=["Admin Management"])


@app.get("/")
def root():
    return {
        "message": "MediConnect API is running",
        "version": "2.0.0",
        "security_features": [
            "JWT Authentication",
            "Role-Based Access Control",
            "Rate Limiting",
            "Audit Logging",
            "Doctor License Verification",
            "Medical Record Secrecy",
            "bcrypt Password Hashing",
            "SQL Injection Protection",
            "CORS Configuration",
            "Input Validation",
            "Secure Password Reset"
        ]
    }
