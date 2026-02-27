import React, { useState } from "react";
import { Txt, Row, Card } from "./ui/Primitives";
import { register as apiRegister, login as apiLogin, storeToken } from "../utils";

export function AuthScreen({ onLogin, T, isDark, toggleTheme }: any) {
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const inp = {
        background: T.inputBg, border: `1px solid ${T.border}`, color: T.text,
        padding: "12px 16px", borderRadius: 10, width: "100%", marginBottom: 12,
        fontSize: 14, boxSizing: "border-box" as const, outline: "none",
    };

    const handleSubmit = async () => {
        setErr("");
        if (!form.email.trim() || !form.password.trim()) {
            setErr("Email and password are required.");
            return;
        }
        if (mode === "register" && !form.name.trim()) {
            setErr("Full name is required.");
            return;
        }
        setLoading(true);
        try {
            let data;
            if (mode === "register") {
                data = await apiRegister(form.name.trim(), form.email.trim(), form.password);
            } else {
                data = await apiLogin(form.email.trim(), form.password);
            }
            storeToken(data.token);
            onLogin({ name: data.user.name, email: data.user.email, id: data.user.id });
        } catch (e: any) {
            setErr(e.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: `linear-gradient(135deg,${T.accent}12 0%,${T.bg} 50%,${T.accent2}10 100%)` }}>
            {/* Background blobs */}
            <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${T.accent}18 0%,transparent 70%)`, top: "-100px", left: "-100px", filter: "blur(50px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,${T.accent2}14 0%,transparent 70%)`, bottom: "-80px", right: "-80px", filter: "blur(50px)", pointerEvents: "none" }} />
            {/* Grid pattern */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.accent}08 1px,transparent 1px),linear-gradient(90deg,${T.accent}08 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />

            {/* Theme toggle */}
            <button onClick={toggleTheme} style={{ position: "absolute", top: 20, right: 20, background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontSize: 16, color: T.text }}>{isDark ? "☀️" : "🌙"}</button>

            {/* Card */}
            <div style={{ width: 420, position: "relative", zIndex: 1, background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 20, padding: "40px 36px", boxShadow: `0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px ${T.accent}18` }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 58, height: 58, borderRadius: 16, background: T.accent, fontSize: 26, marginBottom: 14, boxShadow: `0 6px 20px ${T.accent}45` }}>⚡</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: T.text, marginBottom: 4 }}>Gap2Growth</div>
                    <div style={{ fontSize: 13, color: T.muted }}>AI Career Intelligence Platform</div>
                </div>

                {/* Mode tabs */}
                <div style={{ display: "flex", background: T.inputBg, borderRadius: 10, overflow: "hidden", marginBottom: 24, border: `1px solid ${T.border}` }}>
                    {["login", "register"].map(m => (
                        <button key={m} onClick={() => { setMode(m); setErr(""); }} style={{ flex: 1, padding: "10px 0", background: mode === m ? T.accent : "transparent", color: mode === m ? "#fff" : T.muted, border: "none", cursor: "pointer", fontWeight: mode === m ? 700 : 400, textTransform: "capitalize", fontSize: 14, transition: "all .2s", borderRadius: mode === m ? 8 : 0 }}>{m}</button>
                    ))}
                </div>

                {mode === "register" && (
                    <input style={inp} placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                )}
                <input style={inp} placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input type="password" style={{ ...inp, marginBottom: 20 }} placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()} />

                {err && (
                    <div style={{ color: T.danger, fontSize: 13, marginBottom: 12, background: T.danger + "10", border: `1px solid ${T.danger}30`, borderRadius: 8, padding: "8px 12px" }}>
                        ⚠ {err}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ width: "100%", padding: "13px 0", background: loading ? T.muted : T.accent, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", boxShadow: `0 4px 16px ${T.accent}45`, transition: "transform .15s" }}
                    onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-1px)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "")}
                >
                    {loading ? "⏳ Please wait..." : mode === "login" ? "Sign In →" : "Create Account ✦"}
                </button>

                <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: T.muted }}>
                    {mode === "login" ? "Don't have an account? Switch to Register above." : "Already have an account? Switch to Login above."}
                </div>
            </div>
        </div>
    );
}
