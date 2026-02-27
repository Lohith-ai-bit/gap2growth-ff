export const SKILL_DB: Record<string, number> = {
    "Python": 85, "JavaScript": 80, "React": 78, "Node.js": 72, "TypeScript": 75,
    "SQL": 70, "Machine Learning": 88, "Deep Learning": 84, "TensorFlow": 82,
    "PyTorch": 81, "FastAPI": 74, "Docker": 76, "Kubernetes": 79, "AWS": 83,
    "Azure": 77, "GCP": 76, "Data Analysis": 80, "NLP": 86, "Computer Vision": 83,
    "Java": 68, "C++": 65, "Rust": 72, "Go": 74, "Scala": 69,
    "Spark": 77, "Kafka": 74, "Redis": 71, "MongoDB": 70, "PostgreSQL": 73,
    "Tableau": 68, "Power BI": 67, "Excel": 60, "R": 72, "Statistics": 78,
    "Communication": 65, "Leadership": 62, "Agile": 68, "Git": 75, "CI/CD": 76,
    // Frontend
    "Vue.js": 72, "Next.js": 78, "CSS": 68, "HTML": 65, "Tailwind CSS": 74, "Webpack": 66, "GraphQL": 75,
    // Mobile
    "React Native": 74, "Flutter": 73, "Swift": 70, "Kotlin": 69, "Android": 68, "iOS": 69, "Dart": 67,
    // Backend
    "Spring Boot": 72, "Django": 71, "Express.js": 70, "gRPC": 68, "REST API": 74, "Microservices": 76,
    // Cloud & SRE
    "Terraform": 77, "Ansible": 72, "Prometheus": 74, "Grafana": 71, "Linux": 78, "Nginx": 68, "Serverless": 75,
    // Security
    "Cybersecurity": 80, "Penetration Testing": 78, "SIEM": 72, "Zero Trust": 74, "Cryptography": 70, "Compliance": 66,
    // QA
    "Selenium": 68, "Jest": 70, "Cypress": 72, "Test Automation": 74, "JIRA": 65, "Postman": 67,
    // Blockchain
    "Solidity": 78, "Ethereum": 76, "Web3.js": 72, "Smart Contracts": 80, "DeFi": 74, "IPFS": 66,
    // Product
    "Product Roadmap": 68, "User Research": 65, "A/B Testing": 70, "Figma": 67, "Analytics": 72, "Stakeholder Management": 64,
};

