import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Question {
  id: string;
  category: "project" | "behavioral" | "technical" | "situational";
  text: string;
  skillTag?: string;
  hint: string;
}

interface AnswerRecord {
  question: Question;
  transcript: string;
  durationSec: number;
  wordCount: number;
  fillerCount: number;
  techKeywords: number;
}

interface SoftSkillScores {
  clarity: number;
  confidence: number;
  depth: number;
  fluency: number;
  overall: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const FILLERS = ["um", "uh", "like", "you know", "basically", "literally", "actually", "sort of", "kind of", "right", "so", "well"];
const TECH_WORDS = ["api", "algorithm", "data", "model", "database", "server", "client", "function", "component", "deploy", "container", "cache", "async", "query", "schema", "architecture", "performance", "scalability", "integration", "pipeline", "feature", "training", "accuracy", "metric", "test", "debug", "production", "version", "git", "ci", "cd", "aws", "docker", "kubernetes", "react", "python", "sql", "node", "typescript", "rest", "graphql", "microservice", "authentication", "authorization", "encryption", "monitoring", "logging", "indexing", "optimization", "refactor", "sprint", "agile", "scrum"];

const CAT_COLORS: Record<Question["category"], string> = {
  project: "#6366f1",
  behavioral: "#0d9488",
  technical: "#f59e0b",
  situational: "#ec4899",
};
const CAT_LABELS: Record<Question["category"], string> = {
  project: "📁 Project",
  behavioral: "🧠 Behavioral",
  technical: "⚙️ Technical",
  situational: "🎯 Situational",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function countFillers(text: string): number {
  const lower = text.toLowerCase();
  return FILLERS.reduce((n, f) => {
    const re = new RegExp(`\\b${f}\\b`, "gi");
    return n + (lower.match(re)?.length || 0);
  }, 0);
}

function countTechWords(text: string): number {
  const lower = text.toLowerCase();
  return TECH_WORDS.filter(w => lower.includes(w)).length;
}

// ─── Question Generation ──────────────────────────────────────────────────────
function projectQuestion(skill: string, jobRole: string): string {
  const templates = [
    `You have ${skill} listed on your resume. Walk me through a project where you used it — what problem were you solving, and what was the outcome?`,
    `Tell me about your most impactful work involving ${skill}. What was your specific contribution?`,
    `How have you applied ${skill} in a real-world context? What challenges did you face?`,
    `Describe the most technically complex project you've built using ${skill}.`,
    `If you had to mentor a junior engineer on ${skill}, what are the 3 most important things to know?`,
  ];
  return templates[Math.abs(skill.length + jobRole.length) % templates.length];
}

function situationalFor(jobRole: string): Question[] {
  const map: Record<string, Question[]> = {
    "ML Engineer": [
      { id: "sit-ml-1", category: "situational", text: "Your production model's accuracy dropped 15% overnight. Walk me through your debugging process.", hint: "Data drift, feature pipeline, model versioning, monitoring — cover these systematically." },
      { id: "sit-ml-2", category: "situational", text: "A stakeholder insists the model needs 99% accuracy. You're at 87%. How do you respond?", hint: "Talk about precision-recall tradeoff, business requirements, and setting realistic expectations." },
    ],
    "Full Stack Developer": [
      { id: "sit-fs-1", category: "situational", text: "Your API is getting 10x the expected traffic and is slowing down. What do you do?", hint: "Caching, database indexing, load balancing, horizontal scaling — prioritize by impact." },
      { id: "sit-fs-2", category: "situational", text: "A critical bug is found 30 minutes before a major client demo. How do you handle it?", hint: "Triage severity, hotfix vs feature flag vs rollback, communication to stakeholders." },
    ],
    "Data Scientist": [
      { id: "sit-ds-1", category: "situational", text: "You're given a dataset with 40% missing values. What's your strategy?", hint: "EDA first, then imputation methods, feature engineering, or dropping based on context." },
      { id: "sit-ds-2", category: "situational", text: "Your analysis contradicts the CEO's intuition. How do you present your findings?", hint: "Data storytelling, confidence intervals, showing the 'so what', using visualizations." },
    ],
    "default": [
      { id: "sit-d-1", category: "situational", text: "A critical bug is found an hour before a major release. What do you do?", hint: "Severity assessment, rollback plan, stakeholder communication, post-mortem process." },
      { id: "sit-d-2", category: "situational", text: "Your team disagrees on a technical architecture. How do you reach consensus?", hint: "Document trade-offs, time-box the discussion, use prototypes or spikes to validate." },
    ],
  };
  return map[jobRole] || map["default"];
}

function technicalFor(jobRole: string, found: string[]): Question[] {
  const map: Record<string, Question[]> = {
    "ML Engineer": [
      { id: "tech-ml-1", category: "technical", text: "Explain the bias-variance tradeoff and how you detect overfitting in a model you've built.", hint: "Training vs validation curves, regularization, cross-validation." },
      { id: "tech-ml-2", category: "technical", text: "How would you design an end-to-end MLOps pipeline from training to production monitoring?", hint: "Data versioning, model registry, CI/CD for ML, drift detection, rollback strategy." },
    ],
    "Full Stack Developer": [
      { id: "tech-fs-1", category: "technical", text: "Explain how you'd design a scalable REST API with rate limiting and auth.", hint: "JWT/OAuth, middleware, Redis for rate limiting, database indexing." },
      { id: "tech-fs-2", category: "technical", text: "Walk me through the differences between server-side rendering and client-side rendering.", hint: "SEO, TTFB, hydration, use cases for each approach." },
    ],
    "Data Scientist": [
      { id: "tech-ds-1", category: "technical", text: "How do you handle class imbalance in a classification problem?", hint: "SMOTE, class weights, precision-recall over accuracy, threshold tuning." },
      { id: "tech-ds-2", category: "technical", text: "Walk me through how you would set up an A/B test from scratch.", hint: "Hypothesis, sample size, control/treatment, statistical significance, p-value." },
    ],
    "default": [
      { id: "tech-d-1", category: "technical", text: "Describe how you approach debugging a complex issue in a production system.", hint: "Systematic isolation, logging, monitoring, rollback strategy." },
      { id: "tech-d-2", category: "technical", text: "How do you think about system scalability when starting a new project?", hint: "Vertical vs horizontal scaling, caching, async processing, database design." },
    ],
  };
  // suppress unused warning
  void found;
  return map[jobRole] || map["default"];
}

function generateQuestions(found: string[], jobRole: string, resumeText: string): Question[] {
  void resumeText;
  const questions: Question[] = [];
  const topSkills = (found || []).slice(0, 6);
  topSkills.forEach((skill, i) => {
    questions.push({
      id: `proj-${i}`,
      category: "project",
      skillTag: skill,
      text: projectQuestion(skill, jobRole || ""),
      hint: `Describe a specific project. Use: Context → Problem → Your Role → Solution using ${skill} → Outcome with metrics.`,
    });
  });

  const behavioral: Question[] = [
    { id: "beh-1", category: "behavioral", text: "Tell me about a time you faced a major technical challenge. How did you handle it?", hint: "Use STAR: Situation → Task → Action → Result. Quantify your impact." },
    { id: "beh-2", category: "behavioral", text: "Describe how you collaborate with cross-functional teams on a project.", hint: "Show communication skills, empathy, and your role as a team player." },
    { id: "beh-3", category: "behavioral", text: "How do you handle conflicting deadlines or multiple high-priority tasks?", hint: "Talk about prioritization frameworks: urgency vs importance, stakeholder communication." },
    { id: "beh-4", category: "behavioral", text: "Tell me about a mistake you made in a project and what you learned.", hint: "Be honest and specific. Focus on what you learned and what changed in your approach." },
  ];

  const situational = situationalFor(jobRole || "default");
  const technical = technicalFor(jobRole || "default", found || []);

  return [...questions, ...behavioral.slice(0, 2), ...situational.slice(0, 2), ...technical.slice(0, 2)];
}

// ─── Scoring Engine ───────────────────────────────────────────────────────────
function scoreAnswers(answers: AnswerRecord[]): SoftSkillScores {
  if (!answers.length) return { clarity: 0, confidence: 0, depth: 0, fluency: 0, overall: 0 };

  const totalWords = answers.reduce((s, a) => s + a.wordCount, 0);
  const avgWords = totalWords / answers.length;
  const totalFillers = answers.reduce((s, a) => s + a.fillerCount, 0);
  const totalTech = answers.reduce((s, a) => s + a.techKeywords, 0);
  const totalDuration = answers.reduce((s, a) => s + a.durationSec, 0);

  const clarity = Math.round(Math.min((avgWords / 120) * 100, 100));
  const fillerRate = totalWords > 0 ? totalFillers / totalWords : 0;
  const confidence = Math.round(Math.max(0, Math.min(100, (1 - fillerRate * 10) * 100)));
  const depthRaw = totalWords > 0 ? (totalTech / totalWords) * 100 * 15 : 0;
  const depth = Math.round(Math.min(depthRaw, 100));
  const avgWPM = totalDuration > 0 ? (totalWords / totalDuration) * 60 : 0;
  const fluency = Math.round(Math.min(avgWPM > 0 ? (avgWPM / 130) * 100 : 50, 100));
  const overall = Math.round(clarity * 0.25 + confidence * 0.25 + depth * 0.3 + fluency * 0.2);

  return { clarity, confidence, depth, fluency, overall };
}

// ─── Animated Score Arc (Living Doodle Gauge) ────────────────────────────────────
function ScoreArc({ score, label, color, size = 90 }: { score: number; label: string; color: string; size?: number }) {
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  // Use a state-driven target dash to trigger React CSS transition
  const [dash, setDash] = useState(0);
  useEffect(() => {
    // Slight delay for fluid entrance
    const t = setTimeout(() => setDash((score / 100) * circ), 100);
    return () => clearTimeout(t);
  }, [score, circ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Continuous slow rotation via CSS -- creates the living doodle effect */}
        <style>
          {`
            @keyframes slowSpin1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes slowSpin2 { from { transform: rotate(90deg); } to { transform: rotate(-270deg); } }
            `}
        </style>

        {/* Background track */}
        <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0 }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        </svg>

        {/* Outer overlapping doodle ring 1 */}
        <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, animation: "slowSpin1 40s linear infinite", opacity: 0.4 }}>
          <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke={color} strokeWidth={2}
            strokeDasharray={`${dash * 0.9} ${circ}`} strokeDashoffset={circ * 0.25}
            strokeLinecap="round" style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }} />
        </svg>

        {/* Outer overlapping doodle ring 2 */}
        <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, animation: "slowSpin2 35s linear infinite", opacity: 0.3 }}>
          <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke={color} strokeWidth={2}
            strokeDasharray={`${dash * 1.1} ${circ}`} strokeDashoffset={circ * 0.5}
            strokeLinecap="round" style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }} />
        </svg>

        {/* Main Score Arc */}
        <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0 }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
            strokeLinecap="round" style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }} />
          <text x={cx} y={cy + 5} textAnchor="middle" fill="#fff" fontSize={size * 0.18} fontWeight={800}>{score}</text>
        </svg>
      </div>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function MockInterviewTab({ T, jobRole, missing, found, skillScore, resumeText }: any) {
  // ── Phase ──
  const [phase, setPhase] = useState<"lobby" | "session" | "report">("lobby");

  // ── Camera / Mic ──
  const [camEnabled, setCamEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [camError, setCamError] = useState("");

  // ── Session ──
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [qTimer, setQTimer] = useState(90);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // ── Refs (no re-renders) ──
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answerStartRef = useRef<number>(Date.now());
  const sessionActiveRef = useRef(false);
  const isListeningRef = useRef(false);
  const isSpeakingRef = useRef(false);
  // startRecognitionRef — lets onend call startRecognition() to get a FRESH instance each cycle
  // (Chrome silently rejects calling .start() on the same ended SpeechRecognition object)
  const startRecognitionRef = useRef<() => void>(() => { });
  // Audio meter canvas
  const meterCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const meterRafRef = useRef<number | null>(null);

  // ── Camera ────────────────────────────────────────────────────────────────
  const enableCamera = useCallback(async () => {
    try {
      setCamError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => { });
      }
      // Audio level meter via WebAudio — draws to canvas (no React re-renders)
      try {
        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        source.connect(analyser);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        const buf = new Uint8Array(analyser.frequencyBinCount);
        const WEIGHTS = [0.2, 0.5, 0.8, 0.6, 0.35, 0.7, 0.45, 0.9, 0.55, 0.3];
        const tick = () => {
          meterRafRef.current = requestAnimationFrame(tick);
          const canvas = meterCanvasRef.current;
          if (!canvas) return;
          analyser.getByteFrequencyData(buf);
          const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
          const level = Math.min(avg * 2.2, 100);
          const dc = canvas.getContext("2d");
          if (!dc) return;
          dc.clearRect(0, 0, canvas.width, canvas.height);
          const W = canvas.width;
          const H = canvas.height;
          const barW = W / WEIGHTS.length;
          for (let i = 0; i < WEIGHTS.length; i++) {
            const barH = isListeningRef.current ? Math.max(3, level * WEIGHTS[i] * 0.18) : 3;
            dc.fillStyle = isSpeakingRef.current ? "#22c55e" : isListeningRef.current ? "#0d9488" : "#444";
            dc.beginPath();
            dc.roundRect(i * barW + 1, H - barH, barW - 2, barH, 2);
            dc.fill();
          }
        };
        meterRafRef.current = requestAnimationFrame(tick);
      } catch { }
      setCamEnabled(true);
      setMicEnabled(true);
    } catch {
      setCamError("Camera/mic access denied. Please allow permissions in your browser and refresh.");
    }
  }, []);

  // Re-attach stream to video element after phase change (new DOM element mounted)
  useEffect(() => {
    if (streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => { });
    }
  });

  const toggleMic = useCallback(() => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setMicEnabled(m => !m);
  }, []);

  const stopCamera = useCallback(() => {
    if (meterRafRef.current) cancelAnimationFrame(meterRafRef.current);
    audioCtxRef.current?.close().catch(() => { });
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCamEnabled(false);
    setMicEnabled(false);
  }, []);

  // ── Speech Recognition ────────────────────────────────────────────────────
  const startRecognition = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn("[Interview] SpeechRecognition not supported.");
      return;
    }
    // Clean up previous instance
    try { recognitionRef.current?.abort(); } catch { }

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.maxAlternatives = 1;
    // Tell the browser we want fast, short results
    // (not a standard spec property but Chrome respects it implicitly with continuous=true)

    rec.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
    };

    rec.onsoundstart = () => { isSpeakingRef.current = true; };
    rec.onsoundend = () => { isSpeakingRef.current = false; };
    rec.onspeechend = () => { isSpeakingRef.current = false; };

    rec.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalText += res[0].transcript + " ";
        else interimText += res[0].transcript;
      }
      if (finalText) setTranscript(prev => prev + finalText);
      setInterimTranscript(interimText);
    };

    rec.onerror = (e: any) => {
      // Hard permission error — stop everything
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        sessionActiveRef.current = false;
        isListeningRef.current = false;
        setIsListening(false);
        isSpeakingRef.current = false;
      }
      // All other errors (no-speech, aborted, network) → onend fires next and handles restart
    };

    // SINGLE restart path — always create a FRESH instance (never reuse ended object)
    rec.onend = () => {
      isSpeakingRef.current = false;
      setInterimTranscript("");
      if (sessionActiveRef.current) {
        // 150ms breathing room before Chrome re-acquires the mic
        setTimeout(() => {
          if (sessionActiveRef.current) startRecognitionRef.current();
        }, 150);
      } else {
        isListeningRef.current = false;
        setIsListening(false);
      }
    };

    recognitionRef.current = rec;
    try { rec.start(); } catch (e) {
      console.warn("[Interview] Could not start recognition:", e);
    }
  }, []);

  // Keep ref in sync so onend closure always calls the latest startRecognition
  startRecognitionRef.current = startRecognition;

  // ── Session Control ────────────────────────────────────────────────────────
  const startSession = useCallback(() => {
    const qs = generateQuestions(found || [], jobRole || "", resumeText || "");
    setQuestions(qs);
    setQIndex(0);
    setAnswers([]);
    setTranscript("");
    setInterimTranscript("");
    setQTimer(90);
    setShowHint(false);
    sessionActiveRef.current = true;
    setSessionStarted(true);
    setPhase("session");
    answerStartRef.current = Date.now();
    // Small delay so the session video element mounts before we start recognition
    setTimeout(() => startRecognition(), 400);
  }, [found, jobRole, resumeText, startRecognition]);

  // ── Per-question timer ─────────────────────────────────────────────────────
  // nextQuestion is declared below but referenced by the timer — we use a ref to avoid stale closure
  const nextQuestionRef = useRef<() => void>(() => { });

  useEffect(() => {
    if (phase !== "session" || !sessionStarted) return;
    timerRef.current = setInterval(() => {
      setQTimer(t => {
        if (t <= 1) {
          nextQuestionRef.current();
          return 90;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, sessionStarted, qIndex]);

  // ── Answer management ─────────────────────────────────────────────────────
  // Use refs to read live values inside saveAnswer (no stale closure)
  const transcriptRef = useRef(transcript);
  transcriptRef.current = transcript;
  const questionsRef = useRef(questions);
  questionsRef.current = questions;
  const qIndexRef = useRef(qIndex);
  qIndexRef.current = qIndex;

  const saveAnswer = useCallback(() => {
    const q = questionsRef.current[qIndexRef.current];
    if (!q) return;
    const fullText = transcriptRef.current.trim();
    const words = fullText.split(/\s+/).filter(Boolean);
    setAnswers(prev => [
      ...prev,
      {
        question: q,
        transcript: fullText,
        durationSec: (Date.now() - answerStartRef.current) / 1000,
        wordCount: words.length,
        fillerCount: countFillers(fullText),
        techKeywords: countTechWords(fullText),
      },
    ]);
  }, []);

  const nextQuestion = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    saveAnswer();
    setTranscript("");
    setInterimTranscript("");
    setShowHint(false);
    answerStartRef.current = Date.now();
    setQIndex(prev => {
      const next = prev + 1;
      if (next >= questionsRef.current.length) {
        // End session — use setTimeout to avoid calling setState inside setState cycle
        setTimeout(() => {
          sessionActiveRef.current = false;
          try { recognitionRef.current?.abort(); } catch { }
          setSessionStarted(false);
          isListeningRef.current = false;
          setIsListening(false);
          setPhase("report");
        }, 50);
        return prev;
      }
      setQTimer(90);
      return next;
    });
  }, [saveAnswer]);

  // Keep the ref in sync with the latest nextQuestion
  nextQuestionRef.current = nextQuestion;

  const endSession = useCallback(() => {
    sessionActiveRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    try { recognitionRef.current?.abort(); } catch { }
    isListeningRef.current = false;
    setSessionStarted(false);
    setIsListening(false);
    saveAnswer();
    setPhase("report");
  }, [saveAnswer]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      sessionActiveRef.current = false;
      if (meterRafRef.current) cancelAnimationFrame(meterRafRef.current);
      audioCtxRef.current?.close().catch(() => { });
      streamRef.current?.getTracks().forEach(t => t.stop());
      try { recognitionRef.current?.abort(); } catch { }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────────
  const scores = scoreAnswers(answers);
  const readiness = Math.round(
    (100 - ((missing || []).length / Math.max((found || []).length + (missing || []).length, 1)) * 100) * 0.7 +
    (skillScore || 0) * 0.3
  );
  const timerPct = (qTimer / 90) * 100;
  const timerColor = qTimer > 30 ? "#22c55e" : qTimer > 15 ? "#f59e0b" : "#ef4444";
  const currentQ = questions[qIndex] || { id: "", category: "behavioral" as const, text: "", hint: "" };

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE: LOBBY
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "lobby") {
    return (
      <div style={{ padding: "8px 0" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: T.text, margin: 0 }}>🎤 Mock Interview</h2>
          <p style={{ color: T.muted, marginTop: 6, fontSize: 14 }}>AI-powered live interview based on your resume. Camera + mic required.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Camera preview */}
          <div>
            <div style={{ background: "#0a0a0a", borderRadius: 16, overflow: "hidden", aspectRatio: "16/9", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${camEnabled ? T.accent3 : T.border}`, transition: "border-color .3s" }}>
              {camEnabled ? (
                <video ref={videoRef} muted autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 56, marginBottom: 12 }}>📷</div>
                  <div style={{ fontSize: 13, color: "#888" }}>Click below to enable camera</div>
                </div>
              )}
              {camEnabled && (
                <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.7)", borderRadius: 8, padding: "5px 10px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite" }} />
                  <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>Camera On</span>
                </div>
              )}
            </div>

            {camError && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "#ef444420", border: "1px solid #ef444450", borderRadius: 10, fontSize: 12, color: "#ef4444" }}>
                ⚠️ {camError}
              </div>
            )}

            {!camEnabled ? (
              <button onClick={enableCamera} style={{ marginTop: 14, width: "100%", padding: "13px 0", background: `linear-gradient(135deg, ${T.accent}, #7c3aed)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${T.accent}44` }}>
                📷 Enable Camera & Microphone
              </button>
            ) : (
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button onClick={toggleMic} style={{ flex: 1, padding: "11px 0", background: micEnabled ? T.cardBg : "#ef444420", color: micEnabled ? T.text : "#ef4444", border: `1px solid ${micEnabled ? T.border : "#ef444450"}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {micEnabled ? "🎤 Mic On" : "🔇 Mic Off"}
                </button>
                <button onClick={stopCamera} style={{ flex: 1, padding: "11px 0", background: "#ef444415", color: "#ef4444", border: "1px solid #ef444440", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Stop Camera
                </button>
              </div>
            )}
          </div>

          {/* Readiness panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Interview Readiness</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: T.accent, lineHeight: 1 }}>{readiness}%</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{readiness >= 70 ? "You're ready! 🎉" : readiness >= 40 ? "Almost there 💪" : "More prep needed 📚"}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>Based on your resume skills</div>
                </div>
              </div>
              <div style={{ height: 8, background: T.inputBg || T.border, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${readiness}%`, background: `linear-gradient(90deg, ${T.accent}, #22c55e)`, borderRadius: 99, transition: "width 1s ease" }} />
              </div>
            </div>

            <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Skills Being Tested</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(found || []).slice(0, 8).map((s: string) => (
                  <span key={s} style={{ background: T.accent + "15", color: T.accent, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>{s}</span>
                ))}
                {!(found || []).length && <span style={{ color: T.muted, fontSize: 13 }}>Upload a resume to generate skill-based questions</span>}
              </div>
            </div>

            <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Session Overview</div>
              {[
                { label: "📁 Project Questions", count: Math.min((found || []).length, 6) },
                { label: "🧠 Behavioral", count: 2 },
                { label: "🎯 Situational", count: 2 },
                { label: "⚙️ Technical", count: 2 },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.border}20` }}>
                  <span style={{ fontSize: 13, color: T.text }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>{row.count}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Total</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: T.accent }}>{Math.min((found || []).length, 6) + 6}</span>
              </div>
            </div>

            <button
              onClick={startSession}
              style={{ padding: "16px 0", background: `linear-gradient(135deg, ${T.accent}, #7c3aed)`, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: `0 6px 20px ${T.accent}50`, transition: "all .3s", width: "100%", marginTop: 8 }}
            >
              🚀 Start Interview Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE: SESSION
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "session") {
    return (
      <div style={{ padding: "8px 0" }}>
        {/* Session header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>
              Question {qIndex + 1} <span style={{ color: T.muted, fontWeight: 400, fontSize: 14 }}>of {questions.length}</span>
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: 5 }}>
              {questions.map((_, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < qIndex ? T.accent3 : i === qIndex ? T.accent : T.border, transition: "background .3s" }} />
              ))}
            </div>
            <button onClick={endSession} style={{ background: "#ef444420", color: "#ef4444", border: "1px solid #ef444444", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              End Session
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
          {/* Left: camera + timer */}
          <div>
            <div style={{ background: "#0a0a0a", borderRadius: 14, overflow: "hidden", aspectRatio: "16/9", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {camEnabled ? (
                <video ref={videoRef} muted autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 40 }}>👤</span>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>Camera off</div>
                </div>
              )}
              {/* Mic status overlay */}
              <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.7)", borderRadius: 8, padding: "5px 10px" }}>
                  {isListening ? (
                    <>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite" }} />
                      <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>Listening</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: 12 }}>🔇</span>
                      <span style={{ fontSize: 11, color: "#aaa" }}>Mic off</span>
                    </>
                  )}
                </div>
                <button onClick={toggleMic} style={{ background: "rgba(0,0,0,0.7)", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 14, cursor: "pointer", color: "#fff" }}>
                  {micEnabled ? "🎤" : "🔇"}
                </button>
              </div>
            </div>

            {/* Countdown timer */}
            <div style={{ marginTop: 14, background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>⏱ Time Remaining</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: timerColor, fontVariantNumeric: "tabular-nums" }}>
                  {String(Math.floor(qTimer / 60)).padStart(2, "0")}:{String(qTimer % 60).padStart(2, "0")}
                </span>
              </div>
              <div style={{ height: 8, background: T.inputBg || T.border, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${timerPct}%`, background: timerColor, borderRadius: 99, transition: "width 1s linear, background .3s" }} />
              </div>
            </div>
          </div>

          {/* Right: question + transcript */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Question card */}
            <div style={{ background: T.cardBg, border: `2px solid ${CAT_COLORS[currentQ.category]}33`, borderRadius: 16, padding: "22px 24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${CAT_COLORS[currentQ.category]}, transparent)`, borderRadius: "16px 16px 0 0" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ background: CAT_COLORS[currentQ.category] + "20", color: CAT_COLORS[currentQ.category], borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                  {CAT_LABELS[currentQ.category]}
                </span>
                {currentQ.skillTag && (
                  <span style={{ background: T.accent + "15", color: T.accent, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
                    🔖 {currentQ.skillTag}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #7c3aed)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  🤖
                </div>
                <div>
                  <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginBottom: 6 }}>AI Interviewer</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: T.text, lineHeight: 1.55 }}>{currentQ.text}</div>
                </div>
              </div>
              {/* Hint */}
              <div style={{ marginTop: 14, borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
                <button onClick={() => setShowHint(h => !h)} style={{ background: "none", border: "none", cursor: "pointer", color: T.accent, fontSize: 12, fontWeight: 600, padding: 0, display: "flex", alignItems: "center", gap: 5 }}>
                  {showHint ? "▾ Hide hint" : "▸ Show hint"}
                </button>
                {showHint && (
                  <div style={{ marginTop: 8, fontSize: 12, color: T.muted, lineHeight: 1.6, background: T.accent + "10", borderRadius: 8, padding: "10px 12px" }}>
                    💡 {currentQ.hint}
                  </div>
                )}
              </div>
            </div>

            {/* Live transcript */}
            <div style={{ background: T.cardBg, border: `1px solid ${isListening ? T.accent3 + "50" : T.border}`, borderRadius: 14, padding: "16px 18px", flex: 1, minHeight: 140, transition: "border-color .4s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>🖊 Your Answer</div>
                {/* Canvas mic meter — no React re-renders */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <canvas ref={meterCanvasRef} width={80} height={20} style={{ display: "block" }} />
                  <span style={{ fontSize: 10, color: isListening ? T.accent3 : T.muted, fontWeight: 600 }}>
                    {isListening ? "Listening…" : "Mic off"}
                  </span>
                </div>
              </div>
              <textarea
                value={transcript + (interimTranscript ? " " + interimTranscript : "")}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  setInterimTranscript("");
                }}
                placeholder={isListening ? "Speak now or type your answer..." : "Type your answer here or enable microphone to begin..."}
                style={{
                  width: "100%",
                  minHeight: 120,
                  background: "transparent",
                  border: "none",
                  color: T.text,
                  fontSize: 14,
                  lineHeight: 1.8,
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit"
                }}
              />
              {(transcript || interimTranscript) && (
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.border}`, display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {/* Count interim words too so stats update live as you speak */}
                  <span style={{ fontSize: 11, color: T.muted }}>Words: <strong style={{ color: T.text }}>{(transcript + " " + interimTranscript).split(/\s+/).filter(Boolean).length}</strong></span>
                  <span style={{ fontSize: 11, color: T.muted }}>Fillers: <strong style={{ color: countFillers(transcript) > 5 ? "#f59e0b" : T.accent3 }}>{countFillers(transcript)}</strong></span>
                  <span style={{ fontSize: 11, color: T.muted }}>Tech terms: <strong style={{ color: T.accent }}>{countTechWords(transcript + " " + interimTranscript)}</strong></span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={nextQuestion} style={{ flex: 1, background: `linear-gradient(135deg, ${T.accent}, #7c3aed)`, color: "#fff", border: "none", borderRadius: 10, padding: "13px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${T.accent}44` }}>
                {qIndex < questions.length - 1 ? "Next Question →" : "Finish Session ✓"}
              </button>
              <button onClick={() => { setTranscript(""); setInterimTranscript(""); }} style={{ background: T.cardBg, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 10, padding: "13px 16px", fontSize: 13, cursor: "pointer" }}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE: REPORT
  // ══════════════════════════════════════════════════════════════════════════

  // Derived coaching insights
  const totalDuration = answers.reduce((s, a) => s + a.durationSec, 0);
  const avgWords = answers.length ? answers.reduce((s, a) => s + a.wordCount, 0) / answers.length : 0;
  const totalFillers = answers.reduce((s, a) => s + a.fillerCount, 0);
  const avgWPM = totalDuration > 0 ? (answers.reduce((s, a) => s + a.wordCount, 0) / totalDuration) * 60 : 0;

  const grade = scores.overall >= 80 ? { g: "A", label: "Excellent", color: "#22c55e" }
    : scores.overall >= 65 ? { g: "B", label: "Good", color: T.accent }
      : scores.overall >= 50 ? { g: "C", label: "Average", color: "#f59e0b" }
        : { g: "D", label: "Needs Work", color: "#ef4444" };

  const coachingTips: Record<string, string> = {
    clarity: scores.clarity >= 70
      ? "✅ Great answer length — you stayed focused and concise."
      : scores.clarity < 40
        ? "⚠️ Answers were too short. Aim for 100–150 words per answer using the STAR method."
        : "💡 Try structuring each answer with: Situation → Task → Action → Result.",
    confidence: scores.confidence >= 70
      ? "✅ Low filler word usage — you came across as confident and composed."
      : totalFillers > 15
        ? `⚠️ High filler words (${totalFillers} total). Practice pausing silently instead of saying "um" or "like".`
        : "💡 Replace filler words with deliberate pauses — it sounds more authoritative.",
    depth: scores.depth >= 70
      ? "✅ Great use of technical terminology — shows domain expertise."
      : "⚠️ Use more technical terms specific to your stack. Mention tools, libraries, and metrics.",
    fluency: avgWPM > 150
      ? "⚠️ You spoke quickly — slow down slightly for clarity and emphasis."
      : avgWPM < 80 && avgWPM > 0
        ? "⚠️ Speaking pace was slow. Aim for 120–140 WPM to sound natural."
        : "✅ Good speaking pace — natural and easy to follow.",
  };

  const strengths = Object.entries(coachingTips).filter(([, v]) => v.startsWith("✅")).map(([k]) => k);
  const improvements = Object.entries(coachingTips).filter(([, v]) => v.startsWith("⚠️")).map(([k]) => k);

  function answerRating(a: AnswerRecord): { emoji: string; label: string; color: string } {
    const score = Math.min(100, (a.wordCount / 120) * 40 + (1 - Math.min(a.fillerCount / Math.max(a.wordCount, 1) * 10, 1)) * 30 + Math.min(a.techKeywords / 5, 1) * 30);
    if (score >= 70) return { emoji: "🌟", label: "Strong", color: "#22c55e" };
    if (score >= 45) return { emoji: "👍", label: "Good", color: T.accent };
    if (a.wordCount < 20) return { emoji: "📝", label: "Too short", color: "#f59e0b" };
    return { emoji: "💬", label: "Needs work", color: "#ef4444" };
  }

  return (
    <div style={{ padding: "8px 0" }}>
      {/* ── Hero Result Banner ── */}
      <div style={{ background: `linear-gradient(135deg, ${grade.color}22, ${T.accent}22)`, border: `1px solid ${grade.color}40`, borderRadius: 20, padding: "28px 32px", marginBottom: 24, display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: `linear-gradient(135deg, ${grade.color}, ${grade.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900, color: "#fff", flexShrink: 0, boxShadow: `0 8px 24px ${grade.color}50` }}>
          {grade.g}
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: T.text }}>{grade.label} Performance</div>
          <div style={{ fontSize: 14, color: T.muted, marginTop: 4 }}>
            Overall score: <strong style={{ color: grade.color }}>{scores.overall}/100</strong> · {answers.length} question{answers.length !== 1 ? "s" : ""} · {Math.round(totalDuration / 60)}m {Math.round(totalDuration % 60)}s · ~{Math.round(avgWPM)} WPM
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {strengths.map(s => <span key={s} style={{ background: "#22c55e20", color: "#22c55e", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>✅ Strong: {s}</span>)}
            {improvements.map(s => <span key={s} style={{ background: "#f59e0b20", color: "#f59e0b", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>📌 Improve: {s}</span>)}
          </div>
        </div>
      </div>

      {/* ── Score Cards with coaching ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { key: "overall", label: "Overall", color: T.accent },
          { key: "clarity", label: "Clarity", color: "#22c55e" },
          { key: "confidence", label: "Confidence", color: "#f59e0b" },
          { key: "depth", label: "Depth", color: "#6366f1" },
          { key: "fluency", label: "Fluency", color: "#ec4899" },
        ].map(({ key, label, color }) => (
          <div key={key} style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: "18px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <ScoreArc score={scores[key as keyof SoftSkillScores]} label={label} color={color} />
            {key !== "overall" && (
              <div style={{ fontSize: 10, color: T.muted, textAlign: "center", lineHeight: 1.4, paddingTop: 4, borderTop: `1px solid ${T.border}`, width: "100%" }}>
                {coachingTips[key]?.split(" ").slice(1, 6).join(" ")}…
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* ── Coaching Insights ── */}
        <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: "22px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16 }}>🎯 AI Coaching Feedback</div>
          {Object.entries(coachingTips).map(([key, tip]) => (
            <div key={key} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${T.border}20` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{key}</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{tip}</div>
            </div>
          ))}
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>📋 Action Plan</div>
            {improvements.length === 0
              ? <div style={{ fontSize: 13, color: "#22c55e" }}>🎉 Excellent session! Keep practising to maintain consistency.</div>
              : improvements.map(area => (
                <div key={area} style={{ fontSize: 12, color: T.muted, marginBottom: 6, display: "flex", gap: 8 }}>
                  <span style={{ color: T.accent }}>→</span>
                  <span>Record yourself and review for <strong style={{ color: T.text }}>{area}</strong> next session</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* ── Stats snapshot ── */}
        <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: "22px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16 }}>📊 Session Statistics</div>
          {[
            { label: "Total Questions", value: answers.length, color: T.accent },
            { label: "Avg Answer Length", value: `${Math.round(avgWords)} words`, color: "#22c55e" },
            { label: "Total Filler Words", value: totalFillers, color: totalFillers > 15 ? "#ef4444" : "#f59e0b" },
            { label: "Speaking Pace", value: `${Math.round(avgWPM)} WPM`, color: avgWPM >= 110 && avgWPM <= 160 ? "#22c55e" : "#f59e0b" },
            { label: "Total Tech Terms Used", value: answers.reduce((s, a) => s + a.techKeywords, 0), color: "#6366f1" },
            { label: "Total Words Spoken", value: answers.reduce((s, a) => s + a.wordCount, 0), color: T.accent3 },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${T.border}20` }}>
              <span style={{ fontSize: 13, color: T.muted }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Per-Answer Review ── */}
      <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: "22px 24px", marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16 }}>📋 Answer-by-Answer Review</div>
        {answers.length === 0 && (
          <div style={{ color: T.muted, fontSize: 13, padding: "20px 0", textAlign: "center" }}>
            No answers were recorded. Make sure your microphone is enabled and you speak during the session.
          </div>
        )}
        {answers.map((a, i) => {
          const rating = answerRating(a);
          return (
            <div key={i} style={{ borderBottom: i < answers.length - 1 ? `1px solid ${T.border}` : "none", paddingBottom: 18, marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{rating.emoji}</span>
                  <span style={{ background: CAT_COLORS[a.question.category] + "20", color: CAT_COLORS[a.question.category], borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                    {CAT_LABELS[a.question.category]}
                  </span>
                  <span style={{ background: rating.color + "20", color: rating.color, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                    {rating.label}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: T.muted }}>
                  {Math.round(a.durationSec)}s · {a.wordCount}w · {a.fillerCount} fillers · {a.techKeywords} tech
                </span>
              </div>
              <div style={{ fontSize: 13, color: T.muted, marginBottom: 8, fontStyle: "italic", lineHeight: 1.5 }}>Q: {a.question.text}</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7, background: `${T.border}30`, borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
                {a.transcript || <span style={{ color: T.muted, fontStyle: "italic" }}>No transcript — mic may not have been active</span>}
              </div>
              {a.transcript && (
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: T.muted }}>
                    Length: <strong style={{ color: a.wordCount >= 80 ? "#22c55e" : a.wordCount >= 40 ? T.accent : "#f59e0b" }}>
                      {a.wordCount < 40 ? "Too short" : a.wordCount > 200 ? "Too long" : "Good"}
                    </strong>
                  </span>
                  <span style={{ fontSize: 11, color: T.muted }}>
                    Fillers: <strong style={{ color: a.fillerCount > 5 ? "#ef4444" : a.fillerCount > 2 ? "#f59e0b" : "#22c55e" }}>{a.fillerCount}</strong>
                  </span>
                  <span style={{ fontSize: 11, color: T.muted }}>
                    Tech depth: <strong style={{ color: a.techKeywords >= 3 ? "#22c55e" : T.muted }}>{a.techKeywords >= 3 ? "Strong" : a.techKeywords >= 1 ? "Moderate" : "Low"}</strong>
                  </span>
                  <span style={{ fontSize: 11, color: T.muted }}>
                    Hint: <em style={{ color: T.accent3 }}>{a.question.hint.slice(0, 60)}…</em>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Actions ── */}
      <div style={{ display: "flex", gap: 14 }}>
        <button
          onClick={() => { setPhase("lobby"); setAnswers([]); setQuestions([]); setQIndex(0); setTranscript(""); setInterimTranscript(""); }}
          style={{ flex: 1, padding: "14px 0", background: `linear-gradient(135deg, ${T.accent}, #7c3aed)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${T.accent}40` }}
        >
          🔄 Start New Session
        </button>
        <button onClick={stopCamera} style={{ padding: "14px 24px", background: T.cardBg, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Stop Camera
        </button>
      </div>
    </div>
  );
}

