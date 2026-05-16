from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os
import logging

load_dotenv()

logger = logging.getLogger("email")

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

fm = FastMail(conf)

async def send_reset_email(email: str, reset_link: str):
    try:
        message = MessageSchema(
            subject="MediConnect Password Reset",
            recipients=[email],
            body=f"""
            <h3>Password Reset Request</h3>
            <p>Click the link below to reset your password:</p>
            <a href="{reset_link}">{reset_link}</a>
            <p>This link expires in 30 minutes.</p>
            """,
            subtype="html"
        )
        await fm.send_message(message)
        logger.info(f"Reset email sent to {email}")
    except Exception as e:
        logger.error(f"Email sending failed: {str(e)}")
        raise