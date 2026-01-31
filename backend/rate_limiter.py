"""
Rate Limiter - In-memory IP-based rate limiting
Limits: 10 commands per day per IP
"""
from datetime import datetime, date
from fastapi import Request, HTTPException, status

# In-memory storage: { "ip": { "date": "YYYY-MM-DD", "count": N } }
_rate_limit_store: dict[str, dict] = {}

MAX_COMMANDS_PER_DAY = 10


def check_rate_limit(request: Request) -> dict:
    """
    Dependency that checks and updates rate limit for the requesting IP.
    Returns remaining count on success, raises HTTPException if limit exceeded.
    """
    # Get client IP (handle proxies)
    client_ip = request.client.host if request.client else "unknown"
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    
    today = date.today().isoformat()
    
    # Initialize or reset for new day
    if client_ip not in _rate_limit_store:
        _rate_limit_store[client_ip] = {"date": today, "count": 0}
    elif _rate_limit_store[client_ip]["date"] != today:
        _rate_limit_store[client_ip] = {"date": today, "count": 0}
    
    current = _rate_limit_store[client_ip]
    
    # Check limit
    if current["count"] >= MAX_COMMANDS_PER_DAY:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={"error": "LIMIT_EXCEEDED", "limit": MAX_COMMANDS_PER_DAY}
        )
    
    # Increment count
    current["count"] += 1
    remaining = MAX_COMMANDS_PER_DAY - current["count"]
    
    return {"remaining": remaining, "used": current["count"], "limit": MAX_COMMANDS_PER_DAY}
