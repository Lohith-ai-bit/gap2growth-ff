"""
Gap2Growth ML Backend — main.py
FastAPI server with PostgreSQL-backed auth + analysis persistence.
"""
# Load .env FIRST before any other imports that read os.getenv
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from database import get_db, engine
from models_db import Base, User, Session as DBSession, Skill, JobRole, ResumeAnalysis
from schemas import (
    RegisterRequest, LoginRequest, AuthResponse, UserOut,
    AnalyzeRequest, AnalysisOut, SkillOut, JobRoleOut,
)
from auth import hash_password, verify_password, create_access_token, decode_token
from model import get_model

# ─── Skill & job role seed data (mirrors frontend constants) ─────────────────
SKILL_GROUPS = {
    "programming": ["python","java","javascript","typescript","c++","c#","go","rust","scala","kotlin","swift","r","matlab","perl","ruby","php","bash","shell"],
    "ml_ai": ["machine learning","deep learning","neural network","nlp","computer vision","reinforcement learning","tensorflow","pytorch","keras","scikit-learn","xgboost","lightgbm","huggingface","transformers","bert","gpt","llm","diffusion","gan"],
    "data": ["pandas","numpy","scipy","matplotlib","seaborn","plotly","tableau","power bi","sql","nosql","spark","hadoop","hive","kafka","airflow","dbt","etl","data pipeline","data warehouse","bigquery","redshift","snowflake"],
    "cloud": ["aws","azure","gcp","google cloud","lambda","ec2","s3","docker","kubernetes","terraform","ansible","jenkins","ci/cd","devops","mlops","sagemaker","vertex ai","azure ml"],
    "web": ["react","vue","angular","node.js","express","django","flask","fastapi","rest api","graphql","html","css","tailwind","next.js","typescript","webpack","vite"],
    "database": ["mysql","postgresql","mongodb","redis","elasticsearch","cassandra","dynamodb","sqlite","oracle","firebase","supabase"],
    "security": ["cybersecurity","penetration testing","ethical hacking","cryptography","owasp","soc","siem","network security","iam","oauth","jwt"],
    "mobile": ["android","ios","react native","flutter","swift","kotlin","xcode","android studio"],
    "soft": ["agile","scrum","kanban","leadership","communication","teamwork","problem solving","critical thinking","project management","jira","confluence"],
    "data_science_tools": ["jupyter","colab","vs code","git","github","gitlab","docker","linux","bash","api","rest","json","xml"],
}

SKILL_DEMAND = {
    "python": 85, "javascript": 80, "react": 78, "node.js": 72, "typescript": 75,
    "sql": 70, "machine learning": 88, "deep learning": 84, "tensorflow": 82,
    "pytorch": 81, "fastapi": 74, "docker": 76, "kubernetes": 79, "aws": 83,
    "azure": 77, "gcp": 76, "nlp": 86, "computer vision": 83, "java": 68,
}

JOB_ROLES_SEED = {
    "ML Engineer":            {"required": ["python","tensorflow","pytorch","scikit-learn","machine learning","deep learning","docker","kubernetes","sql","git","mlops","linux"], "base_salary": 1400000, "growth": 34, "weight": 1.4},
    "Data Scientist":         {"required": ["python","r","pandas","numpy","scikit-learn","machine learning","sql","tableau","statistics","jupyter","matplotlib","deep learning"], "base_salary": 1200000, "growth": 28, "weight": 1.2},
    "Full Stack Developer":   {"required": ["javascript","react","node.js","html","css","sql","git","rest api","typescript","docker"], "base_salary": 1100000, "growth": 25, "weight": 1.1},
    "Backend Developer":      {"required": ["python","java","go","sql","postgresql","redis","docker","rest api","microservices","git","linux"], "base_salary": 1000000, "growth": 22, "weight": 1.0},
    "Frontend Developer":     {"required": ["javascript","typescript","react","html","css","git","webpack","rest api","testing"], "base_salary": 900000, "growth": 20, "weight": 0.9},
    "DevOps Engineer":        {"required": ["kubernetes","docker","terraform","aws","ci/cd","linux","bash","ansible","jenkins","monitoring"], "base_salary": 1300000, "growth": 31, "weight": 1.3},
    "Cloud Architect":        {"required": ["aws","azure","gcp","kubernetes","terraform","networking","security","microservices","docker","python"], "base_salary": 1800000, "growth": 38, "weight": 1.6},
    "Data Engineer":          {"required": ["python","sql","spark","kafka","airflow","dbt","bigquery","etl","docker","data pipeline"], "base_salary": 1200000, "growth": 30, "weight": 1.2},
    "Cybersecurity Engineer": {"required": ["cybersecurity","python","linux","networking","cryptography","ethical hacking","siem","owasp"], "base_salary": 1400000, "growth": 32, "weight": 1.25},
    "Product Manager":        {"required": ["agile","scrum","product roadmap","jira","communication","analytics","user research","sql","leadership"], "base_salary": 1600000, "growth": 20, "weight": 1.2},
    "iOS Developer":          {"required": ["swift","xcode","ios","objective-c","git","rest api","testing","ui/ux"], "base_salary": 1200000, "growth": 18, "weight": 1.1},
    "Android Developer":      {"required": ["kotlin","java","android","android studio","rest api","git","testing"], "base_salary": 1100000, "growth": 18, "weight": 1.0},
}


