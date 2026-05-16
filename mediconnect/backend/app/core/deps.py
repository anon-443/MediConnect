from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db.database import get_db
from app.models.user import User

bearer = HTTPBearer()

def get_current_user(token=Depends(bearer), db: Session = Depends(get_db)):
    try:
        payload = decode_token(token.credentials)

        if payload["type"] != "access":
            raise HTTPException(status_code=401)

        user = db.query(User).filter(User.id == int(payload["sub"])).first()

        if not user:
            raise HTTPException(status_code=404)

        return user

    except:
        raise HTTPException(status_code=401, detail="Invalid token")