"""
Gap2Growth ML Backend — model.py
Rule-based fallback for Windows ARM64 compatibility.
"""
import os, re, json
import random

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)

# ─── Comprehensive skill dictionary ─────────────────────────────────────────
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

ALL_SKILLS = []
for group in SKILL_GROUPS.values():
    ALL_SKILLS.extend(group)
ALL_SKILLS = list(set(ALL_SKILLS))

# ─── Job role definitions with required skill sets ───────────────────────────
JOB_ROLES = {
    "ML Engineer": {
        "required": ["python","tensorflow","pytorch","scikit-learn","machine learning","deep learning","docker","kubernetes","sql","git","mlops","linux"],
        "base_salary": 1400000, "growth": 34, "weight": 1.4,
    },
    "Data Scientist": {
        "required": ["python","r","pandas","numpy","scikit-learn","machine learning","sql","tableau","statistics","jupyter","matplotlib","deep learning"],
        "base_salary": 1200000, "growth": 28, "weight": 1.2,
    },
    "Full Stack Developer": {
        "required": ["javascript","react","node.js","html","css","sql","git","rest api","typescript","docker"],
        "base_salary": 1100000, "growth": 25, "weight": 1.1,
    },
    "Backend Developer": {
        "required": ["python","java","go","sql","postgresql","redis","docker","rest api","microservices","git","linux"],
        "base_salary": 1000000, "growth": 22, "weight": 1.0,
    },
    "Frontend Developer": {
        "required": ["javascript","typescript","react","html","css","git","webpack","rest api","testing"],
        "base_salary": 900000, "growth": 20, "weight": 0.9,
    },
    "DevOps Engineer": {
        "required": ["kubernetes","docker","terraform","aws","ci/cd","linux","bash","ansible","jenkins","monitoring"],
        "base_salary": 1300000, "growth": 31, "weight": 1.3,
    },
    "Cloud Architect": {
        "required": ["aws","azure","gcp","kubernetes","terraform","networking","security","microservices","docker","python"],
        "base_salary": 1800000, "growth": 38, "weight": 1.6,
    },
    "Data Engineer": {
        "required": ["python","sql","spark","kafka","airflow","dbt","bigquery","etl","docker","data pipeline"],
        "base_salary": 1200000, "growth": 30, "weight": 1.2,
    },
    "Cybersecurity Engineer": {
        "required": ["cybersecurity","python","linux","networking","cryptography","ethical hacking","siem","owasp"],
        "base_salary": 1400000, "growth": 32, "weight": 1.25,
    },
    "Product Manager": {
        "required": ["agile","scrum","product roadmap","jira","communication","analytics","user research","sql","leadership"],
        "base_salary": 1600000, "growth": 20, "weight": 1.2,
    },
    "iOS Developer": {
        "required": ["swift","xcode","ios","objective-c","git","rest api","testing","ui/ux"],
        "base_salary": 1200000, "growth": 18, "weight": 1.1,
    },
    "Android Developer": {
        "required": ["kotlin","java","android","android studio","rest api","git","testing"],
        "base_salary": 1100000, "growth": 18, "weight": 1.0,
    },
}

def extract_skills(text: str) -> list[str]:
    """Extract skills from resume text using keyword matching."""
    text_lower = text.lower()
    found = []
    for skill in ALL_SKILLS:
        pattern = r'\b' + re.escape(skill) + r'\b' if len(skill.split()) == 1 else re.escape(skill)
        if re.search(pattern, text_lower):
            found.append(skill)
    return list(set(found))

