import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { THEMES } from "./constants/theme";
import { AuthScreen } from "./components/AuthScreen";
import { UploadScreen } from "./components/UploadScreen";
import { Dashboard } from "./components/Dashboard";
import { getStoredToken, getMe, clearToken } from "./utils";

// ─── Sidebar nav items ───────────────────────────────────────────────────────
const NAV = [
    { section: "MAIN" },
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "skills", icon: "🔬", label: "Skill Analysis" },
    { id: "salary", icon: "💰", label: "Salary" },
    { id: "forecast", icon: "📈", label: "Market Forecast" },
    { id: "interview", icon: "🎤", label: "Mock Interview" },
    { section: "SKILL PATH" },
    { id: "roadmap", icon: "🗺️", label: "Roadmap" },
    { id: "courses", icon: "🎓", label: "Courses" },
    { section: "INSIGHTS" },
    { id: "pulse", icon: "🌐", label: "Industry Pulse" },
    { id: "report", icon: "📋", label: "Full Report" },
    { section: "SETTINGS" },
    { id: "upload", icon: "📄", label: "Upload Resume" },
];

const SIDEBAR_W = 240;

export default function App() {
    const [isDark, setIsDark] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [result, setResult] = useState<any>(null);
    const [fileName, setFileName] = useState("");
    const [resumeText, setResumeText] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [sidebarHover, setSidebarHover] = useState<string | null>(null);
    const [sessionLoading, setSessionLoading] = useState(true);
    const T = isDark ? THEMES.dark : THEMES.light;

    // ── Restore session from localStorage on mount ────────────────────────
    useEffect(() => {
        const token = getStoredToken();
        if (!token) { setSessionLoading(false); return; }
        getMe(token)
            .then(u => { setUser(u); setActiveTab("overview"); })
            .catch(() => clearToken())
            .finally(() => setSessionLoading(false));
    }, []);

    if (sessionLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: THEMES.light.bg }}>
                <div style={{ fontSize: 14, color: THEMES.light.muted }}>⏳ Restoring session...</div>
            </div>
        );
    }

    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Inter','SF Pro Display',-apple-system,sans-serif;}
    textarea:focus,input:focus,select:focus{border-color:${T.accent}!important;outline:none;}
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px;}
    canvas{display:block;}
    @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
    @keyframes slideInLeft{from{opacity:0;transform:translateX(-12px);}to{opacity:1;transform:translateX(0);}}
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
    @keyframes shine{to{background-position:200% center;}}
    a{text-decoration:none;}
    
    /* Cyberpunk / SaaS Classes */
    .laser-grid {
        background-color: ${T.bg};
        background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 40px 40px;
    }
    .glass-card {
        background: ${T.cardBg}CC;
        backdrop-filter: blur(16px);
        border: 1px solid ${T.border};
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .neon-text {
        color: transparent;
        background: linear-gradient(135deg, ${T.accent} 0%, ${T.accent2} 100%);
        -webkit-background-clip: text;
        background-clip: text;
    }
    .holographic-text {
        color: transparent;
        background: linear-gradient(to right, ${T.accent3}, ${T.accent}, ${T.accent3});
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        animation: shine 4s linear infinite;
    }
    .glow-button {
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .glow-button:hover {
        box-shadow: 0 0 20px ${T.accent}66, 0 0 40px ${T.accent2}33;
        transform: translateY(-2px);
    }
  `;

    // ── Auth screen (full page, no sidebar) ───────────────────────────────
    if (!user) {
        return (
            <>
                <style>{css}</style>
                <AuthScreen T={T} isDark={isDark} toggleTheme={() => setIsDark(d => !d)} onLogin={(u: any) => { setUser(u); setActiveTab("overview"); }} />
            </>
        );
    }

    // ── Compute active page title ──────────────────────────────────────────
    const activePage = result
        ? (activeTab === "upload" ? "Upload Resume" : NAV.find((n: any) => n.id === activeTab)?.label || "Overview")
        : "Upload Your Resume";

    const handleNav = (id: string) => {
        if (id === "upload") { setResult(null); setFileName(""); setResumeText(""); }
        else setActiveTab(id); // Allow navigating to any tab anytime
    };

    return (
        <>
            <style>{css}</style>
            <div style={{ display: "flex", minHeight: "100vh", position: "relative" }} className={isDark ? "laser-grid" : ""}>

                {/* ─── Fixed Sidebar ─────────────────────────────────────── */}
                <aside style={{
                    width: SIDEBAR_W, background: T.sidebarBg, position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 200,
                    borderRight: `1px solid ${T.sidebarBorder}`, display: "flex", flexDirection: "column", padding: "26px 18px",
                }}>
                    {/* Logo */}
                    <div style={{ padding: "0 0 16px", borderBottom: `1px solid ${T.sidebarBorder}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: `0 4px 14px ${T.accent}55`, flexShrink: 0 }}>⚡</div>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>Gap2Growth</div>
                                <div style={{ fontSize: 10, color: T.sidebarText, fontWeight: 500 }}>AI Career Platform</div>
                            </div>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav style={{ flex: 1, padding: "12px 10px" }}>
                        {NAV.map((item: any, i) => {
                            if (item.section) return (
                                <div key={i} style={{ fontSize: 10, fontWeight: 700, color: T.sidebarMuted, padding: "14px 10px 6px", letterSpacing: "0.08em" }}>
                                    {item.section}
                                </div>
                            );
                            const isActive = result ? activeTab === item.id : item.id === "upload";
                            const isHovered = sidebarHover === item.id;

                            // Remove isDisabled logic — let all tabs be navigable to see empty states
                            // and access Mock Interview without a resume.

                            return (
                                <div key={item.id}
                                    onClick={() => handleNav(item.id)}
                                    onMouseEnter={() => setSidebarHover(item.id)}
                                    onMouseLeave={() => setSidebarHover(null)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10,
                                        padding: "9px 12px", borderRadius: 9, marginBottom: 2,
                                        cursor: "pointer",
                                        background: isActive ? T.sidebarActive : isHovered ? T.sidebarHover : "transparent",
                                        transition: "all 0.15s ease",
                                        opacity: 1, // Full opacity for all items
                                        borderLeft: isActive ? `3px solid ${T.sidebarAccent}` : "3px solid transparent",
                                    }}>
                                    <span style={{ fontSize: 15, filter: isActive ? `drop-shadow(0 0 4px ${T.accent}88)` : "none" }}>{item.icon}</span>
                                    <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400, color: isActive ? T.sidebarActiveText : T.sidebarText }}>
                                        {item.label}
                                    </span>
                                    {isActive && <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: `linear-gradient(135deg,${T.sidebarAccent},${T.accent2})`, boxShadow: `0 0 6px ${T.sidebarAccent}` }} />}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Bottom: Theme + User */}
                    <div style={{ borderTop: `1px solid ${T.sidebarBorder}`, padding: "14px 16px" }}>
                        {/* Theme toggle */}
                        <button
                            onClick={() => setIsDark(d => !d)}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, background: T.sidebarHover, border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", marginBottom: 12 }}>
                            <span style={{ fontSize: 14 }}>{isDark ? "☀️" : "🌙"}</span>
                            <span style={{ fontSize: 12, color: T.sidebarText, fontWeight: 500 }}>{isDark ? "Light Mode" : "Dark Mode"}</span>
                        </button>
                        {/* User row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                                {user.name[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1, overflow: "hidden" }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                                <div style={{ fontSize: 10, color: T.sidebarMuted }}>● Active</div>
                            </div>
                            <button
                                onClick={() => { clearToken(); setUser(null); setResult(null); setFileName(""); }}
                                title="Logout"
                                style={{ background: "none", border: `1px solid ${T.sidebarBorder}`, color: T.sidebarMuted, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11 }}>
                                ↩
                            </button>
                        </div>
                    </div>
                </aside>

                {/* ─── Main Content Area ─────────────────────────────────── */}
                <main style={{ marginLeft: SIDEBAR_W, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                    {/* Top Header Bar */}
                    <header style={{
                        background: T.navBg, // Fix: Use theme aware background instead of hardcoded white
                        borderBottom: `1px solid ${T.border}`,
                        borderTop: `3px solid transparent`,
                        backgroundImage: `linear-gradient(${T.navBg},${T.navBg}), linear-gradient(90deg,${T.accent},${T.accent2},${T.accent3})`,
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                        padding: "0 28px", height: 62, display: "flex", alignItems: "center",
                        gap: 14, position: "sticky", top: 0, zIndex: 100,
                        boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                    }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{activePage}</div>
                            {result && <div style={{ fontSize: 11, color: T.muted }}>👤 {user.name} · 🎯 {result.jobRole} · 📄 {fileName || "Resume"}</div>}
                        </div>
                        {result && (
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <div style={{ background: `linear-gradient(135deg,${T.accent2},${T.accent})`, borderRadius: 20, padding: "5px 14px", fontSize: 11, color: "#fff", fontWeight: 700, boxShadow: `0 2px 8px ${T.accent}40` }}>
                                    ⚡ DNA {result.dnaScore}/100
                                </div>
                                <div style={{ background: `linear-gradient(135deg,${T.accent3},#0d9488)`, borderRadius: 20, padding: "5px 14px", fontSize: 11, color: "#fff", fontWeight: 700, boxShadow: `0 2px 8px ${T.accent3}40` }}>
                                    ✅ {result.skillScore}% Match
                                </div>
                                <button
                                    onClick={() => { setResult(null); setFileName(""); setActiveTab("overview"); }}
                                    style={{ background: "none", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
                                    ↩ Re-upload
                                </button>
                            </div>
                        )}
                    </header>

                    {/* Main Content Area (Animated) */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // Spring-like ease out
                        key={activeTab} // Animate on tab swap
                        style={{ flex: 1, padding: 32, maxWidth: 1200, margin: "0 auto", width: "100%" }}
                    >
                        {!result
                            ? <UploadScreen T={T} onAnalyze={(r: any, fn: string, rt: string) => { setResult(r); setFileName(fn); setResumeText(rt || ""); setActiveTab("overview"); }} />
                            : <Dashboard T={T} result={result} user={user} fileName={fileName} resumeText={resumeText} activeTab={activeTab} onReset={() => { setResult(null); setFileName(""); setResumeText(""); }} />
                        }
                        {activeTab === "roadmap" && <div style={{ color: T.text, fontSize: 15 }}>Feature coming soon...</div>}
                        {activeTab === "courses" && <div style={{ color: T.text, fontSize: 15 }}>Feature coming soon...</div>}
                        {activeTab === "pulse" && <div style={{ color: T.text, fontSize: 15 }}>Feature coming soon...</div>}
                        {activeTab === "report" && <div style={{ color: T.text, fontSize: 15 }}>Feature coming soon...</div>}

                    </motion.div>
                </main>
            </div>
        </>
    );
}
