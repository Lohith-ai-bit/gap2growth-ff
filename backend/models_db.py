"""
Gap2Growth — models_db.py
SQLAlchemy ORM table definitions.
"""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Integer, Float, DateTime,
    ForeignKey, Boolean
)
from sqlalchemy import JSON
from sqlalchemy.orm import relationship
from database import Base


def _uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=_uuid)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    analyses = relationship("ResumeAnalysis", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")


class Session(Base):
    """Tracks issued JWT tokens — allows future token revocation."""
    __tablename__ = "sessions"

    id = Column(String(36), primary_key=True, default=_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    token = Column(Text, unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="sessions")


class Skill(Base):
    """Master skill registry — seeded from SKILL_GROUPS in model.py."""
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120), unique=True, nullable=False, index=True)
    category = Column(String(60), nullable=True)   # e.g. 'ml_ai', 'programming'
    demand_score = Column(Integer, default=70)      # 0-100 from SKILL_DB
    created_at = Column(DateTime, default=datetime.utcnow)


class JobRole(Base):
    """Job role definitions — seeded from JOB_ROLES / JOBS constants."""
    __tablename__ = "job_roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120), unique=True, nullable=False, index=True)
    required_skills = Column(JSON, nullable=False, default=list)  # list of skill name strings
    base_salary = Column(Integer, default=1000000)
    growth_pct = Column(Integer, default=20)
    weight = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)


class ResumeAnalysis(Base):
    """Stores each analysis result against a user."""
    __tablename__ = "resume_analyses"

    id = Column(String(36), primary_key=True, default=_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    file_name = Column(String(255), nullable=True)
    job_role = Column(String(120), nullable=True)
    resume_text = Column(Text, nullable=True)           # raw extracted text
    result = Column(JSON, nullable=True)               # full analysis JSON
    ai_powered = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="analyses")
