from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from app.db.database import get_db
from app.models.user import User
from app.models.message import Message
from app.core.deps import get_current_user
from app.core.security import decode_token

router = APIRouter()

# Store active WebSocket connections
active_connections: dict[int, WebSocket] = {}

# Helper to get user from token for WebSocket
def get_user_from_token(token: str, db: Session):
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
        user = db.query(User).filter(User.id == user_id).first()
        return user
    except:
        return None


# WebSocket endpoint for chat
@router.websocket("/ws/chat/{token}")
async def websocket_chat(websocket: WebSocket, token: str):
    await websocket.accept()
    
    # Create a database session
    db = next(get_db())
    
    # Authenticate user
    current_user = get_user_from_token(token, db)
    if not current_user:
        await websocket.close(code=1008, reason="Invalid token")
        db.close()
        return
    
    user_id = current_user.id
    
    # Store connection
    active_connections[user_id] = websocket
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            receiver_id = message_data.get("receiver_id")
            message_text = message_data.get("message")
            
            if not receiver_id or not message_text:
                continue
            
            # Save message to database
            new_message = Message(
                sender_id=user_id,
                receiver_id=receiver_id,
                message=message_text
            )
            db.add(new_message)
            db.commit()
            db.refresh(new_message)
            
            # Prepare response
            response = {
                "id": new_message.id,
                "sender_id": user_id,
                "sender_name": current_user.name,
                "sender_role": current_user.role,
                "message": message_text,
                "timestamp": new_message.created_at.isoformat() if new_message.created_at else None
            }
            
            # Send to receiver if online
            if receiver_id in active_connections:
                await active_connections[receiver_id].send_text(json.dumps(response))
            
            # Send confirmation to sender
            await websocket.send_text(json.dumps({
                "status": "sent",
                "message_id": new_message.id
            }))
            
    except WebSocketDisconnect:
        # Remove connection on disconnect
        if user_id in active_connections:
            del active_connections[user_id]
    finally:
        db.close()


# REST endpoint to get chat history
@router.get("/messages/{other_user_id}")
def get_chat_history(
    other_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get all messages between current user and other user
    messages = db.query(Message).filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == other_user_id)) |
        ((Message.sender_id == other_user_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.created_at).all()
    
    return [
        {
            "id": m.id,
            "sender_id": m.sender_id,
            "receiver_id": m.receiver_id,
            "message": m.message,
            "is_read": m.is_read,
            "created_at": m.created_at.isoformat() if m.created_at else None
        }
        for m in messages
    ]


# REST endpoint to get users for chat
@router.get("/users")
def get_chat_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Different users see different contacts
    if current_user.role == "admin":
        users = db.query(User).filter(User.id != current_user.id).all()
    elif current_user.role == "doctor":
        # Doctors see all patients
        users = db.query(User).filter(User.role == "patient").all()
    else:
        # Patients see all doctors
        users = db.query(User).filter(User.role == "doctor").all()
    
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role
        }
        for u in users
    ]


# Mark message as read
@router.put("/messages/{message_id}/read")
def mark_as_read(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Only receiver can mark as read
    if message.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    message.is_read = True
    db.commit()
    
    return {"message": "Marked as read"}