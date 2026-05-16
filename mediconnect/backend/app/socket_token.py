from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.security import decode_token, SECRET_KEY, ALGORITHM
from jose import jwt
from datetime import datetime, timedelta
import secrets

router = APIRouter()
bearer = HTTPBearer()

@router.get("/socket-token")
def get_socket_token(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        payload = decode_token(creds.credentials)
        token = jwt.encode(
            {
                "sub": payload.get("sub"),
                "type": "socket",
                "exp": datetime.utcnow() + timedelta(minutes=5),
                "jti": secrets.token_hex(16)
            },
            SECRET_KEY,
            algorithm=ALGORITHM
        )
        return {"socket_token": token}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
