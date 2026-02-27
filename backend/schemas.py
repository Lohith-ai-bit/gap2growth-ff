"""
Gap2Growth — schemas.py
Pydantic request/response models for all API endpoints.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from datetime import datetime


# ─── Auth ─────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    token: str
    user: UserOut


# ─── Analysis ─────────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    resumeText: str
    jobRole: str = "Full Stack Developer"
    jobDescription: str = ""
    fileName: str = ""          # passed from frontend for storage


class AnalysisOut(BaseModel):
    id: str
    file_name: Optional[str]
    job_role: Optional[str]
    result: Optional[Any]
    ai_powered: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Skills / Jobs (read-only) ────────────────────────────────────────────────

class SkillOut(BaseModel):
    id: int
    name: str
    category: Optional[str]
    demand_score: int

    class Config:
        from_attributes = True

class JobRoleOut(BaseModel):
    id: int
    name: str
    required_skills: list
    base_salary: int
    growth_pct: int
    weight: float

    class Config:
        from_attributes = True
