export type ResourceLink = {
    label: string;
    url: string;
    platform: "freeCodeCamp" | "The Odin Project" | "Microsoft Learn" | "edX" | "Coursera" | "AWS Skill Builder" | "Udemy" | "YouTube" | "Docs" | "Other";
};

export type SkillNode = {
    name: string;
    description: string;
    resources: ResourceLink[];
};

export type RoadmapLevel = {
    level: "Beginner" | "Intermediate" | "Advanced";
    color: string;
    gradient: string;
    icon: string;
    durationHint: string;
    topics: {
        area: string;
        icon: string;
        skills: SkillNode[];
    }[];
};

export type RoleRoadmap = {
    role: string;
    description: string;
    totalWeeks: number;
    sourceUrl: string;
    levels: RoadmapLevel[];
};

const PLATFORM_COLORS: Record<string, string> = {
    "freeCodeCamp": "#0a0a23",
    "The Odin Project": "#d64c4c",
    "Microsoft Learn": "#0078d4",
    "edX": "#793de6",
    "Coursera": "#0056d2",
    "AWS Skill Builder": "#ff9900",
    "Udemy": "#a435f0",
    "YouTube": "#ff0000",
    "Docs": "#64748b",
    "Other": "#475569",
};
export { PLATFORM_COLORS };