class ResumeAnalysisModel:
    def __init__(self):
        self.is_trained = False

    def train(self):
        print("[Model] Using rule-based fallback model. No training needed.")
        self.is_trained = True

    def load(self) -> bool:
        self.is_trained = True
        return True

    def analyze(self, resume_text: str, job_role: str, job_desc: str = "") -> dict:
        combined_text = resume_text + " " + job_desc
        found_skills = extract_skills(combined_text)

        if job_role not in JOB_ROLES:
            job_role = "Full Stack Developer"

        job = JOB_ROLES.get(job_role)
        required = job["required"]

        matched = [s for s in found_skills if s in required]
        missing = [s for s in required if s not in found_skills]

        skill_score = round(len(matched) / max(len(required), 1) * 100)
        
        # Simple similarity adjustment based on matching words in job description
        if job_desc.strip():
            job_words = set(job_desc.lower().split())
            resume_words = set(resume_text.lower().split())
            sim = len(job_words.intersection(resume_words)) / max(len(job_words), 1)
            skill_score = round((skill_score * 0.7 + sim * 100 * 0.3))

        skill_score = min(skill_score, 100)
        confidence = 0.85 # Mock confidence

        dna_score = self._compute_dna_score(found_skills, job_role)

        match_ratio = len(matched) / max(len(required), 1)
        current_salary = int(job["base_salary"] * (0.5 + 0.3 * match_ratio))
        potential_salary = int(job["base_salary"] * (0.9 + 0.3 * match_ratio))

        interview_risk = max(10, min(90, round(100 - skill_score * 0.6 - confidence * 20)))
        peer_percentile = min(95, max(10, round(skill_score * 0.8 + confidence * 20)))

        return {
            "found": found_skills,
            "missing": missing,
            "matched": matched,
            "skillScore": skill_score,
            "dnaScore": dna_score,
            "interviewRisk": interview_risk,
            "currentSalary": current_salary,
            "potentialSalary": potential_salary,
            "peerPercentile": peer_percentile,
            "jobRole": job_role,
            "confidence": confidence,
            "classifiedRole": job_role,
            "job": {
                "required": required,
                "baseSalary": job["base_salary"],
                "growth": job["growth"],
            },
        }

    def _compute_dna_score(self, found_skills: list, job_role: str) -> int:
        role_weights = {
            "ML Engineer":    {"ml_ai": 2.5, "programming": 1.5, "cloud": 1.0, "data": 1.2},
            "Data Scientist": {"ml_ai": 2.0, "data": 2.0, "programming": 1.5, "data_science_tools": 1.0},
            "Full Stack Developer": {"web": 2.5, "database": 1.5, "programming": 1.5},
            "Backend Developer": {"programming": 2.0, "database": 1.5, "cloud": 1.0},
            "Frontend Developer": {"web": 3.0, "programming": 1.0},
            "DevOps Engineer": {"cloud": 3.0, "programming": 1.0, "data_science_tools": 0.8},
            "Cloud Architect": {"cloud": 3.5, "programming": 1.0, "database": 0.8},
            "Data Engineer":  {"data": 2.5, "programming": 1.5, "cloud": 1.0},
            "Cybersecurity Engineer": {"security": 3.0, "programming": 1.0, "cloud": 0.8},
            "iOS Developer":  {"mobile": 3.0, "programming": 1.5},
            "Android Developer": {"mobile": 3.0, "programming": 1.5},
            "Product Manager": {"soft": 2.5, "data": 1.0, "data_science_tools": 0.8},
        }
        weights = role_weights.get(job_role, {"programming": 1.5, "data_science_tools": 1.0})
        
        EXPECTED_PER_GROUP = 4
        total_w, weighted_score = 0, 0
        for group, skills in SKILL_GROUPS.items():
            found_in_group = len([s for s in found_skills if s in skills])
            coverage = min(found_in_group / EXPECTED_PER_GROUP, 1.0)
            w = weights.get(group, 0.3)
            weighted_score += coverage * w * 100
            total_w += w
        
        raw = weighted_score / max(total_w, 1)
        return min(100, max(0, round(raw)))

_model = ResumeAnalysisModel()

def get_model() -> ResumeAnalysisModel:
    if not _model.is_trained:
        if not _model.load():
            _model.train()
    return _model