app = FastAPI(title="Gap2Growth AI", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # allow all origins — safe for local dev
    allow_credentials=True,    # explicitly allow credentials (cookies, auth headers)
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


# ─── Startup: create tables + seed reference data ────────────────────────────

@app.on_event("startup")
async def startup():
    print("[Server] Creating DB tables...")
    Base.metadata.create_all(bind=engine)
    print("[Server] Tables ready.")

    db = next(get_db())
    try:
        _seed_skills(db)
        _seed_job_roles(db)
    finally:
        db.close()

    print("[Server] Loading / training ML model...")
    get_model()
    print("[Server] All systems ready!")


def _seed_skills(db: Session):
    count = 0
    existing_names = {s.name for s in db.query(Skill.name).all()}
    for category, skills in SKILL_GROUPS.items():
        for skill_name in skills:
            if skill_name not in existing_names:
                db.add(Skill(
                    name=skill_name,
                    category=category,
                    demand_score=SKILL_DEMAND.get(skill_name, 70),
                ))
                existing_names.add(skill_name)  # prevent duplicate across categories
                count += 1
    if count:
        try:
            db.commit()
            print(f"[Server] Seeded {count} skills.")
        except Exception as e:
            db.rollback()
            print(f"[Server] Skills already seeded (skipped): {e}")
    else:
        print("[Server] Skills already in DB, skipping seed.")


def _seed_job_roles(db: Session):
    count = 0
    existing_names = {r.name for r in db.query(JobRole.name).all()}
    for name, data in JOB_ROLES_SEED.items():
        if name not in existing_names:
            db.add(JobRole(
                name=name,
                required_skills=data["required"],
                base_salary=data["base_salary"],
                growth_pct=data["growth"],
                weight=data["weight"],
            ))
            count += 1
    if count:
        try:
            db.commit()
            print(f"[Server] Seeded {count} job roles.")
        except Exception as e:
            db.rollback()
            print(f"[Server] Job roles already seeded (skipped): {e}")
    else:
        print("[Server] Job roles already in DB, skipping seed.")


# ─── Auth helpers ─────────────────────────────────────────────────────────────

def _get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Optional[User]:
    """Extract user from Bearer token. Returns None if not provided."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ", 1)[1]
    try:
        payload = decode_token(token)
        user = db.query(User).filter(User.id == payload["sub"]).first()
        return user
    except Exception:
        return None


def _require_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    """Like _get_current_user but raises 401 if not authenticated."""
    user = _get_current_user(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated. Please log in.")
    return user


# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "model_ready": get_model().is_trained}


# ─── Auth endpoints ───────────────────────────────────────────────────────────

@app.post("/auth/register", response_model=AuthResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    if not req.name.strip():
        raise HTTPException(status_code=400, detail="Name is required.")

    user = User(
        id=str(uuid.uuid4()),
        name=req.name.strip(),
        email=req.email.lower().strip(),
        password_hash=hash_password(req.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, user.email)
    db_session = DBSession(
        id=str(uuid.uuid4()),
        user_id=user.id,
        token=token,
    )
    db.add(db_session)
    db.commit()

    return AuthResponse(token=token, user=UserOut.from_orm(user))


@app.post("/auth/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(user.id, user.email)
    db_session = DBSession(
        id=str(uuid.uuid4()),
        user_id=user.id,
        token=token,
    )
    db.add(db_session)
    db.commit()

    return AuthResponse(token=token, user=UserOut.from_orm(user))


@app.get("/auth/me", response_model=UserOut)
def me(user: User = Depends(_require_user)):
    return UserOut.from_orm(user)


# ─── Analysis endpoints ───────────────────────────────────────────────────────

@app.post("/analyze")
def analyze(
    req: AnalyzeRequest,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    model = get_model()
    result = model.analyze(req.resumeText, req.jobRole, req.jobDescription)

    # Persist if user is authenticated
    current_user = _get_current_user(authorization, db)
    if current_user:
        analysis = ResumeAnalysis(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            file_name=req.fileName or None,
            job_role=req.jobRole,
            resume_text=req.resumeText[:5000],   # truncate to 5K chars for storage
            result=result,
            ai_powered=True,
        )
        db.add(analysis)
        db.commit()

    return result


@app.get("/analyses", response_model=list[AnalysisOut])
def get_analyses(user: User = Depends(_require_user), db: Session = Depends(get_db)):
    """Return all past resume analyses for the authenticated user, newest first."""
    rows = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.user_id == user.id)
        .order_by(ResumeAnalysis.created_at.desc())
        .all()
    )
    return [AnalysisOut.from_orm(r) for r in rows]


# ─── Reference data endpoints ─────────────────────────────────────────────────

@app.get("/skills", response_model=list[SkillOut])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).order_by(Skill.name).all()


@app.get("/job-roles", response_model=list[JobRoleOut])
def get_job_roles(db: Session = Depends(get_db)):
    return db.query(JobRole).order_by(JobRole.name).all()
