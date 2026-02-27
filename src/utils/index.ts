import { SKILL_DB, JOBS } from "../constants/data";
import * as pdfjsLib from "pdfjs-dist";

// Point the worker at the bundled worker file from pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
).toString();

// ─── Helpers ──────────────────────────────────────────────────────────────
export const INR = (n: number) =>
    "₹" + (n >= 100000 ? (n / 100000).toFixed(1) + "L" : (n / 1000).toFixed(0) + "K");
export const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
export const clamp = (v: number, a: number = 0, b: number = 100) => Math.max(a, Math.min(b, v));

// ─── Skill Aliases ─────────────────────────────────────────────────────────
// Maps canonical skill name → list of alternate spellings / abbreviations
const SKILL_ALIASES: Record<string, string[]> = {
    "Python": ["python", "py", "python3"],
    "JavaScript": ["javascript", "js", "es6", "es2015", "ecmascript", "vanilla js"],
    "TypeScript": ["typescript", "ts"],
    "React": ["react", "reactjs", "react.js", "react js"],
    "Node.js": ["node", "nodejs", "node.js"],
    "SQL": ["sql", "mysql", "sqlite", "t-sql", "plsql", "pl/sql"],
    "PostgreSQL": ["postgresql", "postgres", "psql"],
    "MongoDB": ["mongodb", "mongo"],
    "Redis": ["redis"],
    "Machine Learning": ["machine learning", "ml", "scikit", "scikit-learn", "sklearn"],
    "Deep Learning": ["deep learning", "dl", "neural network", "neural net", "ann", "dnn"],
    "TensorFlow": ["tensorflow", "tf", "keras"],
    "PyTorch": ["pytorch", "torch"],
    "NLP": ["nlp", "natural language processing", "text mining", "spacy", "nltk", "transformers"],
    "Computer Vision": ["computer vision", "cv", "opencv", "image processing"],
    "Statistics": ["statistics", "statistical", "probability", "hypothesis testing", "bayesian"],
    "Data Analysis": ["data analysis", "data analytics", "pandas", "numpy", "eda", "exploratory data"],
    "Docker": ["docker", "dockerfile", "containerization", "container"],
    "Kubernetes": ["kubernetes", "k8s", "kubectl", "helm", "eks", "aks", "gke"],
    "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda", "sagemaker", "cloudwatch"],
    "Azure": ["azure", "microsoft azure", "az-", "azure devops"],
    "GCP": ["gcp", "google cloud", "bigquery", "dataflow", "vertex ai"],
    "Terraform": ["terraform", "iac", "infrastructure as code", "hcl"],
    "Ansible": ["ansible"],
    "Prometheus": ["prometheus", "promql"],
    "Grafana": ["grafana"],
    "Linux": ["linux", "unix", "ubuntu", "centos", "bash", "shell"],
    "Git": ["git", "github", "gitlab", "bitbucket", "version control"],
    "CI/CD": ["ci/cd", "cicd", "github actions", "jenkins", "gitlab ci", "travis", "circle ci"],
    "Spark": ["spark", "pyspark", "apache spark"],
    "Kafka": ["kafka", "apache kafka", "event streaming"],
    "Java": ["java", "jvm", "spring", "maven", "gradle"],
    "Spring Boot": ["spring boot", "springboot", "spring mvc", "spring framework"],
    "Go": ["golang", "go lang", " go "],
    "Rust": ["rust", "rustlang"],
    "C++": ["c++", "cpp", "c plus plus"],
    "Scala": ["scala"],
    "R": [" r ", "r programming", "rlang", "ggplot", "tidyverse", "dplyr"],
    "FastAPI": ["fastapi", "fast api"],
    "Django": ["django"],
    "Express.js": ["express", "expressjs", "express.js"],
    "REST API": ["rest", "restful", "rest api", "api design", "openapi", "swagger"],
    "GraphQL": ["graphql", "graph ql", "apollo"],
    "Microservices": ["microservices", "micro-services", "microservice architecture", "service mesh"],
    "gRPC": ["grpc", "g-rpc", "protocol buffers", "protobuf"],
    "Next.js": ["next.js", "nextjs", "next js"],
    "Vue.js": ["vue", "vuejs", "vue.js"],
    "CSS": ["css", "scss", "sass", "less", "flexbox", "css grid"],
    "HTML": ["html", "html5", "semantic html"],
    "Tailwind CSS": ["tailwind", "tailwindcss"],
    "Webpack": ["webpack", "vite", "parcel", "bundler"],
    "React Native": ["react native", "reactnative"],
    "Flutter": ["flutter"],
    "Swift": ["swift", "swiftui", "xcode"],
    "Kotlin": ["kotlin"],
    "Android": ["android", "android studio"],
    "iOS": ["ios", "iphone", "xcode"],
    "Dart": ["dart"],
    "Cybersecurity": ["cybersecurity", "cyber security", "information security", "infosec", "security"],
    "Penetration Testing": ["penetration testing", "pentest", "pen test", "ethical hacking", "red team"],
    "SIEM": ["siem", "splunk", "elk", "elastic", "security operations", "soc"],
    "Zero Trust": ["zero trust", "zerotrust", "beyondcorp"],
    "Cryptography": ["cryptography", "encryption", "aes", "rsa", "tls", "ssl", "pki"],
    "Compliance": ["compliance", "gdpr", "hipaa", "iso 27001", "nist", "soc2"],
    "Selenium": ["selenium", "webdriver"],
    "Jest": ["jest", "mocha", "jasmine", "unit test", "testing"],
    "Cypress": ["cypress", "e2e", "end-to-end", "playwright"],
    "Test Automation": ["test automation", "automated testing", "qa automation"],
    "JIRA": ["jira", "confluence", "atlassian"],
    "Postman": ["postman", "newman"],
    "Solidity": ["solidity", "smart contract", "evm"],
    "Ethereum": ["ethereum", "eth", "erc-20", "nft"],
    "Web3.js": ["web3", "web3.js", "ethers.js", "ethers"],
    "Smart Contracts": ["smart contract", "solidity", "chaincode"],
    "DeFi": ["defi", "decentralized finance", "dex", "amm"],
    "IPFS": ["ipfs", "filecoin"],
    "Serverless": ["serverless", "lambda", "cloud functions", "faas"],
    "Tableau": ["tableau"],
    "Power BI": ["power bi", "powerbi"],
    "Excel": ["excel", "spreadsheet", "vba"],
    "Agile": ["agile", "scrum", "kanban", "sprint", "standup"],
    "Product Roadmap": ["product roadmap", "roadmap", "product planning", "okr"],
    "User Research": ["user research", "ux research", "usability", "user interviews", "persona"],
    "A/B Testing": ["a/b test", "ab test", "split test", "experimentation"],
    "Figma": ["figma", "sketch", "adobe xd", "wireframe", "prototype"],
    "Analytics": ["analytics", "mixpanel", "google analytics", "ga4", "amplitude", "segment"],
    "Stakeholder Management": ["stakeholder", "executive", "leadership", "cross-functional"],
    "Communication": ["communication", "presentation", "documentation", "technical writing"],
    "Leadership": ["leadership", "team lead", "manager", "mentoring", "managed a team"],
};

