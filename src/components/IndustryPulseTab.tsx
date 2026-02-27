import React, { useState } from "react";
import { Txt, Row, Grid, Card } from "./ui/Primitives";
import { IMPACT_CFG, CAT_CFG, INSIGHTS } from "../constants/data";

function ImpulseCard({ ins, T }: any) {
    const [open, setOpen] = useState(false);
    const [hov, setHov] = useState(false);
    const ic = IMPACT_CFG[ins.impact] || IMPACT_CFG["Emerging Trend"];
    const cc = CAT_CFG[ins.category] || { color: T.muted, bg: T.inputBg };
    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 22px", cursor: "pointer", transition: "all .2s", transform: hov ? "translateY(-3px)" : "translateY(0)", boxShadow: hov ? `0 10px 28px ${T.accent}18` : `0 1px 4px rgba(0,0,0,0.05)` }}
            onClick={() => setOpen(o => !o)}>
            <Row justify="space-between" style={{ marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                <Row gap={8}><span style={{ background: cc.bg, color: cc.color, borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 600 }}>{ins.category}</span><Txt sz={11} c={T.muted}>{ins.date}</Txt></Row>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: ic.bg, color: ic.color, border: `1px solid ${ic.color}33`, borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: ic.dot, display: "inline-block" }} />
                    {ins.impact}
                </span>
            </Row>
            <Txt sz={15} w={700} c={T.text} mb={8} style={{ lineHeight: 1.45 }}>{ins.headline}</Txt>
            <Txt sz={13} c={T.subtext} mb={12} style={{ lineHeight: 1.7 }}>{ins.summary}</Txt>
            <button style={{ background: "none", border: "none", padding: 0, color: T.accent, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {open ? "▲ Show less" : "▼ Engineer Impact"}
            </button>
            {open && (
                <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 14, paddingTop: 14, display: "flex", flexDirection: "column", gap: 14, animation: "fadeIn .2s ease" }}>
                    <div><Txt sz={11} w={700} c={T.muted} mb={6} style={{ textTransform: "uppercase", letterSpacing: "0.07em" }}>Why It Matters</Txt><Txt sz={13} c={T.subtext} style={{ lineHeight: 1.7 }}>{ins.why}</Txt></div>
                    <div><Txt sz={11} w={700} c={T.muted} mb={6} style={{ textTransform: "uppercase", letterSpacing: "0.07em" }}>Role Evolution</Txt><Txt sz={13} c={T.subtext} style={{ lineHeight: 1.7 }}>{ins.roleChange}</Txt></div>
                    <div style={{ height: 1, background: T.border }} />
                    <Grid cols="1fr 1fr 1fr" gap={14}>
                        {[["🧠 Skills to Learn", "#1d4ed8", "#dbeafe", ins.skills], ["🔧 Tools", "#0f766e", "#ccfbf1", ins.tools], ["📈 Roles in Demand", "#7c3aed", "#ede9fe", ins.roles]].map(([label, c, bg, items]) => (
                            <div key={label as string}>
                                <Txt sz={10} w={700} mb={8} c={c} style={{ textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</Txt>
                                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                    {(items as string[]).map(x => <span key={x} style={{ background: bg as string, color: c as string, border: `1px solid ${c}22`, borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 500 }}>{x}</span>)}
                                </div>
                            </div>
                        ))}
                    </Grid>
                </div>
            )}
        </div>
    );
}

export function IndustryPulseTab({ T }: any) {
    const [filter, setFilter] = useState("All");
    const filters = ["All", "High Impact", "Medium Shift", "Emerging Trend"];
    const filtered = filter === "All" ? INSIGHTS : INSIGHTS.filter(i => i.impact === filter);
    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                    <Row gap={12} style={{ marginBottom: 4 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${T.accent}22,${T.accent2}22)`, border: `1px solid ${T.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌐</div>
                        <div><Txt sz={20} w={800} c={T.text}>Industry Pulse</Txt><Txt sz={12} c={T.muted}>Stay Ahead of Software Evolution</Txt></div>
                    </Row>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.accent3 + "18", border: `1px solid ${T.accent3}44`, borderRadius: 99, padding: "5px 12px" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent3, animation: "pulse 2s infinite" }} />
                    <Txt sz={11} w={700} c={T.accent3}>Live · June 2025</Txt>
                </div>
            </Row>
            <Grid cols="repeat(auto-fit,minmax(140px,1fr))" gap={12} style={{ marginBottom: 20 }}>
                {[["6", "Insights This Week"], ["3", "High Impact Alerts"], ["14+", "Roles Shifting"], ["24", "Tools Tracked"]].map(([v, l]) => (
                    <Card T={T} key={l} style={{ textAlign: "center", padding: 14 }}>
                        <Txt sz={22} w={800} c={T.accent} mb={4}>{v}</Txt>
                        <Txt sz={11} c={T.muted}>{l}</Txt>
                    </Card>
                ))}
            </Grid>
            <Row gap={6} wrap style={{ marginBottom: 18 }}>
                {filters.map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s", border: filter === f ? "none" : `1px solid ${T.border}`, background: filter === f ? `linear-gradient(135deg,${T.accent2},${T.accent})` : T.cardBg, color: filter === f ? "#fff" : T.muted, boxShadow: filter === f ? `0 2px 8px ${T.accent}44` : "none" }}>{f}</button>
                ))}
                <Txt sz={12} c={T.muted} style={{ marginLeft: "auto", alignSelf: "center" }}>{filtered.length} insight{filtered.length !== 1 ? "s" : ""}</Txt>
            </Row>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filtered.map(ins => <ImpulseCard key={ins.id} ins={ins} T={T} />)}
            </div>
        </div>
    );
}
