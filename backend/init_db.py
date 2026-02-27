"""
Gap2Growth — init_db.py
Standalone script: creates the PostgreSQL database tables and seeds reference data.
Run once before starting the server:
    python init_db.py
Or set DATABASE_URL env var for a custom connection:
    DATABASE_URL=postgresql://user:pass@host:5432/gap2growth python init_db.py
"""
import sys
import os
from dotenv import load_dotenv
load_dotenv()  # pick up .env in the same directory

# ── Try to create the 'gap2growth' database if it doesn't exist ───────────────
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

DB_NAME = os.getenv("DB_NAME", "gap2growth")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")

print(f"[Init] Connecting to PostgreSQL at {DB_HOST}:{DB_PORT} as '{DB_USER}'...")
try:
    conn = psycopg2.connect(
        dbname="postgres",
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT,
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'")
    if not cur.fetchone():
        cur.execute(f"CREATE DATABASE {DB_NAME}")
        print(f"[Init] ✓ Database '{DB_NAME}' created.")
    else:
        print(f"[Init] ✓ Database '{DB_NAME}' already exists.")
    cur.close()
    conn.close()
except psycopg2.OperationalError as e:
    print(f"\n[Init] ✗ Could not connect to PostgreSQL!\n  Error: {e}")
    print("  Make sure PostgreSQL is running and credentials are correct.")
    print(f"  Default: postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/postgres")
    sys.exit(1)

# ── Set DATABASE_URL for SQLAlchemy ──────────────────────────────────────────
os.environ["DATABASE_URL"] = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

from database import engine
from models_db import Base, Skill, JobRole
from sqlalchemy.orm import Session

print("[Init] Creating all tables...")
Base.metadata.create_all(bind=engine)
print("[Init] ✓ Tables created.")

db = Session(bind=engine)

# ── Seed skills ───────────────────────────────────────────────────────────────
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
    "azure": 77, "gcp": 76, "nlp": 86, "computer vision": 83,
}

existing_skills = {s.name for s in db.query(Skill).all()}
added = 0
for category, skills in SKILL_GROUPS.items():
    for s in skills:
        if s not in existing_skills:
            db.add(Skill(name=s, category=category, demand_score=SKILL_DEMAND.get(s, 70)))
            added += 1
db.commit()
print(f"[Init] ✓ Seeded {added} skills ({db.query(Skill).count()} total).")

# ── Seed job roles ────────────────────────────────────────────────────────────
JOB_ROLES = {
    "ML Engineer":            {"required": ["python","tensorflow","pytorch","scikit-learn","machine learning","deep learning","docker","kubernetes","sql","git","mlops","linux"], "base_salary": 1400000, "growth": 34, "weight": 1.4},
    "Data Scientist":         {"required": ["python","r","pandas","numpy","scikit-learn","machine learning","sql","tableau","statistics","jupyter","matplotlib","deep learning"], "base_salary": 1200000, "growth": 28, "weight": 1.2},
    "Full Stack Developer":   {"required": ["javascript","react","node.js","html","css","sql","git","rest api","typescript","docker"], "base_salary": 1100000, "growth": 25, "weight": 1.1},
    "Backend Developer":      {"required": ["python","java","go","sql","postgresql","redis","docker","rest api","microservices","git","linux"], "base_salary": 1000000, "growth": 22, "weight": 1.0},
    "Frontend Developer":     {"required": ["javascript","typescript","react","html","css","git","webpack","rest api","testing"], "base_salary": 900000,  "growth": 20, "weight": 0.9},
    "DevOps Engineer":        {"required": ["kubernetes","docker","terraform","aws","ci/cd","linux","bash","ansible","jenkins","monitoring"], "base_salary": 1300000, "growth": 31, "weight": 1.3},
    "Cloud Architect":        {"required": ["aws","azure","gcp","kubernetes","terraform","networking","security","microservices","docker","python"], "base_salary": 1800000, "growth": 38, "weight": 1.6},
    "Data Engineer":          {"required": ["python","sql","spark","kafka","airflow","dbt","bigquery","etl","docker","data pipeline"], "base_salary": 1200000, "growth": 30, "weight": 1.2},
    "Cybersecurity Engineer": {"required": ["cybersecurity","python","linux","networking","cryptography","ethical hacking","siem","owasp"], "base_salary": 1400000, "growth": 32, "weight": 1.25},
    "Product Manager":        {"required": ["agile","scrum","product roadmap","jira","communication","analytics","user research","sql","leadership"], "base_salary": 1600000, "growth": 20, "weight": 1.2},
    "iOS Developer":          {"required": ["swift","xcode","ios","objective-c","git","rest api","testing","ui/ux"], "base_salary": 1200000, "growth": 18, "weight": 1.1},
    "Android Developer":      {"required": ["kotlin","java","android","android studio","rest api","git","testing"], "base_salary": 1100000, "growth": 18, "weight": 1.0},
}

existing_roles = {r.name for r in db.query(JobRole).all()}
r_added = 0
for name, data in JOB_ROLES.items():
    if name not in existing_roles:
        db.add(JobRole(
            name=name,
            required_skills=data["required"],
            base_salary=data["base_salary"],
            growth_pct=data["growth"],
            weight=data["weight"],
        ))
        r_added += 1
db.commit()
print(f"[Init] ✓ Seeded {r_added} job roles ({db.query(JobRole).count()} total).")

db.close()
print("\n[Init] ✅ Database initialized successfully!")
print(f"       You can now start the server: uvicorn main:app --reload --port 8000")
