from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_token
from typing import Optional

router = APIRouter()
bearer = HTTPBearer()

DISEASES = [
    {"id": 1, "name": "Diabetes", "category": "Chronic", "description": "Affects blood sugar levels in the body."},
    {"id": 2, "name": "Flu", "category": "Viral", "description": "Common viral infection affecting the respiratory system."},
    {"id": 3, "name": "Hypertension", "category": "Chronic", "description": "High blood pressure leading to heart disease."},
    {"id": 4, "name": "Asthma", "category": "Respiratory", "description": "A condition that affects the airways and breathing."},
    {"id": 5, "name": "Migraine", "category": "Neurological", "description": "Severe recurring headaches often with nausea."},
    {"id": 6, "name": "Anemia", "category": "Blood", "description": "Lack of enough healthy red blood cells in the body."},
    {"id": 7, "name": "Tuberculosis", "category": "Bacterial", "description": "A serious infection mainly affecting the lungs."},
    {"id": 8, "name": "Malaria", "category": "Parasitic", "description": "Caused by parasites spread through mosquito bites."},
    {"id": 9, "name": "Hepatitis B", "category": "Viral", "description": "A liver infection caused by the hepatitis B virus."},
    {"id": 10, "name": "Dengue", "category": "Viral", "description": "A mosquito-borne viral infection causing fever and pain."},
    {"id": 11, "name": "Arthritis", "category": "Chronic", "description": "Inflammation of joints causing pain and stiffness."},
    {"id": 12, "name": "Pneumonia", "category": "Bacterial", "description": "Infection inflaming the air sacs in the lungs."},
]

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        payload = decode_token(creds.credentials)
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.get("/")
def get_diseases(
    page: int = 1,
    limit: int = 12,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    filtered = DISEASES
    if search:
        filtered = [d for d in DISEASES if search.lower() in d["name"].lower()]
    total = len(filtered)
    start = (page - 1) * limit
    return {"total": total, "page": page, "limit": limit, "data": filtered[start:start + limit]}
