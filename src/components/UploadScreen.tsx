import React, { useState, useEffect } from "react";
import { Txt, Row, Grid, Card, Badge, Progress, Select } from "./ui/Primitives";
import { PDFUpload } from "./PDFUpload";
import { JOBS } from "../constants/data";
import { INR, analyzeResumeAI, checkAIBackend } from "../utils";

const AI_STEPS = [
    { label: "Parsing PDF text...", icon: "📄" },
    { label: "Extracting skills with NLP...", icon: "🔍" },
    { label: "Running ML classifier...", icon: "🤖" },
    { label: "Scoring job role match...", icon: "🎯" },
    { label: "Predicting salary (₹ INR)...", icon: "💰" },
    { label: "Computing peer percentile...", icon: "📊" },
    { label: "Generating career insights...", icon: "✨" },
];

export function UploadScreen({ onAnalyze, T }: any) {
    const [resumeText, setResumeText] = useState("");
    const [jobRole, setJobRole] = useState("ML Engineer");
    const [jobDesc, setJobDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [fileName, setFileName] = useState("");
    const [aiOnline, setAiOnline] = useState<boolean | null>(null);
    const [usedAI, setUsedAI] = useState(false);

    // Check backend health on mount
    useEffect(() => {
        checkAIBackend().then(setAiOnline);
    }, []);

    const analyze = async () => {
        if (!resumeText.trim()) return;
        setLoading(true); setStep(0); setUsedAI(false);

        // Animate steps while waiting for AI
        const interval = setInterval(() => {
            setStep(s => Math.min(s + 1, AI_STEPS.length - 1));
        }, 600);

        let usedAIModel = true;
        const result = await analyzeResumeAI(
            resumeText, jobRole, jobDesc,
            () => { usedAIModel = false; }, // onFallback
            fileName
        );

        clearInterval(interval);
        setStep(AI_STEPS.length - 1);
        setUsedAI(usedAIModel);

        await new Promise(r => setTimeout(r, 400));
        setLoading(false);
        onAnalyze(result, fileName, resumeText);
    };

    return (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 36 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg,${T.accent}18,${T.accent2}18)`, border: `1px solid ${T.accent}30`, borderRadius: 99, padding: "5px 16px", fontSize: 12, color: T.accent, fontWeight: 700, marginBottom: 16 }}>
                    ⚡ AI-Powered Analysis Engine
                    {aiOnline !== null && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 6, paddingLeft: 8, borderLeft: `1px solid ${T.accent}30`, fontSize: 11, color: aiOnline ? T.accent3 : T.warn }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: aiOnline ? T.accent3 : T.warn, display: "inline-block" }} />
                            {aiOnline ? "ML Model Online" : "Rule-based Mode"}
                        </span>
                    )}
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, background: `linear-gradient(135deg,${T.accent},${T.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Gap2Growth Analysis</div>
                <Txt sz={14} c={T.muted}>Upload your resume PDF and let AI map your career trajectory</Txt>
            </div>

            <Grid cols="1fr 1fr" gap={20} style={{ marginBottom: 16 }}>
                {/* Resume Upload */}
                <Card T={T}>
                    <div style={{ background: `linear-gradient(135deg,${T.accent}15,${T.accent2}10)`, borderRadius: 8, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>📄</span>
                        <div><Txt sz={15} w={700} c={T.text}>Resume Upload</Txt><Txt sz={11} c={T.muted}>Text extracted locally via PDF.js</Txt></div>
                        <div style={{ marginLeft: "auto" }}><Badge color={T.accent}>PDF · Max 5 MB</Badge></div>
                    </div>
                    <PDFUpload T={T} onFileReady={(text: string, f: any) => { setResumeText(text); setFileName(f?.name || ""); }} />
                </Card>

                {/* Target Role */}
                <Card T={T}>
                    <div style={{ background: `linear-gradient(135deg,${T.accent2}15,${T.accent}10)`, borderRadius: 8, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>🎯</span>
                        <div><Txt sz={15} w={700} c={T.text}>Target Role</Txt><Txt sz={11} c={T.muted}>Select role and paste JD for better matching</Txt></div>
                    </div>
                    <Txt sz={12} c={T.muted} mb={6}>Job Role</Txt>
                    <Select T={T} options={Object.keys(JOBS)} value={jobRole} onChange={setJobRole} />
                    <Txt sz={12} c={T.muted} mb={6} style={{ marginTop: 14 }}>Job Description (optional — improves accuracy)</Txt>
                    <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={4} placeholder="Paste JD here… AI uses this for cosine similarity matching"
                        style={{ width: "100%", background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, padding: 12, borderRadius: 8, fontSize: 13, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
                    <div style={{ marginTop: 12, background: `linear-gradient(135deg,${T.accent3}12,${T.accent}08)`, border: `1px solid ${T.accent3}30`, borderRadius: 8, padding: 12 }}>
                        <Row justify="space-between"><Txt sz={12} c={T.muted}>Salary Range</Txt><Txt sz={12} c={T.accent3} w={700}>{INR(JOBS[jobRole].baseSalary)}–{INR(JOBS[jobRole].baseSalary * 1.2)}</Txt></Row>
                        <Row justify="space-between" style={{ marginTop: 6 }}><Txt sz={12} c={T.muted}>Market Growth</Txt><Badge color={T.accent3}>+{JOBS[jobRole].growth}% YoY</Badge></Row>
                    </div>
                </Card>
            </Grid>

            {/* Required skills */}
            <Card T={T} style={{ marginBottom: 20, padding: "14px 20px" }}>
                <Txt sz={12} c={T.muted} mb={8}>Required skills for <span style={{ color: T.accent, fontWeight: 600 }}>{jobRole}</span></Txt>
                <Row gap={6} wrap>{JOBS[jobRole].required.map(s => <Badge key={s} color={T.accent2}>{s}</Badge>)}</Row>
            </Card>

            {/* Loading / Analyze button */}
            {loading ? (
                <Card T={T} style={{ textAlign: "center", padding: "36px 44px" }}>
                    <div style={{ fontSize: 40, marginBottom: 12, animation: "spin 1.5s linear infinite" }}>{AI_STEPS[step]?.icon || "⚙️"}</div>
                    <Txt sz={18} w={700} c={T.text} mb={10}>{AI_STEPS[step]?.label}</Txt>
                    <Progress pct={(step / (AI_STEPS.length - 1)) * 100} color={T.accent} h={7} T={T} style={{ maxWidth: 420, margin: "0 auto 12px" }} />
                    <Txt sz={12} c={T.muted}>Step {step + 1} of {AI_STEPS.length} · {aiOnline ? "🤖 Trained ML Model" : "⚙️ Rule-based Engine"}</Txt>
                </Card>
            ) : (
                <div style={{ textAlign: "center" }}>
                    <button onClick={analyze} disabled={!resumeText.trim()} style={{ padding: "14px 52px", background: `linear-gradient(135deg,${T.accent2},${T.accent})`, color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: resumeText ? "pointer" : "not-allowed", opacity: resumeText ? 1 : 0.5, boxShadow: resumeText ? `0 6px 24px ${T.accent}50` : "none", transition: "all .2s" }}>
                        🚀 Run AI Analysis
                    </button>
                    <Txt sz={12} c={T.muted} style={{ marginTop: 10 }}>
                        {resumeText ? `✅ Resume loaded (${(resumeText.length / 1000).toFixed(1)}K chars) · ${aiOnline ? "🤖 AI model ready" : "⚙️ Fallback mode"}` : "⬆ Upload a PDF resume to begin"}
                    </Txt>
                </div>
            )}
        </div>
    );
}
