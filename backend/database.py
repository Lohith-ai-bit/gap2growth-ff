"""
Gap2Growth — database.py
SQLAlchemy engine, session factory, and declarative base.
"""
import os
from dotenv import load_dotenv
load_dotenv()  # loads backend/.env automatically
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read from env, default to local PostgreSQL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/gap2growth"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a DB session, closes after request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
