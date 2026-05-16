from datetime import datetime, timedelta
from collections import defaultdict
from fastapi import HTTPException, Request


# ─────────────────────────────────────────────
# IN-MEMORY RATE LIMITER
# Tracks failed login attempts per IP address
# No extra packages needed — pure Python
# ─────────────────────────────────────────────

# Stores: { "ip_address": {"count": int, "first_attempt": datetime, "blocked_until": datetime} }
_login_attempts: dict = defaultdict(lambda: {
    "count":         0,
    "first_attempt": None,
    "blocked_until": None
})

MAX_ATTEMPTS   = 5           # Max failed attempts allowed
WINDOW_MINUTES = 15          # Time window in minutes
BLOCK_MINUTES  = 30          # Block duration after max attempts


def get_client_ip(request: Request) -> str:
    """Get real client IP — works behind proxy too"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host


def check_rate_limit(ip: str):
    """
    Check if IP is rate limited.
    Raises HTTPException 429 if blocked.
    """
    now  = datetime.utcnow()
    data = _login_attempts[ip]

    # ── Check if currently blocked ──
    if data["blocked_until"] and now < data["blocked_until"]:
        remaining = int((data["blocked_until"] - now).total_seconds() / 60) + 1
        raise HTTPException(
            status_code=429,
            detail=f"Too many failed login attempts. Try again in {remaining} minutes."
        )

    # ── Reset window if expired ──
    if data["first_attempt"]:
        window_end = data["first_attempt"] + timedelta(minutes=WINDOW_MINUTES)
        if now > window_end:
            reset_attempts(ip)


def record_failed_attempt(ip: str):
    """
    Record a failed login attempt for this IP.
    Blocks the IP after MAX_ATTEMPTS failures.
    """
    now  = datetime.utcnow()
    data = _login_attempts[ip]

    # Set first attempt time if this is the first failure
    if data["first_attempt"] is None:
        data["first_attempt"] = now

    data["count"] += 1

    # ── Block IP if max attempts reached ──
    if data["count"] >= MAX_ATTEMPTS:
        data["blocked_until"] = now + timedelta(minutes=BLOCK_MINUTES)
        raise HTTPException(
            status_code=429,
            detail=f"Too many failed login attempts. Your IP is blocked for {BLOCK_MINUTES} minutes."
        )


def reset_attempts(ip: str):
    """
    Reset failed attempts after successful login
    or after the time window expires.
    """
    _login_attempts[ip] = {
        "count":         0,
        "first_attempt": None,
        "blocked_until": None
    }


def get_attempts_info(ip: str) -> dict:
    """
    Returns current attempt info for an IP.
    Useful for debugging.
    """
    data = _login_attempts[ip]
    return {
        "ip":            ip,
        "failed_count":  data["count"],
        "max_allowed":   MAX_ATTEMPTS,
        "blocked_until": data["blocked_until"],
    }
