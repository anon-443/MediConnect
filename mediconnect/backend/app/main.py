from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base

# Import ALL models so tables are auto-created
from app.models.user         import User
from app.models.appointment  import Appointment
from app.models.doctor       import Doctor
from app.models.disease      import Disease
from app.models.hospital     import Hospital
from app.models.consultation import Consultation

# Import ALL routers
from app.routes.auth          import router as auth_router
from app.routes.doctors       import router as doctors_router
from app.routes.diseases      import router as diseases_router
from app.routes.appointments  import router as appointments_router
from app.routes.hospitals     import router as hospitals_router
from app.routes.consultations import router as consultations_router

# Auto-create all tables in PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediConnect API",
    version="1.0.0",
    description="Medical Information, Hospital Finder and Doctor Consultation Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router,          prefix="/auth",          tags=["Auth"])
app.include_router(doctors_router,       prefix="/doctors",       tags=["Doctors"])
app.include_router(diseases_router,      prefix="/diseases",      tags=["Diseases"])
app.include_router(appointments_router,  prefix="/appointments",  tags=["Appointments"])
app.include_router(hospitals_router,     prefix="/hospitals",     tags=["Hospitals"])
app.include_router(consultations_router, prefix="/consultations", tags=["Consultations"])

@app.get("/")
def root():
    return {"message": "MediConnect API is running", "version": "1.0.0"}