// ─── PDF Text Extraction (using PDF.js — proper text rendering) ────────────
export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pages: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items
                .map((item: any) => ("str" in item ? item.str : ""))
                .join(" ");
            pages.push(pageText);
        }

        return pages.join("\n").slice(0, 20000);
    } catch (err) {
        // Fallback to raw byte extraction if PDF.js fails
        console.warn("pdfjs failed, falling back to raw extraction", err);
        return extractTextFallback(file);
    }
}

function extractTextFallback(file: File): Promise<string> {
    return new Promise(resolve => {
        const r = new FileReader();
        r.onload = e => {
            const arr = new Uint8Array(e.target?.result as ArrayBuffer);
            let text = "";
            for (let i = 0; i < arr.length; i++) {
                const c = arr[i];
                if ((c >= 32 && c <= 126) || c === 10 || c === 13) text += String.fromCharCode(c);
            }
            const words = text.match(/[A-Za-z][A-Za-z0-9+#.\-]{2,}/g) || [];
            resolve([...new Set(words)].join(" ").slice(0, 20000));
        };
        r.readAsArrayBuffer(file);
    });
}

// ─── Skill Detection (alias-aware, case-insensitive) ──────────────────────
function detectSkills(text: string): string[] {
    const normalizedText = text.toLowerCase();
    const found: string[] = [];

    for (const [skill, aliases] of Object.entries(SKILL_ALIASES)) {
        const detected = aliases.some(alias => {
            // Use word-boundary-aware matching for short tokens like "go", "r"
            if (alias.trim().length <= 2) {
                const re = new RegExp(`\\b${alias.trim()}\\b`, "i");
                return re.test(normalizedText);
            }
            return normalizedText.includes(alias.toLowerCase());
        });
        if (detected) found.push(skill);
    }

    // Also detect by direct SKILL_DB key if not already found
    for (const skill of Object.keys(SKILL_DB)) {
        if (!found.includes(skill) && normalizedText.includes(skill.toLowerCase())) {
            found.push(skill);
        }
    }

    return [...new Set(found)];
}

// ─── Core Weights (how critical each skill type is) ───────────────────────
// Skills that appear first in a role's required[] are weighted higher
function getSkillWeight(skill: string, required: string[], index: number): number {
    // First 3 skills are "core" — double weight
    if (index < 3) return 2.0;
    // Middle skills — standard weight
    if (index < 5) return 1.5;
    // Later skills — nice to have
    return 1.0;
}

// ─── Rule-based analyzer (legacy fallback) ────────────────────────────────
export function analyzeResume(text: string, jobRole: string) {
    const job = JOBS[jobRole] || JOBS["ML Engineer"];
    const found = detectSkills(text);

    const matched: string[] = [];
    const missing: string[] = [];
    let weightedMatched = 0;
    let totalWeight = 0;

    job.required.forEach((skill, idx) => {
        const weight = getSkillWeight(skill, job.required, idx);
        totalWeight += weight;
        if (found.includes(skill)) {
            matched.push(skill);
            weightedMatched += weight;
        } else {
            missing.push(skill);
        }
    });

    const rawScore = totalWeight > 0 ? Math.round((weightedMatched / totalWeight) * 100) : 0;
    const extraSkills = found.filter(s => !job.required.includes(s));
    const bonus = Math.min(extraSkills.length * 2, 10);
    const skillScore = clamp(rawScore + bonus);
    const interviewRisk = clamp(100 - skillScore + rand(-3, 3));
    const salaryMultiplier = skillScore / 100;
    const currentSalary = Math.round(job.baseSalary * salaryMultiplier * 0.9);
    const potentialSalary = Math.round(job.baseSalary * 1.15);
    const softSkillBonus = found.includes("Communication") || found.includes("Leadership")
        || found.includes("Agile") ? rand(3, 7) : 0;
    const dnaScore = clamp(Math.round(skillScore * 0.85 + rand(2, 8) + softSkillBonus));
    const peerPercentile = clamp(rand(dnaScore - 12, dnaScore + 8));

    return {
        found, missing, matched, skillScore, interviewRisk,
        currentSalary, potentialSalary, dnaScore, peerPercentile,
        job, jobRole,
        totalSkillsFound: found.length,
        extraSkillsCount: extraSkills.length,
        matchedWeight: Math.round((weightedMatched / totalWeight) * 100),
        aiPowered: false,
    };
}

// ─── Auth & Session helpers ──────────────────────────────────────────────────
const AI_BACKEND = "http://localhost:8000";

export const getStoredToken = (): string | null => localStorage.getItem("g2g_token");
export const storeToken = (t: string) => localStorage.setItem("g2g_token", t);
export const clearToken = () => localStorage.removeItem("g2g_token");

export async function register(name: string, email: string, password: string) {
    const res = await fetch(`${AI_BACKEND}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Registration failed.");
    return data as { token: string; user: { id: string; name: string; email: string } };
}

export async function login(email: string, password: string) {
    const res = await fetch(`${AI_BACKEND}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Invalid email or password.");
    return data as { token: string; user: { id: string; name: string; email: string } };
}

export async function getMe(token: string) {
    const res = await fetch(`${AI_BACKEND}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error("Session expired.");
    return res.json() as Promise<{ id: string; name: string; email: string }>;
}

export async function getAnalysisHistory(token: string) {
    const res = await fetch(`${AI_BACKEND}/analyses`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return res.json() as Promise<any[]>;
}

// ─── AI-powered analyzer (calls Python backend) ───────────────────────────

export async function analyzeResumeAI(
    resumeText: string,
    jobRole: string,
    jobDescription = "",
    onFallback?: () => void,
    fileName = "",
) {
    try {
        const token = getStoredToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${AI_BACKEND}/analyze`, {
            method: "POST",
            headers,
            body: JSON.stringify({ resumeText, jobRole, jobDescription, fileName }),
            signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) throw new Error(`Backend returned ${res.status}`);
        const data = await res.json();

        // Normalize backend response to match Dashboard expectations
        const job = JOBS[jobRole] || {
            required: data.job?.required || [],
            baseSalary: data.job?.baseSalary || 1000000,
            growth: data.job?.growth || 20,
        };
        return {
            ...data,
            job,
            jobRole,
            aiPowered: true,
            confidence: data.confidence ?? null,
        };
    } catch (err) {
        console.warn("[AI] Backend unavailable, falling back to rule-based engine:", err);
        onFallback?.();
        return { ...analyzeResume(resumeText, jobRole), aiPowered: false };
    }
}

export async function checkAIBackend(): Promise<boolean> {
    try {
        const res = await fetch(`${AI_BACKEND}/health`, { signal: AbortSignal.timeout(2000) });
        return res.ok;
    } catch {
        return false;
    }
}

// ─── Forecast & Roadmap helpers (unchanged) ───────────────────────────────
export function genForecast(skill: string) {
    const base = SKILL_DB[skill] || 70;
    return Array.from({ length: 6 }, (_, i) => ({
        year: 2024 + i,
        demand: clamp(base + i * rand(2, 5) + rand(-3, 3))
    }));
}

export function genRoadmap(missing: string[]) {
    return [
        { phase: "Foundation", weeks: "1–4", tasks: missing.slice(0, 2).map(s => ({ skill: s, action: `Complete intro to ${s}`, resource: `${s} Fundamentals`, effort: "8 hrs/wk" })) },
        { phase: "Core Skills", weeks: "5–10", tasks: missing.slice(2, 4).map(s => ({ skill: s, action: `Build project using ${s}`, resource: `Advanced ${s}`, effort: "10 hrs/wk" })) },
        { phase: "Advanced", weeks: "11–16", tasks: missing.slice(4).map(s => ({ skill: s, action: `Deploy ${s} in production`, resource: `${s} Masterclass`, effort: "12 hrs/wk" })) }
    ].filter(p => p.tasks.length > 0);
}