export const COURSES = [
    { id: 1, title: "Machine Learning A-Z", platform: "Coursera", skill: "Machine Learning", hours: 40, cost: 0, rating: 4.8, salaryBoost: 180000, url: "https://www.coursera.org/learn/machine-learning" },
    { id: 2, title: "Deep Learning Specialization", platform: "Coursera", skill: "Deep Learning", hours: 60, cost: 0, rating: 4.9, salaryBoost: 260000, url: "https://www.coursera.org/specializations/deep-learning" },
    { id: 3, title: "AWS Solutions Architect", platform: "AWS", skill: "AWS", hours: 50, cost: 24000, rating: 4.7, salaryBoost: 200000, url: "https://explore.skillbuilder.aws/learn/course/external/view/elearning/125/aws-cloud-practitioner-essentials" },
    { id: 4, title: "Docker & Kubernetes", platform: "Udemy", skill: "Kubernetes", hours: 30, cost: 1200, rating: 4.7, salaryBoost: 140000, url: "https://www.udemy.com/course/learn-devops-the-complete-kubernetes-course/" },
    { id: 5, title: "React - Complete Guide", platform: "Udemy", skill: "React", hours: 48, cost: 1200, rating: 4.8, salaryBoost: 100000, url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/" },
    { id: 6, title: "NLP with Transformers", platform: "HuggingFace", skill: "NLP", hours: 35, cost: 0, rating: 4.9, salaryBoost: 280000, url: "https://huggingface.co/learn/nlp-course/chapter1/1" },
    { id: 7, title: "FastAPI Masterclass", platform: "Udemy", skill: "FastAPI", hours: 20, cost: 1200, rating: 4.6, salaryBoost: 90000, url: "https://www.udemy.com/course/fastapi-the-complete-course/" },
    { id: 8, title: "Spark & Big Data", platform: "Coursera", skill: "Spark", hours: 45, cost: 0, rating: 4.7, salaryBoost: 190000, url: "https://www.coursera.org/learn/big-data-essentials" },
    { id: 9, title: "PostgreSQL Advanced", platform: "Udemy", skill: "PostgreSQL", hours: 25, cost: 800, rating: 4.6, salaryBoost: 80000, url: "https://www.udemy.com/course/the-complete-python-postgresql-developer-course/" },
    { id: 10, title: "System Design", platform: "Educative", skill: "Kubernetes", hours: 40, cost: 4500, rating: 4.8, salaryBoost: 300000, url: "https://www.educative.io/courses/grokking-the-system-design-interview" },
    { id: 11, title: "Next.js 14 Complete Course", platform: "Udemy", skill: "Next.js", hours: 38, cost: 1200, rating: 4.8, salaryBoost: 110000, url: "https://www.udemy.com/course/nextjs-react-the-complete-guide/" },
    { id: 12, title: "Flutter & Dart Bootcamp", platform: "Udemy", skill: "Flutter", hours: 55, cost: 1200, rating: 4.7, salaryBoost: 130000, url: "https://www.udemy.com/course/flutter-bootcamp-with-dart/" },
    { id: 13, title: "Cybersecurity for Beginners", platform: "Coursera", skill: "Cybersecurity", hours: 45, cost: 0, rating: 4.7, salaryBoost: 220000, url: "https://www.coursera.org/professional-certificates/google-cybersecurity" },
    { id: 14, title: "Terraform on AWS", platform: "Udemy", skill: "Terraform", hours: 32, cost: 1200, rating: 4.8, salaryBoost: 175000, url: "https://www.udemy.com/course/terraform-beginner-to-advanced/" },
    { id: 15, title: "Ethereum & Solidity Developer", platform: "Udemy", skill: "Solidity", hours: 50, cost: 1200, rating: 4.6, salaryBoost: 260000, url: "https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/" },
    { id: 16, title: "Selenium WebDriver", platform: "Udemy", skill: "Selenium", hours: 28, cost: 800, rating: 4.6, salaryBoost: 80000, url: "https://www.udemy.com/course/selenium-webdriver-with-python-and-pytest/" },
    { id: 17, title: "Spring Boot Microservices", platform: "Udemy", skill: "Spring Boot", hours: 40, cost: 1200, rating: 4.7, salaryBoost: 140000, url: "https://www.udemy.com/course/microservices-with-spring-boot-and-spring-cloud/" },
    { id: 18, title: "Site Reliability Engineering", platform: "Coursera", skill: "Prometheus", hours: 35, cost: 0, rating: 4.7, salaryBoost: 200000, url: "https://www.coursera.org/learn/site-reliability-engineering-slos" },
];

export const JOBS: Record<string, { required: string[], baseSalary: number, growth: number }> = {
    // ── Original Roles ──
    "ML Engineer": { required: ["Python", "Machine Learning", "TensorFlow", "SQL", "Docker", "Statistics"], baseSalary: 2400000, growth: 34 },
    "Full Stack Dev": { required: ["JavaScript", "React", "Node.js", "SQL", "Docker", "Git", "TypeScript"], baseSalary: 1800000, growth: 22 },
    "Data Scientist": { required: ["Python", "SQL", "Machine Learning", "Statistics", "Spark", "Data Analysis", "R"], baseSalary: 2200000, growth: 28 },
    "DevOps Engineer": { required: ["Docker", "Kubernetes", "AWS", "CI/CD", "Python", "Git"], baseSalary: 2000000, growth: 25 },
    "AI Engineer": { required: ["Python", "Deep Learning", "NLP", "PyTorch", "TensorFlow", "AWS", "Docker"], baseSalary: 2800000, growth: 40 },
    "Data Engineer": { required: ["Python", "Spark", "Kafka", "SQL", "AWS", "PostgreSQL", "Git"], baseSalary: 2100000, growth: 30 },
    // ── New Roles ──
    "Frontend Developer": { required: ["JavaScript", "TypeScript", "React", "Next.js", "CSS", "Git", "GraphQL"], baseSalary: 1600000, growth: 18 },
    "Backend Developer": { required: ["Node.js", "Java", "Spring Boot", "REST API", "SQL", "Docker", "Redis"], baseSalary: 1900000, growth: 20 },
    "Mobile Developer": { required: ["React Native", "Flutter", "JavaScript", "TypeScript", "iOS", "Android", "Git"], baseSalary: 1750000, growth: 26 },
    "Cloud Architect": { required: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "Docker", "Serverless"], baseSalary: 2600000, growth: 32 },
    "Cybersecurity Engineer": { required: ["Cybersecurity", "Penetration Testing", "Python", "Linux", "Cryptography", "SIEM", "Zero Trust"], baseSalary: 2300000, growth: 35 },
    "QA Engineer": { required: ["Selenium", "Jest", "Cypress", "Test Automation", "Python", "JIRA", "Postman"], baseSalary: 1400000, growth: 15 },
    "Blockchain Developer": { required: ["Solidity", "Ethereum", "Web3.js", "Smart Contracts", "JavaScript", "Rust", "Git"], baseSalary: 2500000, growth: 38 },
    "SRE": { required: ["Linux", "Kubernetes", "Prometheus", "Grafana", "Python", "AWS", "CI/CD"], baseSalary: 2200000, growth: 28 },
    "Product Manager": { required: ["Agile", "Analytics", "Figma", "Product Roadmap", "A/B Testing", "User Research", "Communication"], baseSalary: 2000000, growth: 20 },
};

