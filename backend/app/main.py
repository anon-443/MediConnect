from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base

# IMPORTANT: import all models so tables are created
from app.models.user import User
from app.models.appointment import Appointment
from app.models.doctor import Doctor  # only if you have it
# from app.models.disease import Disease  # if exists

# routers
from app.routes.auth import router as auth_router
from app.routes.doctors import router as doctors_router
from app.routes.diseases import router as diseases_router
from app.routes.appointments import router as appointments_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="MediConnect API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(doctors_router, prefix="/doctors", tags=["Doctors"])
app.include_router(diseases_router, prefix="/diseases", tags=["Diseases"])
app.include_router(appointments_router, prefix="/appointments", tags=["Appointments"])


@app.get("/")
def root():
    return {"message": "MediConnect API running"}