export const ROLE_ROADMAPS: Record<string, RoleRoadmap> = {
    /* ───────────────── ML ENGINEER ───────────────── */
    "ML Engineer": {
        role: "ML Engineer",
        description: "From Python basics to deploying production-grade ML systems on the cloud.",
        totalWeeks: 52,
        sourceUrl: "https://roadmap.sh/mlops",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–12",
                topics: [
                    {
                        area: "Python Foundations", icon: "🐍", skills: [
                            {
                                name: "Python Basics", description: "Variables, loops, functions, OOP, comprehensions.", resources: [
                                    { label: "Python for Everybody", url: "https://www.coursera.org/specializations/python", platform: "Coursera" },
                                    { label: "Learn Python", url: "https://www.freecodecamp.org/news/learn-python-free-python-courses-for-beginners/", platform: "freeCodeCamp" },
                                    { label: "Python Tutorial", url: "https://learn.microsoft.com/en-us/training/paths/beginner-python/", platform: "Microsoft Learn" },
                                ]
                            },
                            {
                                name: "NumPy & Pandas", description: "Arrays, DataFrames, data manipulation.", resources: [
                                    { label: "Data Analysis with Python", url: "https://www.freecodecamp.org/learn/data-analysis-with-python/", platform: "freeCodeCamp" },
                                    { label: "Pandas Tutorial", url: "https://www.udemy.com/course/data-analysis-with-pandas/", platform: "Udemy" },
                                ]
                            },
                            {
                                name: "Git & GitHub", description: "Version control, branching, pull requests.", resources: [
                                    { label: "Git & GitHub Crash Course", url: "https://www.freecodecamp.org/news/git-and-github-crash-course/", platform: "freeCodeCamp" },
                                    { label: "GitHub Foundations", url: "https://learn.microsoft.com/en-us/training/paths/github-foundations/", platform: "Microsoft Learn" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Mathematics", icon: "📐", skills: [
                            {
                                name: "Linear Algebra", description: "Vectors, matrices, eigenvalues, dot products.", resources: [
                                    { label: "Linear Algebra (MIT)", url: "https://www.edx.org/learn/linear-algebra", platform: "edX" },
                                    { label: "Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", platform: "YouTube" },
                                ]
                            },
                            {
                                name: "Statistics & Probability", description: "Distributions, hypothesis testing, Bayes theorem.", resources: [
                                    { label: "Statistics with Python", url: "https://www.coursera.org/specializations/statistics-with-python", platform: "Coursera" },
                                    { label: "Statistics for Data Science", url: "https://www.edx.org/learn/statistics", platform: "edX" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "First ML Models", icon: "🤖", skills: [
                            {
                                name: "Scikit-learn Basics", description: "Linear regression, KNN, model evaluation.", resources: [
                                    { label: "Machine Learning with Python", url: "https://www.freecodecamp.org/learn/machine-learning-with-python/", platform: "freeCodeCamp" },
                                    { label: "Intro to ML (Udemy)", url: "https://www.udemy.com/course/machinelearning/", platform: "Udemy" },
                                ]
                            },
                            {
                                name: "Data Visualization", description: "Matplotlib, Seaborn, EDA techniques.", resources: [
                                    { label: "Data Visualization with Python", url: "https://www.coursera.org/learn/python-for-data-visualization", platform: "Coursera" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 13–30",
                topics: [
                    {
                        area: "Core ML Algorithms", icon: "🔬", skills: [
                            {
                                name: "Supervised Learning", description: "SVM, Decision Trees, Random Forest, XGBoost.", resources: [
                                    { label: "ML Specialization (Andrew Ng)", url: "https://www.coursera.org/specializations/machine-learning-introduction", platform: "Coursera" },
                                    { label: "Supervised Learning (edX)", url: "https://www.edx.org/learn/machine-learning", platform: "edX" },
                                ]
                            },
                            {
                                name: "Model Evaluation", description: "Cross-validation, metrics, bias-variance tradeoff.", resources: [
                                    { label: "Applied ML in Python", url: "https://www.coursera.org/learn/python-machine-learning", platform: "Coursera" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Deep Learning", icon: "🧠", skills: [
                            {
                                name: "TensorFlow / PyTorch", description: "Building and training DNN models end-to-end.", resources: [
                                    { label: "TensorFlow Developer Certificate", url: "https://www.coursera.org/professional-certificates/tensorflow-in-practice", platform: "Coursera" },
                                    { label: "Deep Learning with PyTorch", url: "https://www.udemy.com/course/pytorch-for-deep-learning/", platform: "Udemy" },
                                    { label: "Deep Learning AI", url: "https://www.edx.org/learn/deep-learning", platform: "edX" },
                                ]
                            },
                            {
                                name: "CNNs & RNNs", description: "Image classification, sequence modelling.", resources: [
                                    { label: "Deep Learning Specialization", url: "https://www.coursera.org/specializations/deep-learning", platform: "Coursera" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "MLOps Basics", icon: "🛠️", skills: [
                            {
                                name: "Docker for ML", description: "Containerising ML apps for reproducibility.", resources: [
                                    { label: "Docker Tutorial", url: "https://www.udemy.com/course/docker-mastery/", platform: "Udemy" },
                                    { label: "Containers on Azure", url: "https://learn.microsoft.com/en-us/training/paths/az-900-describe-azure-compute-networking-services/", platform: "Microsoft Learn" },
                                ]
                            },
                            {
                                name: "FastAPI Serving", description: "Serve ML models as REST APIs.", resources: [
                                    { label: "FastAPI Masterclass", url: "https://www.udemy.com/course/fastapi-the-complete-course/", platform: "Udemy" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 31–52",
                topics: [
                    {
                        area: "LLMs & Generative AI", icon: "✨", skills: [
                            {
                                name: "Fine-tuning LLMs", description: "LoRA, PEFT, instruction tuning on HuggingFace.", resources: [
                                    { label: "Generative AI with LLMs", url: "https://www.coursera.org/learn/generative-ai-with-llms", platform: "Coursera" },
                                    { label: "Generative AI on AWS", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-generative%20ai", platform: "AWS Skill Builder" },
                                ]
                            },
                            {
                                name: "RAG Pipelines", description: "Vector DBs, embeddings, retrieval-augmented generation.", resources: [
                                    { label: "Building LLM Apps (edX)", url: "https://www.edx.org/learn/artificial-intelligence", platform: "edX" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Cloud ML Platforms", icon: "☁️", skills: [
                            {
                                name: "AWS SageMaker", description: "Training, deploying and monitoring ML models on AWS.", resources: [
                                    { label: "AWS ML Specialty", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-machine%20learning", platform: "AWS Skill Builder" },
                                    { label: "ML on AWS (Coursera)", url: "https://www.coursera.org/learn/aws-machine-learning", platform: "Coursera" },
                                ]
                            },
                            {
                                name: "Azure ML", description: "Azure ML Studio, pipelines, endpoints.", resources: [
                                    { label: "Azure AI Fundamentals", url: "https://learn.microsoft.com/en-us/training/paths/get-started-with-artificial-intelligence-on-azure/", platform: "Microsoft Learn" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Production & Scale", icon: "🏭", skills: [
                            {
                                name: "CI/CD for ML", description: "GitHub Actions, DVC, automated retraining pipelines.", resources: [
                                    { label: "MLOps Fundamentals", url: "https://www.coursera.org/learn/mlops-fundamentals", platform: "Coursera" },
                                ]
                            },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── AI ENGINEER ───────────────── */
    "AI Engineer": {
        role: "AI Engineer",
        description: "Build production AI products: from prompt engineering to multi-agent LLM systems.",
        totalWeeks: 48,
        sourceUrl: "https://roadmap.sh/ai-engineer",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–10",
                topics: [
                    {
                        area: "Python & APIs", icon: "🐍", skills: [
                            {
                                name: "Python Essentials", description: "Data types, comprehensions, async/await basics.", resources: [
                                    { label: "Python for Everybody", url: "https://www.coursera.org/specializations/python", platform: "Coursera" },
                                    { label: "Scientific Computing with Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", platform: "freeCodeCamp" },
                                ]
                            },
                            {
                                name: "REST APIs & HTTP", description: "Requests library, JSON, authentication headers.", resources: [
                                    { label: "APIs for Beginners", url: "https://www.freecodecamp.org/news/what-is-an-api-in-english-please-b880a3214a82/", platform: "freeCodeCamp" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "LLM Foundations", icon: "🤖", skills: [
                            {
                                name: "Prompt Engineering", description: "Zero-shot, few-shot, chain-of-thought prompting.", resources: [
                                    { label: "Prompt Engineering Guide", url: "https://www.coursera.org/learn/prompt-engineering", platform: "Coursera" },
                                    { label: "ChatGPT Prompt Engineering", url: "https://www.edx.org/learn/prompt-engineering", platform: "edX" },
                                ]
                            },
                            {
                                name: "OpenAI / Gemini APIs", description: "Chat completions, function calling, streaming.", resources: [
                                    { label: "Intro to Generative AI", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-generative%20ai", platform: "AWS Skill Builder" },
                                    { label: "Generative AI Essentials", url: "https://learn.microsoft.com/en-us/training/paths/introduction-generative-ai/", platform: "Microsoft Learn" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 11–28",
                topics: [
                    {
                        area: "LLM App Building", icon: "🏗️", skills: [
                            {
                                name: "LangChain / LlamaIndex", description: "Chains, agents, memory, tools.", resources: [
                                    { label: "LangChain & Vector DBs", url: "https://www.udemy.com/course/langchain/", platform: "Udemy" },
                                    { label: "Building AI Apps (edX)", url: "https://www.edx.org/learn/artificial-intelligence", platform: "edX" },
                                ]
                            },
                            {
                                name: "Vector Databases & RAG", description: "Pinecone, ChromaDB, semantic search.", resources: [
                                    { label: "Vector DB & RAG on AWS", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-rag", platform: "AWS Skill Builder" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Deployment", icon: "🛠️", skills: [
                            {
                                name: "FastAPI + Docker", description: "Stream LLM responses, containerise AI apps.", resources: [
                                    { label: "FastAPI Complete Course", url: "https://www.udemy.com/course/fastapi-the-complete-course/", platform: "Udemy" },
                                    { label: "Deploy Apps on Azure", url: "https://learn.microsoft.com/en-us/training/paths/deploy-applications-with-azure-devops/", platform: "Microsoft Learn" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 29–48",
                topics: [
                    {
                        area: "Fine-tuning & Alignment", icon: "🎯", skills: [
                            {
                                name: "LoRA / QLoRA Fine-tuning", description: "Instruction-tune smaller open-source models.", resources: [
                                    { label: "Generative AI with LLMs", url: "https://www.coursera.org/learn/generative-ai-with-llms", platform: "Coursera" },
                                    { label: "Fine-tuning on AWS", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-fine%20tuning", platform: "AWS Skill Builder" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Agentic Systems", icon: "🤖", skills: [
                            {
                                name: "Multi-Agent Orchestration", description: "LangGraph, CrewAI, tool use, ReAct.", resources: [
                                    { label: "AI Agents with LangChain", url: "https://www.udemy.com/course/langchain-agentic-ai/", platform: "Udemy" },
                                ]
                            },
                            {
                                name: "Production AI on Cloud", description: "AWS Bedrock, Azure OpenAI, cost optimisation.", resources: [
                                    { label: "AWS Bedrock Essentials", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-bedrock", platform: "AWS Skill Builder" },
                                    { label: "Azure OpenAI Service", url: "https://learn.microsoft.com/en-us/training/paths/develop-ai-solutions-azure-openai/", platform: "Microsoft Learn" },
                                ]
                            },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── FULL STACK DEV ───────────────── */
    "Full Stack Dev": {
        role: "Full Stack Dev",
        description: "From HTML & JavaScript basics to full-stack web apps with modern frameworks.",
        totalWeeks: 40,
        sourceUrl: "https://roadmap.sh/full-stack",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–10",
                topics: [
                    {
                        area: "HTML & CSS", icon: "🌐", skills: [
                            {
                                name: "Responsive Web Design", description: "Semantic HTML, Flexbox, Grid, media queries.", resources: [
                                    { label: "Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", platform: "freeCodeCamp" },
                                    { label: "HTML & CSS (The Odin Project)", url: "https://www.theodinproject.com/paths/foundations/courses/foundations", platform: "The Odin Project" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "JavaScript", icon: "🟨", skills: [
                            {
                                name: "JavaScript Algorithms & DS", description: "ES6+, DOM, fetch, async/await, closures.", resources: [
                                    { label: "JS Algorithms & Data Structures", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", platform: "freeCodeCamp" },
                                    { label: "JavaScript (The Odin Project)", url: "https://www.theodinproject.com/paths/full-stack-javascript", platform: "The Odin Project" },
                                ]
                            },
                            {
                                name: "React Fundamentals", description: "Components, props, state, hooks, routing.", resources: [
                                    { label: "Front End Dev Libraries", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/", platform: "freeCodeCamp" },
                                    { label: "React (Odin Project)", url: "https://www.theodinproject.com/paths/full-stack-javascript/courses/react", platform: "The Odin Project" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Backend Basics", icon: "🖥️", skills: [
                            {
                                name: "Node.js & Express", description: "REST APIs, middleware, routing, CRUD.", resources: [
                                    { label: "Back End Dev & APIs", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/", platform: "freeCodeCamp" },
                                    { label: "NodeJS (Odin Project)", url: "https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs", platform: "The Odin Project" },
                                ]
                            },
                            {
                                name: "SQL & PostgreSQL", description: "Schema design, joins, indexing, CRUD.", resources: [
                                    { label: "Relational Database", url: "https://www.freecodecamp.org/learn/relational-database/", platform: "freeCodeCamp" },
                                    { label: "SQL for Data Science", url: "https://www.coursera.org/learn/sql-for-data-science", platform: "Coursera" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 11–26",
                topics: [
                    {
                        area: "TypeScript & Testing", icon: "🔷", skills: [
                            {
                                name: "TypeScript", description: "Type safety, interfaces, generics, utility types.", resources: [
                                    { label: "TypeScript (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/training/paths/build-javascript-applications-typescript/", platform: "Microsoft Learn" },
                                    { label: "Understanding TypeScript", url: "https://www.udemy.com/course/understanding-typescript/", platform: "Udemy" },
                                ]
                            },
                            {
                                name: "Testing", description: "Jest, React Testing Library, Cypress E2E.", resources: [
                                    { label: "Testing JS with Jest", url: "https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/", platform: "Udemy" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Cloud & DevOps", icon: "☁️", skills: [
                            {
                                name: "Docker", description: "Containerise apps, multi-stage builds, Compose.", resources: [
                                    { label: "Docker Mastery", url: "https://www.udemy.com/course/docker-mastery/", platform: "Udemy" },
                                    { label: "Intro to Containers (Azure)", url: "https://learn.microsoft.com/en-us/training/paths/administer-containers-in-azure/", platform: "Microsoft Learn" },
                                ]
                            },
                            {
                                name: "GitHub Actions CI/CD", description: "Automated builds, tests, and deployments.", resources: [
                                    { label: "GitHub Actions (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/training/paths/automate-workflow-github-actions/", platform: "Microsoft Learn" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 27–40",
                topics: [
                    {
                        area: "Next.js & Performance", icon: "⚡", skills: [
                            {
                                name: "Next.js App Router", description: "RSC, streaming SSR, server actions, edge.", resources: [
                                    { label: "Next.js 14 (Udemy)", url: "https://www.udemy.com/course/nextjs-react-the-complete-guide/", platform: "Udemy" },
                                    { label: "Full Stack on Vercel", url: "https://www.coursera.org/learn/developing-web-apps-with-react-and-nextjs", platform: "Coursera" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "AWS & Deployment", icon: "🔧", skills: [
                            {
                                name: "AWS for Web Developers", description: "S3, Lambda, CloudFront, RDS, Amplify.", resources: [
                                    { label: "AWS Cloud Practitioner", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-cloud%20practitioner", platform: "AWS Skill Builder" },
                                    { label: "AWS Certified Dev (Coursera)", url: "https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect", platform: "Coursera" },
                                ]
                            },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── DATA SCIENTIST ───────────────── */
    "Data Scientist": {
        role: "Data Scientist",
        description: "From statistics & Python to advanced modelling, NLP, and storytelling with data.",
        totalWeeks: 44,
        sourceUrl: "https://roadmap.sh/data-science",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–10",
                topics: [
                    {
                        area: "Python & Data", icon: "🐍", skills: [
                            {
                                name: "Data Analysis with Python", description: "Pandas, NumPy, Matplotlib, Seaborn.", resources: [
                                    { label: "Data Analysis with Python", url: "https://www.freecodecamp.org/learn/data-analysis-with-python/", platform: "freeCodeCamp" },
                                    { label: "Python for Data Science (edX)", url: "https://www.edx.org/learn/python", platform: "edX" },
                                ]
                            },
                            {
                                name: "SQL for Analysis", description: "Window functions, CTEs, aggregations.", resources: [
                                    { label: "Relational Database", url: "https://www.freecodecamp.org/learn/relational-database/", platform: "freeCodeCamp" },
                                    { label: "SQL for Data Science (Coursera)", url: "https://www.coursera.org/learn/sql-for-data-science", platform: "Coursera" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Statistics", icon: "📊", skills: [
                            {
                                name: "Statistics & Probability", description: "Distributions, hypothesis testing, Bayes.", resources: [
                                    { label: "Statistics with Python", url: "https://www.coursera.org/specializations/statistics-with-python", platform: "Coursera" },
                                    { label: "Intro to Statistics", url: "https://www.udemy.com/course/statsbeginner/", platform: "Udemy" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 11–28",
                topics: [
                    {
                        area: "Machine Learning", icon: "🧠", skills: [
                            {
                                name: "Supervised & Unsupervised ML", description: "Regression, classification, clustering, PCA.", resources: [
                                    { label: "ML Specialization (Andrew Ng)", url: "https://www.coursera.org/specializations/machine-learning-introduction", platform: "Coursera" },
                                    { label: "Intro to ML (edX)", url: "https://www.edx.org/learn/machine-learning", platform: "edX" },
                                ]
                            },
                            {
                                name: "Data Visualization & BI", description: "Tableau, Power BI, Plotly dashboards.", resources: [
                                    { label: "Data Visualization (freeCodeCamp)", url: "https://www.freecodecamp.org/learn/data-visualization/", platform: "freeCodeCamp" },
                                    { label: "Power BI (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/training/paths/create-use-analytics-reports-power-bi/", platform: "Microsoft Learn" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 29–44",
                topics: [
                    {
                        area: "Deep Learning & NLP", icon: "✨", skills: [
                            {
                                name: "NLP with Transformers", description: "BERT, sentiment, NER, text classification.", resources: [
                                    { label: "NLP Specialization", url: "https://www.coursera.org/specializations/natural-language-processing", platform: "Coursera" },
                                    { label: "NLP with Python (edX)", url: "https://www.edx.org/learn/natural-language-processing", platform: "edX" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "ML in Production", icon: "🏭", skills: [
                            {
                                name: "MLOps & Model Deployment", description: "MLflow, feature stores, monitoring.", resources: [
                                    { label: "MLOps on AWS", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-mlops", platform: "AWS Skill Builder" },
                                    { label: "MLOps Fundamentals", url: "https://www.coursera.org/learn/mlops-fundamentals", platform: "Coursera" },
                                ]
                            },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── DEVOPS ENGINEER ───────────────── */
    "DevOps Engineer": {
        role: "DevOps Engineer",
        description: "From Linux & scripting basics to cloud-native platform engineering.",
        totalWeeks: 40,
        sourceUrl: "https://roadmap.sh/devops",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–10",
                topics: [
                    {
                        area: "Linux & Scripting", icon: "🐧", skills: [
                            {
                                name: "Linux Fundamentals", description: "File system, permissions, processes, cron.", resources: [
                                    { label: "Linux Command Line Basics", url: "https://www.udemy.com/course/linux-command-line-volume1/", platform: "Udemy" },
                                    { label: "Linux on Azure", url: "https://learn.microsoft.com/en-us/training/paths/azure-linux/", platform: "Microsoft Learn" },
                                ]
                            },
                            {
                                name: "Bash Scripting", description: "Variables, loops, pipes, automation scripts.", resources: [
                                    { label: "Bash Scripting Tutorial", url: "https://www.freecodecamp.org/news/bash-scripting-tutorial-linux-shell-script-and-command-line-for-beginners/", platform: "freeCodeCamp" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Git & Networking", icon: "🌐", skills: [
                            {
                                name: "Git Advanced", description: "Rebasing, cherry-pick, hooks, workflow strategies.", resources: [
                                    { label: "Git & GitHub (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/training/paths/github-foundations/", platform: "Microsoft Learn" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 11–26",
                topics: [
                    {
                        area: "CI/CD & IaC", icon: "🔄", skills: [
                            {
                                name: "GitHub Actions / Jenkins", description: "Build pipelines, test automation, deployments.", resources: [
                                    { label: "GitHub Actions (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/training/paths/automate-workflow-github-actions/", platform: "Microsoft Learn" },
                                    { label: "CI/CD on AWS", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-devops", platform: "AWS Skill Builder" },
                                ]
                            },
                            {
                                name: "Terraform & IaC", description: "Infrastructure as Code, modules, state management.", resources: [
                                    { label: "Terraform on Azure", url: "https://learn.microsoft.com/en-us/training/paths/terraform-fundamentals/", platform: "Microsoft Learn" },
                                    { label: "HashiCorp Terraform (Udemy)", url: "https://www.udemy.com/course/terraform-beginner-to-advanced/", platform: "Udemy" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Kubernetes & Docker", icon: "☸️", skills: [
                            {
                                name: "Docker", description: "Images, containers, Dockerfile, Compose, registries.", resources: [
                                    { label: "Docker Mastery (Udemy)", url: "https://www.udemy.com/course/docker-mastery/", platform: "Udemy" },
                                    { label: "Docker on Azure", url: "https://learn.microsoft.com/en-us/training/paths/administer-containers-in-azure/", platform: "Microsoft Learn" },
                                ]
                            },
                            {
                                name: "Kubernetes", description: "Pods, services, deployments, Helm, namespaces.", resources: [
                                    { label: "Kubernetes & Docker (edX)", url: "https://www.edx.org/learn/kubernetes", platform: "edX" },
                                    { label: "AWS EKS", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-kubernetes", platform: "AWS Skill Builder" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 27–40",
                topics: [
                    {
                        area: "Platform Engineering", icon: "🏭", skills: [
                            {
                                name: "GitOps with ArgoCD", description: "Declarative CD, drift detection, Flux.", resources: [
                                    { label: "GitOps & ArgoCD (Udemy)", url: "https://www.udemy.com/course/gitops-with-argocd/", platform: "Udemy" },
                                ]
                            },
                            {
                                name: "Observability", description: "Prometheus, Grafana, Loki, OpenTelemetry.", resources: [
                                    { label: "Azure Monitor", url: "https://learn.microsoft.com/en-us/training/paths/monitor-usage-performance-availability-resources-azure-monitor/", platform: "Microsoft Learn" },
                                    { label: "AWS CloudWatch", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-monitoring", platform: "AWS Skill Builder" },
                                ]
                            },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── DATA ENGINEER ───────────────── */
    "Data Engineer": {
        role: "Data Engineer",
        description: "From SQL & Python to designing production-grade distributed data platforms.",
        totalWeeks: 44,
        sourceUrl: "https://roadmap.sh/data-engineering",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–10",
                topics: [
                    {
                        area: "Data Fundamentals", icon: "🗄️", skills: [
                            {
                                name: "SQL Mastery", description: "Advanced SQL, window functions, CTEs, indexing.", resources: [
                                    { label: "Relational Database", url: "https://www.freecodecamp.org/learn/relational-database/", platform: "freeCodeCamp" },
                                    { label: "SQL for Data Science", url: "https://www.coursera.org/learn/sql-for-data-science", platform: "Coursera" },
                                ]
                            },
                            {
                                name: "Python for Data Engineering", description: "Pandas, file I/O, ETL scripts, scheduling.", resources: [
                                    { label: "Data Analysis with Python", url: "https://www.freecodecamp.org/learn/data-analysis-with-python/", platform: "freeCodeCamp" },
                                    { label: "Python for Data Engineering (edX)", url: "https://www.edx.org/learn/python", platform: "edX" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 11–28",
                topics: [
                    {
                        area: "Pipelines & Orchestration", icon: "🔄", skills: [
                            {
                                name: "Apache Airflow", description: "DAGs, operators, XComs, task dependencies.", resources: [
                                    { label: "Airflow with Python (Udemy)", url: "https://www.udemy.com/course/the-complete-hands-on-course-to-master-apache-airflow/", platform: "Udemy" },
                                ]
                            },
                            {
                                name: "Apache Spark", description: "DataFrames, Spark SQL, PySpark, partitioning.", resources: [
                                    { label: "Big Data with Spark (Coursera)", url: "https://www.coursera.org/learn/big-data-analysis", platform: "Coursera" },
                                    { label: "Spark & PySpark (Udemy)", url: "https://www.udemy.com/course/spark-and-python-for-big-data-with-pyspark/", platform: "Udemy" },
                                ]
                            },
                            {
                                name: "Apache Kafka", description: "Topics, partitions, producers, consumers, Kafka Connect.", resources: [
                                    { label: "Kafka for Beginners (Udemy)", url: "https://www.udemy.com/course/apache-kafka/", platform: "Udemy" },
                                ]
                            },
                        ]
                    },
                    {
                        area: "Cloud Data Platforms", icon: "☁️", skills: [
                            {
                                name: "AWS Data Services", description: "Glue, Redshift, Athena, S3, Lake Formation.", resources: [
                                    { label: "AWS Data Analytics (Skill Builder)", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-data%20analytics", platform: "AWS Skill Builder" },
                                ]
                            },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 29–44",
                topics: [
                    {
                        area: "Modern Data Stack", icon: "🏗️", skills: [
                            {
                                name: "dbt (data build tool)", description: "Transformations, tests, documentation, lineage.", resources: [
                                    { label: "dbt Fundamentals (free)", url: "https://courses.getdbt.com/courses/fundamentals", platform: "Other" },
                                    { label: "Analytics Engineering (Coursera)", url: "https://www.coursera.org/learn/analytics-engineering-with-dbt", platform: "Coursera" },
                                ]
                            },
                            {
                                name: "Data Quality & Governance", description: "Great Expectations, DataHub, lineage.", resources: [
                                    { label: "Data Management on AWS", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-data%20governance", platform: "AWS Skill Builder" },
                                ]
                            },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── FRONTEND DEVELOPER ───────────────── */
    "Frontend Developer": {
        role: "Frontend Developer", description: "From HTML basics to advanced React performance and web architecture.", totalWeeks: 36, sourceUrl: "https://roadmap.sh/frontend",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–10",
                topics: [
                    {
                        area: "HTML & CSS", icon: "🌐", skills: [
                            { name: "Responsive Web Design", description: "Semantic HTML5, Flexbox, CSS Grid, media queries.", resources: [{ label: "Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", platform: "freeCodeCamp" }, { label: "HTML & CSS (Odin Project)", url: "https://www.theodinproject.com/paths/foundations", platform: "The Odin Project" }] },
                            { name: "CSS Animations & Tailwind", description: "Keyframes, transitions, utility-first CSS.", resources: [{ label: "Tailwind CSS Course", url: "https://www.udemy.com/course/tailwind-from-scratch/", platform: "Udemy" }] },
                        ]
                    },
                    {
                        area: "JavaScript", icon: "🟨", skills: [
                            { name: "JavaScript Fundamentals", description: "ES6+, closures, promises, DOM manipulation.", resources: [{ label: "JS Algorithms & DS", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", platform: "freeCodeCamp" }, { label: "The Odin Project JS", url: "https://www.theodinproject.com/paths/full-stack-javascript", platform: "The Odin Project" }] },
                            { name: "TypeScript Basics", description: "Types, interfaces, generics, narrowing.", resources: [{ label: "TypeScript (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/training/paths/build-javascript-applications-typescript/", platform: "Microsoft Learn" }] },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 11–24",
                topics: [
                    {
                        area: "React Ecosystem", icon: "⚛️", skills: [
                            { name: "React Hooks & Patterns", description: "useState, useEffect, context, custom hooks, performance.", resources: [{ label: "Front End Libraries (fCC)", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/", platform: "freeCodeCamp" }, { label: "React Complete Guide", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", platform: "Udemy" }] },
                            { name: "Next.js & SSR", description: "App router, Server Components, SSG, ISR.", resources: [{ label: "Next.js 14 (Udemy)", url: "https://www.udemy.com/course/nextjs-react-the-complete-guide/", platform: "Udemy" }] },
                            { name: "GraphQL", description: "Queries, mutations, Apollo Client.", resources: [{ label: "GraphQL with Apollo", url: "https://www.udemy.com/course/graphql-with-react-course/", platform: "Udemy" }] },
                        ]
                    },
                    {
                        area: "Tooling & Testing", icon: "🛠️", skills: [
                            { name: "Webpack & Vite", description: "Module bundling, code splitting, tree shaking.", resources: [{ label: "Vite Docs", url: "https://vitejs.dev/guide/", platform: "Docs" }] },
                            { name: "Jest & Cypress", description: "Unit, integration, and E2E testing.", resources: [{ label: "JavaScript Testing (Udemy)", url: "https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/", platform: "Udemy" }] },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 25–36",
                topics: [
                    {
                        area: "Performance & Architecture", icon: "⚡", skills: [
                            { name: "Core Web Vitals", description: "LCP, FID, CLS, Lighthouse, lazy loading.", resources: [{ label: "Web Performance (edX)", url: "https://www.edx.org/learn/web-development", platform: "edX" }] },
                            { name: "Micro-Frontends", description: "Module federation, independent deployments.", resources: [{ label: "Module Federation (Udemy)", url: "https://www.udemy.com/course/module-federation-with-webpack-5/", platform: "Udemy" }] },
                        ]
                    },
                    {
                        area: "Deployment & Edge", icon: "🌍", skills: [
                            { name: "Vercel / Cloudflare Edge", description: "Edge functions, CDN optimisation, ISR.", resources: [{ label: "AWS CloudFront", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-cloudfront", platform: "AWS Skill Builder" }] },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── BACKEND DEVELOPER ───────────────── */
    "Backend Developer": {
        role: "Backend Developer", description: "From REST APIs to distributed microservices at scale.", totalWeeks: 40, sourceUrl: "https://roadmap.sh/backend",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–10",
                topics: [
                    {
                        area: "Language & APIs", icon: "🖥️", skills: [
                            { name: "Node.js / Express", description: "Routing, middleware, REST CRUD, error handling.", resources: [{ label: "Back End Dev & APIs (fCC)", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/", platform: "freeCodeCamp" }, { label: "Node.js (Odin Project)", url: "https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs", platform: "The Odin Project" }] },
                            { name: "Java & Spring Boot", description: "Spring MVC, JPA, Hibernate, REST controllers.", resources: [{ label: "Spring Boot (Udemy)", url: "https://www.udemy.com/course/spring-framework-5-beginner-to-guru/", platform: "Udemy" }] },
                        ]
                    },
                    {
                        area: "Databases", icon: "🗄️", skills: [
                            { name: "SQL & PostgreSQL", description: "Schema design, transactions, indexing.", resources: [{ label: "SQL for Data Science", url: "https://www.coursera.org/learn/sql-for-data-science", platform: "Coursera" }, { label: "Relational DB (fCC)", url: "https://www.freecodecamp.org/learn/relational-database/", platform: "freeCodeCamp" }] },
                            { name: "Redis Caching", description: "Session storage, Pub/Sub, rate limiting.", resources: [{ label: "Redis University", url: "https://university.redis.com/", platform: "Other" }] },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 11–26",
                topics: [
                    {
                        area: "Microservices", icon: "🔀", skills: [
                            { name: "Microservices Architecture", description: "Service decomposition, API Gateway, service mesh.", resources: [{ label: "Microservices with Spring Boot", url: "https://www.udemy.com/course/microservices-with-spring-boot-and-spring-cloud/", platform: "Udemy" }] },
                            { name: "gRPC & Message Queues", description: "gRPC, Kafka, RabbitMQ.", resources: [{ label: "Apache Kafka (Udemy)", url: "https://www.udemy.com/course/apache-kafka/", platform: "Udemy" }] },
                        ]
                    },
                    {
                        area: "Docker & CI/CD", icon: "🐳", skills: [
                            { name: "Docker", description: "Images, compose, multi-stage builds.", resources: [{ label: "Docker Mastery (Udemy)", url: "https://www.udemy.com/course/docker-mastery/", platform: "Udemy" }] },
                            { name: "GitHub Actions", description: "Pipelines, test runners, auto-deploy.", resources: [{ label: "GitHub Actions (MS Learn)", url: "https://learn.microsoft.com/en-us/training/paths/automate-workflow-github-actions/", platform: "Microsoft Learn" }] },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 27–40",
                topics: [
                    {
                        area: "System Design", icon: "📐", skills: [
                            { name: "Distributed System Design", description: "CAP theorem, eventual consistency, sharding.", resources: [{ label: "System Design Interview (Educative)", url: "https://www.educative.io/courses/grokking-the-system-design-interview", platform: "Other" }] },
                            { name: "API Security & Auth", description: "JWT, OAuth 2.0, rate limiting, OWASP.", resources: [{ label: "API Security (Coursera)", url: "https://www.coursera.org/learn/api-security", platform: "Coursera" }] },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── MOBILE DEVELOPER ───────────────── */
    "Mobile Developer": {
        role: "Mobile Developer", description: "Build cross-platform mobile apps with React Native and Flutter.", totalWeeks: 36, sourceUrl: "https://roadmap.sh/react-native",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–10",
                topics: [
                    {
                        area: "JavaScript / TypeScript", icon: "🟨", skills: [
                            { name: "JavaScript Fundamentals", description: "ES6+, async/await, closures, modules.", resources: [{ label: "JS Algorithms (fCC)", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", platform: "freeCodeCamp" }] },
                            { name: "TypeScript", description: "Type annotations, interfaces, generics.", resources: [{ label: "TypeScript (MS Learn)", url: "https://learn.microsoft.com/en-us/training/paths/build-javascript-applications-typescript/", platform: "Microsoft Learn" }] },
                        ]
                    },
                    {
                        area: "React Native Basics", icon: "📱", skills: [
                            { name: "React Native Fundamentals", description: "Core components, navigation, styling, platform APIs.", resources: [{ label: "React Native (Udemy)", url: "https://www.udemy.com/course/the-complete-react-native-and-redux-course/", platform: "Udemy" }] },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 11–24",
                topics: [
                    {
                        area: "Flutter", icon: "🐦", skills: [
                            { name: "Flutter & Dart", description: "Widgets, state management (Riverpod/Bloc), animations.", resources: [{ label: "Flutter Bootcamp (Udemy)", url: "https://www.udemy.com/course/flutter-bootcamp-with-dart/", platform: "Udemy" }, { label: "Dart (freeCodeCamp)", url: "https://www.freecodecamp.org/news/learn-flutter-full-course/", platform: "freeCodeCamp" }] },
                        ]
                    },
                    {
                        area: "Native APIs & Storage", icon: "📸", skills: [
                            { name: "Camera, GPS & Storage", description: "Device APIs, SQLite, AsyncStorage, permissions.", resources: [{ label: "React Native Docs", url: "https://reactnative.dev/docs/getting-started", platform: "Docs" }] },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 25–36",
                topics: [
                    {
                        area: "Performance & Publish", icon: "⚡", skills: [
                            { name: "Performance Optimization", description: "Hermes engine, lazy loading, profiling.", resources: [{ label: "RN Performance Guide", url: "https://reactnative.dev/docs/performance", platform: "Docs" }] },
                            { name: "Play Store & App Store", description: "Signing, provisioning, CI/CD with Fastlane.", resources: [{ label: "Mobile CI/CD (Udemy)", url: "https://www.udemy.com/course/fastlane-for-android/", platform: "Udemy" }] },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── CLOUD ARCHITECT ───────────────── */
    "Cloud Architect": {
        role: "Cloud Architect", description: "Design resilient, cost-optimized multi-cloud architectures.", totalWeeks: 48, sourceUrl: "https://roadmap.sh/devops",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–10",
                topics: [
                    {
                        area: "Cloud Fundamentals", icon: "☁️", skills: [
                            { name: "AWS Cloud Practitioner", description: "IAM, EC2, S3, VPC basics.", resources: [{ label: "AWS Cloud Practitioner Essentials", url: "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials", platform: "AWS Skill Builder" }, { label: "AWS Certified Cloud Practitioner (Coursera)", url: "https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect", platform: "Coursera" }] },
                            { name: "Azure Fundamentals", description: "Azure services, resource groups, pricing.", resources: [{ label: "Azure Fundamentals (AZ-900)", url: "https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/", platform: "Microsoft Learn" }] },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 11–28",
                topics: [
                    {
                        area: "IaC & Containers", icon: "🏗️", skills: [
                            { name: "Terraform", description: "Modules, state, workspaces, multi-cloud.", resources: [{ label: "Terraform on AWS (Udemy)", url: "https://www.udemy.com/course/terraform-beginner-to-advanced/", platform: "Udemy" }, { label: "Terraform on Azure (MS Learn)", url: "https://learn.microsoft.com/en-us/training/paths/terraform-fundamentals/", platform: "Microsoft Learn" }] },
                            { name: "Kubernetes at Scale", description: "EKS, AKS, GKE, auto-scaling, network policies.", resources: [{ label: "Kubernetes on AWS", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-kubernetes", platform: "AWS Skill Builder" }, { label: "Kubernetes (edX)", url: "https://www.edx.org/learn/kubernetes", platform: "edX" }] },
                        ]
                    },
                    {
                        area: "Serverless & Networking", icon: "⚡", skills: [
                            { name: "Serverless Architecture", description: "Lambda, API Gateway, EventBridge, SAM.", resources: [{ label: "AWS Serverless (Skill Builder)", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-serverless", platform: "AWS Skill Builder" }] },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 29–48",
                topics: [
                    {
                        area: "Architecture & Cost", icon: "📐", skills: [
                            { name: "Well-Architected Framework", description: "5 pillars: reliability, security, cost, performance, ops.", resources: [{ label: "AWS Well-Architected", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-well-architected", platform: "AWS Skill Builder" }] },
                            { name: "FinOps & Cost Management", description: "Cost Explorer, Reserved Instances, Savings Plans.", resources: [{ label: "Cloud Financial Management", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-cost", platform: "AWS Skill Builder" }] },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── CYBERSECURITY ENGINEER ───────────────── */
    "Cybersecurity Engineer": {
        role: "Cybersecurity Engineer", description: "From network fundamentals to ethical hacking and enterprise security.", totalWeeks: 48, sourceUrl: "https://roadmap.sh/cyber-security",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–12",
                topics: [
                    {
                        area: "Foundations", icon: "🔐", skills: [
                            { name: "Networking Fundamentals", description: "OSI model, TCP/IP, DNS, firewalls, VPNs.", resources: [{ label: "Google Cybersecurity Certificate", url: "https://www.coursera.org/professional-certificates/google-cybersecurity", platform: "Coursera" }, { label: "CompTIA Security+ (edX)", url: "https://www.edx.org/learn/cybersecurity/comptia-security-plus", platform: "edX" }] },
                            { name: "Linux & CLI", description: "File permissions, processes, networking commands.", resources: [{ label: "Linux Basics (fCC)", url: "https://www.freecodecamp.org/news/linux-command-line-tutorial/", platform: "freeCodeCamp" }] },
                        ]
                    },
                    {
                        area: "Python for Security", icon: "🐍", skills: [
                            { name: "Python Scripting", description: "Socket programming, automation, basic scanners.", resources: [{ label: "Python for Cybersecurity (Udemy)", url: "https://www.udemy.com/course/python-for-beginners-x/", platform: "Udemy" }] },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 13–30",
                topics: [
                    {
                        area: "Ethical Hacking", icon: "🧑‍💻", skills: [
                            { name: "Penetration Testing", description: "Kali Linux, Nmap, Metasploit, OWASP Top 10.", resources: [{ label: "Ethical Hacking (Udemy)", url: "https://www.udemy.com/course/learn-ethical-hacking-from-scratch/", platform: "Udemy" }, { label: "Penetration Testing (edX)", url: "https://www.edx.org/learn/penetration-testing", platform: "edX" }] },
                            { name: "Web App Security", description: "SQLi, XSS, CSRF, Burp Suite.", resources: [{ label: "Web App Pentesting (Udemy)", url: "https://www.udemy.com/course/web-application-ethical-hacking-penetration-testing/", platform: "Udemy" }] },
                        ]
                    },
                    {
                        area: "SIEM & Compliance", icon: "📋", skills: [
                            { name: "SIEM & Threat Detection", description: "Splunk, ELK, alert rules, SoC workflows.", resources: [{ label: "AWS Security (Skill Builder)", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-security", platform: "AWS Skill Builder" }] },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 31–48",
                topics: [
                    {
                        area: "Advanced Offense & Defense", icon: "🛡️", skills: [
                            { name: "Zero Trust Architecture", description: "Identity-aware proxies, BeyondCorp, mTLS.", resources: [{ label: "Zero Trust on Azure", url: "https://learn.microsoft.com/en-us/training/paths/zero-trust-security/", platform: "Microsoft Learn" }] },
                            { name: "Cryptography & PKI", description: "RSA, AES, TLS, certificate management.", resources: [{ label: "Cryptography (Coursera)", url: "https://www.coursera.org/learn/crypto", platform: "Coursera" }] },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── QA ENGINEER ───────────────── */
    "QA Engineer": {
        role: "QA Engineer", description: "From manual testing basics to full automation frameworks.", totalWeeks: 30, sourceUrl: "https://roadmap.sh/qa",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–8",
                topics: [
                    {
                        area: "Testing Fundamentals", icon: "📋", skills: [
                            { name: "Software Testing Basics", description: "Test cases, test plans, defect lifecycle, SDLC.", resources: [{ label: "Software Testing Bootcamp (Udemy)", url: "https://www.udemy.com/course/testingbootcamp/", platform: "Udemy" }] },
                            { name: "JIRA & Bug Tracking", description: "Issue management, sprint planning, reporting.", resources: [{ label: "Agile with JIRA (Coursera)", url: "https://www.coursera.org/learn/agile-development", platform: "Coursera" }] },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 9–22",
                topics: [
                    {
                        area: "Automation", icon: "🤖", skills: [
                            { name: "Selenium WebDriver", description: "Python/Java bindings, POM, test suites.", resources: [{ label: "Selenium Python (Udemy)", url: "https://www.udemy.com/course/selenium-webdriver-with-python-and-pytest/", platform: "Udemy" }] },
                            { name: "Jest & Cypress", description: "Unit tests, component tests, E2E flows.", resources: [{ label: "Cypress E2E Testing (Udemy)", url: "https://www.udemy.com/course/cypress-io-master-class/", platform: "Udemy" }] },
                            { name: "API Testing with Postman", description: "REST assertions, Newman, CI integration.", resources: [{ label: "Postman API Testing (Udemy)", url: "https://www.udemy.com/course/rest-api-testing-automation/", platform: "Udemy" }] },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 23–30",
                topics: [
                    {
                        area: "Performance & CI", icon: "🚀", skills: [
                            { name: "Performance Testing", description: "JMeter, k6, load profiles, bottleneck analysis.", resources: [{ label: "JMeter (Udemy)", url: "https://www.udemy.com/course/learn-jmeter-from-scratch/", platform: "Udemy" }] },
                            { name: "CI/CD Integration", description: "Running tests in GitHub Actions / Jenkins.", resources: [{ label: "GitHub Actions (MS Learn)", url: "https://learn.microsoft.com/en-us/training/paths/automate-workflow-github-actions/", platform: "Microsoft Learn" }] },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── BLOCKCHAIN DEVELOPER ───────────────── */
    "Blockchain Developer": {
        role: "Blockchain Developer", description: "From blockchain basics to DeFi protocols and production dApps.", totalWeeks: 44, sourceUrl: "https://roadmap.sh/blockchain",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–10",
                topics: [
                    {
                        area: "Blockchain Fundamentals", icon: "⛓️", skills: [
                            { name: "Blockchain Concepts", description: "Consensus, hashing, public/private keys, wallets.", resources: [{ label: "Blockchain Basics (Coursera)", url: "https://www.coursera.org/learn/blockchain-basics", platform: "Coursera" }, { label: "Blockchain (edX)", url: "https://www.edx.org/learn/blockchain", platform: "edX" }] },
                            { name: "JavaScript & Node.js", description: "Async patterns, Web3.js fundamentals.", resources: [{ label: "JS Algorithms (fCC)", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", platform: "freeCodeCamp" }] },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 11–28",
                topics: [
                    {
                        area: "Smart Contracts", icon: "📜", skills: [
                            { name: "Solidity", description: "Data types, mappings, events, modifiers, gas.", resources: [{ label: "Ethereum & Solidity (Udemy)", url: "https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/", platform: "Udemy" }, { label: "Blockchain Dev (fCC)", url: "https://www.freecodecamp.org/news/learn-solidity-blockchain-and-smart-contracts-in-a-free/", platform: "freeCodeCamp" }] },
                            { name: "Hardhat & Truffle", description: "Local devnets, testing, deployment scripts.", resources: [{ label: "Hardhat Docs", url: "https://hardhat.org/docs", platform: "Docs" }] },
                        ]
                    },
                    {
                        area: "Web3 Frontend", icon: "🌐", skills: [
                            { name: "Ethers.js / Web3.js", description: "Wallet integration, contract calls, events.", resources: [{ label: "Full Stack Web3 (edX)", url: "https://www.edx.org/learn/blockchain", platform: "edX" }] },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 29–44",
                topics: [
                    {
                        area: "DeFi & Security", icon: "🔒", skills: [
                            { name: "DeFi Protocols", description: "AMMs, lending protocols, liquidity pools.", resources: [{ label: "DeFi on Coursera", url: "https://www.coursera.org/learn/decentralized-finance-infrastructure", platform: "Coursera" }] },
                            { name: "Smart Contract Auditing", description: "Reentrancy, overflow, formal verification.", resources: [{ label: "Smart Contract Security (Udemy)", url: "https://www.udemy.com/course/smart-contract-security/", platform: "Udemy" }] },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── SRE ───────────────── */
    "SRE": {
        role: "SRE", description: "From Linux & coding to defining SLOs, incident management, and platform reliability.", totalWeeks: 44, sourceUrl: "https://roadmap.sh/devops",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–10",
                topics: [
                    {
                        area: "Linux & Programming", icon: "🐧", skills: [
                            { name: "Linux Administration", description: "Kernel, networking, systemd, performance tools.", resources: [{ label: "Linux Fundamentals (Udemy)", url: "https://www.udemy.com/course/linux-administration-bootcamp/", platform: "Udemy" }] },
                            { name: "Python for Ops", description: "Automation scripts, API calls, alerting tools.", resources: [{ label: "Scientific Computing (fCC)", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", platform: "freeCodeCamp" }] },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 11–28",
                topics: [
                    {
                        area: "Observability", icon: "📊", skills: [
                            { name: "Prometheus & Grafana", description: "Metrics, dashboards, alerting, PromQL.", resources: [{ label: "SRE on Google Cloud (Coursera)", url: "https://www.coursera.org/learn/site-reliability-engineering-slos", platform: "Coursera" }, { label: "AWS CloudWatch (Skill Builder)", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-monitoring", platform: "AWS Skill Builder" }] },
                            { name: "Distributed Tracing", description: "Jaeger, OpenTelemetry, trace context propagation.", resources: [{ label: "Azure Monitor (MS Learn)", url: "https://learn.microsoft.com/en-us/training/paths/monitor-usage-performance-availability-resources-azure-monitor/", platform: "Microsoft Learn" }] },
                        ]
                    },
                    {
                        area: "Kubernetes & Cloud", icon: "☸️", skills: [
                            { name: "Kubernetes Operations", description: "HPA, VPA, chaos engineering, Helm.", resources: [{ label: "Kubernetes (edX)", url: "https://www.edx.org/learn/kubernetes", platform: "edX" }, { label: "AWS EKS (Skill Builder)", url: "https://explore.skillbuilder.aws/learn/catalog?ctldoc-catalog-0=se-eks", platform: "AWS Skill Builder" }] },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 29–44",
                topics: [
                    {
                        area: "Reliability Engineering", icon: "🎯", skills: [
                            { name: "SLOs, SLAs & Error Budgets", description: "Defining reliability targets, burn rate alerts.", resources: [{ label: "SRE Book (Google)", url: "https://sre.google/sre-book/table-of-contents/", platform: "Docs" }] },
                            { name: "Incident Management", description: "On-call rotations, post-mortems, runbooks.", resources: [{ label: "Incident Management (Coursera)", url: "https://www.coursera.org/learn/site-reliability-engineering-slos", platform: "Coursera" }] },
                        ]
                    },
                ],
            },
        ],
    },

    /* ───────────────── PRODUCT MANAGER ───────────────── */
    "Product Manager": {
        role: "Product Manager", description: "From agile basics to leading data-driven product strategy at scale.", totalWeeks: 32, sourceUrl: "https://roadmap.sh/product-manager",
        levels: [
            {
                level: "Beginner", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", icon: "🌱", durationHint: "Weeks 1–8",
                topics: [
                    {
                        area: "PM Foundations", icon: "💡", skills: [
                            { name: "Agile & Scrum", description: "Sprints, ceremonies, backlog refinement, story points.", resources: [{ label: "Agile Fundamentals (Coursera)", url: "https://www.coursera.org/learn/agile-development", platform: "Coursera" }, { label: "Product Management (edX)", url: "https://www.edx.org/learn/product-management", platform: "edX" }] },
                            { name: "User Research", description: "Interviews, surveys, persona creation, Jobs-to-be-Done.", resources: [{ label: "UX Research (Coursera)", url: "https://www.coursera.org/learn/ux-design-fundamentals", platform: "Coursera" }] },
                        ]
                    },
                ],
            },
            {
                level: "Intermediate", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "⚙️", durationHint: "Weeks 9–22",
                topics: [
                    {
                        area: "Data & Strategy", icon: "📊", skills: [
                            { name: "Product Analytics", description: "Funnel analysis, cohorts, retention, Mixpanel/GA4.", resources: [{ label: "Product Analytics (Udemy)", url: "https://www.udemy.com/course/product-management/", platform: "Udemy" }] },
                            { name: "A/B Testing", description: "Experiment design, statistical significance, holdouts.", resources: [{ label: "A/B Testing (Udemy)", url: "https://www.udemy.com/course/data-driven-product-management/", platform: "Udemy" }] },
                            { name: "Figma Prototyping", description: "Wireframes, clickable prototypes, design systems.", resources: [{ label: "Figma UI Design (Udemy)", url: "https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial-course/", platform: "Udemy" }] },
                        ]
                    },
                ],
            },
            {
                level: "Advanced", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", icon: "🚀", durationHint: "Weeks 23–32",
                topics: [
                    {
                        area: "Leadership & GTM", icon: "🎯", skills: [
                            { name: "Product Roadmap Strategy", description: "OKRs, prioritization frameworks, stakeholder alignment.", resources: [{ label: "PM Leadership (Coursera)", url: "https://www.coursera.org/learn/product-strategy", platform: "Coursera" }] },
                            { name: "Go-to-Market", description: "Positioning, pricing, launch planning, enablement.", resources: [{ label: "Product Marketing (edX)", url: "https://www.edx.org/learn/marketing", platform: "edX" }] },
                        ]
                    },
                ],
            },
        ],
    },
};
