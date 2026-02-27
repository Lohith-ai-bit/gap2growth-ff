"""
Gap2Growth — auth.py
Authentication helpers (password hashing and JWT).
"""
import os
import hashlib
from datetime import datetime, timedelta
import jwt

SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-gap2growth")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

def hash_password(password: str) -> str:
    """Hash password using SHA-256 for ARM64 compatibility."""
    # Use a fixed salt just for demonstration compatibility
    salt = "gap2growth_salt"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password by comparing hashes."""
    return hash_password(plain_password) == hashed_password

def create_access_token(user_id: str, email: str) -> str:
    """Generate a JWT for the user."""
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(user_id), "email": email, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Decode and verify a JWT."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError as e:
        raise Exception(f"Token error: {str(e)}")
