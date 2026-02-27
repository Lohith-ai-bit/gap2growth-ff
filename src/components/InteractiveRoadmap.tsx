import React, { useState, useCallback } from "react";
import { ROLE_ROADMAPS, PLATFORM_COLORS } from "../constants/roadmaps";

// ─── Constants ──────────────────────────────────────────────────────────────
const PLATFORM_ICONS: Record<string, string> = {
    "freeCodeCamp": "🏕️",
    "The Odin Project": "⚔️",
    "Microsoft Learn": "🪟",
    "edX": "🎓",
    "Coursera": "📘",
    "AWS Skill Builder": "☁️",
    "Udemy": "🎥",
    "YouTube": "▶️",
    "Docs": "📄",
    "Other": "🔗",
};

function useProgress(storageKey: string) {
    const [done, setDone] = useState<Set<string>>(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
        } catch { return new Set<string>(); }
    });

    const toggle = useCallback((id: string) => {
        setDone(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch { }
            return next;
        });
    }, [storageKey]);

    const reset = useCallback(() => {
        try { localStorage.removeItem(storageKey); } catch { }
        setDone(new Set());
    }, [storageKey]);

    return { done, toggle, reset };
}

// ─── Skill Card ──────────────────────────────────────────────────────────────
function SkillCard({ skill, levelColor, levelGradient, skillId, isCompleted, onToggle, isMatched, isMissing }: any) {
    const [expanded, setExpanded] = useState(false);
    const statusColor = isCompleted ? "#10b981" : isMatched ? "#3b82f6" : isMissing ? "#ef4444" : "#64748b";

    return (
        <div style={{
            background: isCompleted ? "#10b98110" : isMissing ? "#ef444410" : isMatched ? "#3b82f610" : "#1a254010",
            border: `1px solid ${statusColor}33`,
            borderRadius: 10,
            transition: "all .2s",
            overflow: "hidden",
        }}>
            {/* Header row */}
            <div
                style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 13px", cursor: "pointer" }}
                onClick={() => setExpanded(e => !e)}
            >
                {/* Checkbox */}
                <button
                    onClick={e => { e.stopPropagation(); onToggle(skillId); }}
                    title={isCompleted ? "Mark incomplete" : "Mark complete"}
                    style={{
                        flexShrink: 0, marginTop: 2, width: 20, height: 20, borderRadius: 6,
                        border: isCompleted ? "none" : `2px solid ${statusColor}66`,
                        background: isCompleted ? levelGradient : "transparent",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, color: "#fff", transition: "all .15s",
                    }}
                >{isCompleted ? "✓" : ""}</button>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: isCompleted ? "#10b981" : "#e2e8f0", textDecoration: isCompleted ? "line-through" : "none" }}>
                            {skill.name}
                        </span>
                        {isCompleted && <span style={{ fontSize: 9, fontWeight: 700, background: "#10b98122", color: "#10b981", border: "1px solid #10b98144", borderRadius: 20, padding: "1px 7px" }}>DONE ✓</span>}
                        {!isCompleted && isMissing && <span style={{ fontSize: 9, fontWeight: 700, background: "#ef444422", color: "#ef4444", border: "1px solid #ef444444", borderRadius: 20, padding: "1px 7px" }}>GAP</span>}
                        {!isCompleted && isMatched && <span style={{ fontSize: 9, fontWeight: 700, background: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f644", borderRadius: 20, padding: "1px 7px" }}>HAVE IT</span>}
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "#64748b", flexShrink: 0 }}>{expanded ? "▲" : "▼"}</span>
                    </div>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "3px 0 0", lineHeight: 1.5 }}>{skill.description}</p>
                </div>
            </div>

            {/* Expanded resources */}
            {expanded && (
                <div style={{ padding: "0 13px 13px", borderTop: "1px solid #1a254044", marginTop: 0, paddingTop: 10, display: "flex", flexDirection: "column", gap: 6, animation: "fadeIn .15s ease" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 6px" }}>📚 Learning Resources</p>
                    {skill.resources.map((r: any) => (
                        <a
                            key={r.url}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                                background: "#0d1421",
                                border: `1px solid ${PLATFORM_COLORS[r.platform] || "#1a2540"}44`,
                                borderLeft: `3px solid ${PLATFORM_COLORS[r.platform] || levelColor}`,
                                borderRadius: 7, textDecoration: "none",
                                transition: "transform .15s, box-shadow .15s",
                                color: "inherit",
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateX(3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 12px ${PLATFORM_COLORS[r.platform] || levelColor}33`; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
                        >
                            <span style={{ fontSize: 14 }}>{PLATFORM_ICONS[r.platform] || "🔗"}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{r.label}</div>
                                <div style={{ fontSize: 10, color: PLATFORM_COLORS[r.platform] || "#64748b", fontWeight: 600 }}>{r.platform}</div>
                            </div>
                            <span style={{ fontSize: 11, color: "#64748b" }}>↗</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function InteractiveRoadmap({ jobRole, found = [], missing = [], T }: any) {
    const rm = ROLE_ROADMAPS[jobRole] || ROLE_ROADMAPS["ML Engineer"];
    const storageKey = `g2g_roadmap_${jobRole.replace(/\s+/g, "_")}`;
    const { done, toggle, reset } = useProgress(storageKey);

    // Compute total skills
    const allSkillIds: string[] = [];
    rm.levels.forEach(lvl => lvl.topics.forEach(t => t.skills.forEach(s => allSkillIds.push(`${lvl.level}::${t.area}::${s.name}`))));
    const totalSkills = allSkillIds.length;
    const completedCount = allSkillIds.filter(id => done.has(id)).length;
    const pct = Math.round((completedCount / totalSkills) * 100);

    const [activeLevel, setActiveLevel] = useState<string | null>(null);
    const visibleLevels = activeLevel ? rm.levels.filter(l => l.level === activeLevel) : rm.levels;

    return (
        <div>
            {/* ── Header ── */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: T.text }}>🗺 {rm.role} Roadmap</span>
                    <span style={{ background: T.accent + "22", color: T.accent, border: `1px solid ${T.accent}44`, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>
                        {rm.totalWeeks} weeks
                    </span>
                    <a href={rm.sourceUrl} target="_blank" rel="noopener noreferrer"
                        style={{ marginLeft: "auto", fontSize: 11, color: T.muted, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 20, padding: "4px 12px" }}>
                        🔗 roadmap.sh
                    </a>
                </div>
                <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>{rm.description}</p>
            </div>

            {/* ── Overall Progress Bar ── */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: T.text }}>Your Progress</span>
                        <span style={{ fontSize: 12, color: T.muted, marginLeft: 10 }}>{completedCount} / {totalSkills} skills completed</span>
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 800, background: `linear-gradient(135deg,${T.accent2},${T.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{pct}%</span>
                </div>
                <div style={{ height: 10, background: T.inputBg, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${T.accent2},${T.accent})`, borderRadius: 99, transition: "width .5s ease" }} />
                </div>
                {/* per-level mini bars */}
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {rm.levels.map(lvl => {
                        const lvlIds = lvl.topics.flatMap(t => t.skills.map(s => `${lvl.level}::${t.area}::${s.name}`));
                        const lvlDone = lvlIds.filter(id => done.has(id)).length;
                        const lvlPct = Math.round((lvlDone / lvlIds.length) * 100);
                        return (
                            <button key={lvl.level}
                                onClick={() => setActiveLevel(p => p === lvl.level ? null : lvl.level)}
                                style={{ flex: 1, minWidth: 110, background: activeLevel === lvl.level ? lvl.color + "22" : T.cardBg, border: `1px solid ${activeLevel === lvl.level ? lvl.color : T.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", textAlign: "left", transition: "all .2s" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: lvl.color }}>{lvl.icon} {lvl.level}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: lvl.color }}>{lvlPct}%</span>
                                </div>
                                <div style={{ height: 5, background: T.inputBg, borderRadius: 99 }}>
                                    <div style={{ height: "100%", width: `${lvlPct}%`, background: lvl.gradient, borderRadius: 99, transition: "width .4s" }} />
                                </div>
                                <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>{lvlDone}/{lvlIds.length} skills</div>
                            </button>
                        );
                    })}
                </div>
                {completedCount > 0 && (
                    <button onClick={reset}
                        style={{ marginTop: 12, background: "none", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontSize: 11 }}>
                        🔄 Reset Progress
                    </button>
                )}
            </div>

            {/* ── Level columns ── */}
            {visibleLevels.map(lvl => {
                const lvlIds = lvl.topics.flatMap(t => t.skills.map(s => `${lvl.level}::${t.area}::${s.name}`));
                const lvlDone = lvlIds.filter(id => done.has(id)).length;
                return (
                    <div key={lvl.level} style={{ marginBottom: 32 }}>
                        {/* Level header */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                            <span style={{ fontSize: 20 }}>{lvl.icon}</span>
                            <span style={{ fontSize: 16, fontWeight: 800, color: lvl.color }}>{lvl.level}</span>
                            <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${lvl.color}44,transparent)` }} />
                            <span style={{ fontSize: 11, color: T.muted }}>{lvlDone}/{lvlIds.length}</span>
                            <span style={{ background: lvl.gradient, color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>{lvl.durationHint}</span>
                        </div>

                        {/* Topic area grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 16 }}>
                            {lvl.topics.map(topic => {
                                const topicIds = topic.skills.map(s => `${lvl.level}::${topic.area}::${s.name}`);
                                const topicDone = topicIds.filter(id => done.has(id)).length;
                                return (
                                    <div key={topic.area} style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderLeft: `4px solid ${lvl.color}`, borderRadius: 12, overflow: "hidden" }}>
                                        {/* Topic header */}
                                        <div style={{ background: lvl.color + "12", padding: "11px 14px", borderBottom: `1px solid ${T.border}` }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ fontSize: 17 }}>{topic.icon}</span>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: T.text, flex: 1 }}>{topic.area}</span>
                                                <span style={{ fontSize: 11, color: lvl.color, fontWeight: 700 }}>{topicDone}/{topic.skills.length}</span>
                                            </div>
                                            {/* mini progress */}
                                            <div style={{ marginTop: 7, height: 4, background: T.inputBg, borderRadius: 99 }}>
                                                <div style={{ height: "100%", width: `${Math.round((topicDone / topic.skills.length) * 100)}%`, background: lvl.gradient, borderRadius: 99, transition: "width .4s" }} />
                                            </div>
                                        </div>
                                        {/* Skill cards */}
                                        <div style={{ padding: "12px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                                            {topic.skills.map(skill => {
                                                const skillId = `${lvl.level}::${topic.area}::${skill.name}`;
                                                return (
                                                    <SkillCard
                                                        key={skillId}
                                                        skill={skill}
                                                        skillId={skillId}
                                                        levelColor={lvl.color}
                                                        levelGradient={lvl.gradient}
                                                        isCompleted={done.has(skillId)}
                                                        onToggle={toggle}
                                                        isMatched={found.includes(skill.name)}
                                                        isMissing={missing.includes(skill.name)}
                                                        T={T}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* ── Legend ── */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", padding: "12px 16px", background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Legend:</span>
                {[["✓", "#10b981", "Completed by you"], ["HAVE IT", "#3b82f6", "Detected in resume"], ["GAP", "#ef4444", "Missing skill"], ["⬜", "#64748b", "Not yet started"]].map(([badge, c, label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, background: c + "22", color: c as string, border: `1px solid ${c}44`, borderRadius: 20, padding: "1px 7px" }}>{badge}</span>
                        <span style={{ fontSize: 11, color: T.muted }}>{label}</span>
                    </div>
                ))}
                <span style={{ marginLeft: "auto", fontSize: 11, color: T.muted }}>Click a skill to see resources · Click checkbox to mark done</span>
            </div>
        </div>
    );
}