export const INSIGHTS = [
    { id: 1, category: "AI Trends", date: "June 2025", impact: "High Impact", headline: "AI-Augmented Development is Replacing Traditional Coding Workflows", summary: "Generative AI tools like GitHub Copilot, Cursor, and Claude Code are reshaping how engineers write, review, and ship software. Teams adopting AI-assisted development report 35–55% faster delivery cycles.", why: "Engineers who don't adapt risk being outpaced by peers who leverage AI as a force multiplier. Prompt engineering and AI orchestration are becoming core competencies.", roleChange: "Roles like 'AI Integration Engineer' and 'LLM Ops Engineer' are rising. Manual QA is being replaced by AI-test automation specialists.", skills: ["Prompt Engineering", "LangChain", "RAG Pipelines", "Fine-tuning LLMs"], tools: ["Cursor IDE", "GitHub Copilot", "Claude API", "LlamaIndex"], roles: ["AI Integration Engineer", "LLM Ops", "AI Product Engineer"] },
    { id: 2, category: "Cloud Shift", date: "June 2025", impact: "High Impact", headline: "Platform Engineering is Becoming the New DevOps", summary: "The 'you build it, you run it' model is evolving into internal developer platforms (IDPs). Companies like Spotify and Netflix are investing in self-service infrastructure for developers.", why: "Developer productivity is now a boardroom metric. Engineers who build and maintain IDPs are in extreme demand as orgs eliminate 'cognitive load tax' on product teams.", roleChange: "DevOps generalists are specializing into Platform Engineers. SRE roles are evolving to include developer experience (DX) ownership.", skills: ["Backstage", "Terraform", "Kubernetes Operators", "GitOps"], tools: ["Backstage by Spotify", "Crossplane", "ArgoCD", "Pulumi"], roles: ["Platform Engineer", "Developer Experience Lead", "SRE – IDP Focus"] },
    { id: 3, category: "Tech Global Weekly", date: "May 2025", impact: "Medium Shift", headline: "WebAssembly is Breaking Out of the Browser", summary: "WASM is moving beyond web apps into edge computing, serverless functions, and plugin systems. Shopify, Fastly, and Cloudflare Workers are deploying WASM at the edge for sub-millisecond latency.", why: "WASM enables language-agnostic runtime portability. This disrupts the Node.js-only serverless model and opens new architecture patterns.", roleChange: "Backend engineers are increasingly expected to understand WASM runtimes. Rust engineers are crossing into web/cloud territory.", skills: ["WebAssembly", "Rust", "WASI", "Edge Computing"], tools: ["Wasmtime", "Wasmer", "Fastly Compute@Edge", "Spin (Fermyon)"], roles: ["Edge Computing Engineer", "Systems + Web Engineer", "Rust Developer"] },
    { id: 4, category: "Data & AI Infra", date: "May 2025", impact: "High Impact", headline: "The Rise of the AI Data Stack: Vector DBs & Real-Time ML", summary: "Vector databases (Pinecone, Weaviate, Qdrant) and real-time feature stores are becoming standard in production AI systems. The modern data stack now has an 'AI layer'.", why: "Every product team building with LLMs needs RAG. Engineers who understand embedding pipelines and vector search are critical bottlenecks in AI product teams.", roleChange: "Data Engineers are evolving into 'AI Data Engineers'. MLE roles now overlap heavily with data platform engineering.", skills: ["Vector Search", "Embeddings", "Feature Stores", "MLflow"], tools: ["Pinecone", "Weaviate", "Feast", "Ray Serve"], roles: ["AI Data Engineer", "ML Platform Engineer", "Vector DB Specialist"] },
    { id: 5, category: "Frontend Evolution", date: "April 2025", impact: "Emerging Trend", headline: "React Server Components & Full-Stack Frameworks Redefine Frontend", summary: "Next.js App Router, Remix, and SvelteKit are blurring frontend/backend lines. React Server Components shift rendering to the server, reducing client bundle sizes by up to 60%.", why: "The 'pure frontend developer' archetype is fading. Modern frontend demands understanding of server rendering, edge caching, and API design.", roleChange: "Frontend roles are becoming 'UI/Full-Stack' hybrids. Demand for engineers who understand RSC patterns and backend APIs is surging.", skills: ["React Server Components", "Next.js App Router", "Edge Rendering", "Streaming SSR"], tools: ["Next.js 14+", "Remix", "SvelteKit", "Vercel Edge Runtime"], roles: ["Full-Stack Frontend Engineer", "UI Platform Engineer", "React Specialist"] },
    { id: 6, category: "Security Shift", date: "April 2025", impact: "Medium Shift", headline: "Shift-Left Security: DevSecOps Becomes Non-Negotiable", summary: "Security is moving from a post-deployment audit to an embedded engineering practice. Supply chain attacks and AI-generated code vulnerabilities are forcing teams to integrate security at every SDLC stage.", why: "Regulators (EU AI Act, NIS2) mandate software supply chain transparency. Engineers who understand SBOM, SAST/DAST, and zero-trust are must-haves.", roleChange: "AppSec engineers are being embedded directly in product squads. 'Security Champion' as a developer role is emerging in mid-to-large orgs.", skills: ["SBOM", "Zero Trust", "SAST/DAST", "Supply Chain Security"], tools: ["Snyk", "Semgrep", "Syft", "SLSA Framework"], roles: ["DevSecOps Engineer", "AppSec Engineer", "Security Champion"] },
];

export const IMPACT_CFG: Record<string, any> = {
    "High Impact": { color: "#2563eb", bg: "#eff6ff", dot: "#3b82f6" },
    "Medium Shift": { color: "#7c3aed", bg: "#f5f3ff", dot: "#8b5cf6" },
    "Emerging Trend": { color: "#059669", bg: "#ecfdf5", dot: "#10b981" },
};

export const CAT_CFG: Record<string, any> = {
    "AI Trends": { color: "#1d4ed8", bg: "#dbeafe" },
    "Cloud Shift": { color: "#0369a1", bg: "#e0f2fe" },
    "Tech Global Weekly": { color: "#6d28d9", bg: "#ede9fe" },
    "Data & AI Infra": { color: "#0f766e", bg: "#ccfbf1" },
    "Frontend Evolution": { color: "#b45309", bg: "#fef3c7" },
    "Security Shift": { color: "#be123c", bg: "#ffe4e6" },
};
