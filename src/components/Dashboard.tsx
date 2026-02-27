import React, { useMemo } from "react";
import { Txt, Row, Grid, Card, Badge, Progress } from "./ui/Primitives";
import { BarChart, LineChart, RadarChart } from "./charts/Charts";
import { IndustryPulseTab } from "./IndustryPulseTab";
import { InteractiveRoadmap } from "./InteractiveRoadmap";
import { genRoadmap, genForecast, rand, INR } from "../utils";
import { SKILL_DB, COURSES } from "../constants/data";
import { MockInterviewTab } from "./MockInterviewTab";

export function Dashboard({ result, user, fileName, onReset, T, activeTab, resumeText }: any) {
    const { found, missing, matched, skillScore, interviewRisk, currentSalary, potentialSalary, dnaScore, peerPercentile, job, jobRole } = result;
    const topCourses = COURSES.filter(c => missing.includes(c.skill) || found.slice(0, 2).includes(c.skill)).slice(0, 6);
    const radarLabels = ["Python", "ML", "Cloud", "Web", "Data", "NLP"];

    // Memoize ALL random values — prevents fluctuation on hover/re-render
    const stable = useMemo(() => ({
        radarVals: radarLabels.map(l =>
            found.find((f: string) => f.toLowerCase().includes(l.toLowerCase().slice(0, 4)))
                ? rand(55, 90) : rand(10, 30)
        ),
        demandPcts: found.slice(0, 4).map(() => rand(18, 45)),
        skillLevels: found.slice(0, 8).map((s: string) => SKILL_DB[s] || rand(50, 80)),
        obsRisks: found.slice(0, 5).map(() => rand(5, 40)),
        gapSeverity: missing.slice(0, 6).map(() => rand(40, 90)),
        marketAlign: rand(55, 80),
        resumeQual: rand(60, 85),
        forecasts: found.slice(0, 4).map((s: string) => genForecast(s)),
        roadmap: genRoadmap(missing),
    }), [result]); // only recompute when result changes

    const radarVals = stable.radarVals;

    // ── Stat card component — full gradient background ──
    const StatCard = ({ icon, label, value, color, color2, sub }: any) => (
        <div style={{ background: `linear-gradient(135deg,${color},${color2 || color + "cc"})`, borderRadius: 16, padding: "20px 18px", position: "relative", overflow: "hidden", boxShadow: `0 6px 20px ${color}40` }}>
            {/* background pattern */}
            <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -10, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4, letterSpacing: "-0.02em" }}>{value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{label}</div>
                {sub && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>{sub}</div>}
            </div>
        </div>
    );

    return (
        <div>
            {/* ── File banner ── */}
            {fileName && (
                <div style={{ marginBottom: 20, background: T.accent3 + "12", border: `1px solid ${T.accent3}30`, borderRadius: 10, padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span>📄</span><Txt sz={12} c={T.accent3}>{fileName}</Txt><Badge color={T.accent3}>Analyzed</Badge>
                </div>
            )}

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
                <div>
                    <Row gap={10} wrap style={{ marginBottom: 22 }}>
                        <div>
                            <Txt sz={22} w={800} c={T.text} mb={4}>👋 {user.name}'s Career Report</Txt>
                            <Txt sz={13} c={T.muted}>Target Role: <strong style={{ color: T.accent }}>{jobRole}</strong> · {new Date().toLocaleDateString()}</Txt>
                        </div>
                    </Row>
                    {/* Stat cards */}
                    <Grid cols="repeat(auto-fit,minmax(160px,1fr))" gap={14} style={{ marginBottom: 22 }}>
                        <StatCard icon="⚡" label="Skill Analysis" value={`${dnaScore}/100`} color={T.accent} color2={T.accent2} sub="Career readiness" />
                        <StatCard icon="✅" label="Skill Match" value={`${skillScore}%`} color={T.accent3} color2="#0d9488" sub={`${matched.length}/${job.required.length} skills`} />
                        <StatCard icon="⚠️" label="Interview Risk" value={`${interviewRisk}%`} color={interviewRisk > 50 ? T.danger : T.warn} color2={interviewRisk > 50 ? "#b91c1c" : "#b45309"} sub={interviewRisk > 50 ? "High risk" : "Manageable"} />
                        <StatCard icon="🎯" label="Top Percentile" value={`Top ${100 - peerPercentile}%`} color="#7c3aed" color2={T.accent2} sub="vs peers" />
                        <StatCard icon="💰" label="Salary Potential" value={INR(potentialSalary)} color={T.accent3} color2={T.accent} sub="Full potential" />
                    </Grid>
                    {/* Skill insight cards */}
                    <Grid cols="1fr 1fr" gap={16} style={{ marginBottom: 16 }}>
                        <Card T={T}>
                            <Txt sz={14} w={700} c={T.text} mb={12}>✅ Matched Skills ({matched.length})</Txt>
                            <Row gap={6} wrap>{matched.length ? matched.map((s: string) => <Badge key={s} color={T.accent3}>{s}</Badge>) : <Txt c={T.muted}>None found</Txt>}</Row>
                        </Card>
                        <Card T={T}>
                            <Txt sz={14} w={700} c={T.text} mb={12}>🚨 Missing Skills ({missing.length})</Txt>
                            <Row gap={6} wrap>{missing.length ? missing.map((s: string) => <Badge key={s} color={T.danger}>{s}</Badge>) : <Badge color={T.accent3}>🎉 All matched!</Badge>}</Row>
                        </Card>
                        <Card T={T}>
                            <Txt sz={14} w={700} c={T.text} mb={12}>🔍 All Detected ({found.length})</Txt>
                            <Row gap={6} wrap>{found.map((s: string) => <Badge key={s} color={T.muted}>{s}</Badge>)}</Row>
                        </Card>
                        <Card T={T}>
                            <Txt sz={14} w={700} c={T.text} mb={14}>📊 AI Assessment</Txt>
                            {[
                                { l: "Skill Coverage", p: skillScore, c: T.accent3 },
                                { l: "Interview Readiness", p: 100 - interviewRisk, c: T.accent },
                                { l: "Market Alignment", p: stable.marketAlign, c: "#8b5cf6" },
                                { l: "Resume Quality", p: stable.resumeQual, c: T.warn },
                            ].map(r => (
                                <div key={r.l} style={{ marginBottom: 10 }}>
                                    <Row justify="space-between" style={{ marginBottom: 3 }}><Txt sz={12} c={T.muted}>{r.l}</Txt><Txt sz={12} c={r.c} w={600}>{r.p}%</Txt></Row>
                                    <Progress pct={r.p} color={r.c} h={6} T={T} />
                                </div>
                            ))}
                        </Card>
                    </Grid>
                </div>
            )}

            {/* ── SKILL DNA ── */}
            {activeTab === "skills" && (
                <div>
                    <Txt sz={20} w={800} c={T.text} mb={18}>🔬 Skill Analysis Profile</Txt>
                    <Grid cols="1fr 1fr" gap={16}>
                        <Card T={T} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Txt sz={14} w={700} c={T.text} mb={14}>Skill Radar</Txt>
                            <RadarChart T={T} labels={radarLabels} values={radarVals} color={T.accent} size={210} />
                        </Card>
                        <Card T={T}>
                            <Txt sz={14} w={700} c={T.text} mb={14}>Proficiency Breakdown</Txt>
                            {found.slice(0, 8).map((s: string, i: number) => {
                                const lvl = stable.skillLevels[i]; return (
                                    <div key={s} style={{ marginBottom: 12 }}>
                                        <Row justify="space-between" style={{ marginBottom: 4 }}>
                                            <Txt sz={13} c={T.text}>{s}</Txt>
                                            <Row gap={6}><Badge color={lvl > 80 ? T.accent3 : lvl > 65 ? T.accent : T.warn}>{lvl > 80 ? "Expert" : lvl > 65 ? "Proficient" : "Beginner"}</Badge><Txt sz={11} c={T.muted}>{lvl}%</Txt></Row>
                                        </Row>
                                        <Progress pct={lvl} color={lvl > 80 ? T.accent3 : lvl > 65 ? T.accent : T.warn} h={6} T={T} />
                                    </div>
                                );
                            })}
                        </Card>
                        <Card T={T}>
                            <Txt sz={14} w={700} c={T.text} mb={14}>🔴 Obsolescence Risk</Txt>
                            {found.slice(0, 5).map((s: string, i: number) => {
                                const risk = stable.obsRisks[i]; return (
                                    <Row key={s} justify="space-between" style={{ marginBottom: 10 }}>
                                        <Txt sz={13} c={T.text}>{s}</Txt>
                                        <Row gap={8}><Progress pct={risk} color={risk > 30 ? T.danger : risk > 15 ? T.warn : T.accent3} h={6} T={T} style={{ width: 80 }} /><Badge color={risk > 30 ? T.danger : risk > 15 ? T.warn : T.accent3}>{risk > 30 ? "High" : risk > 15 ? "Med" : "Low"}</Badge></Row>
                                    </Row>
                                );
                            })}
                        </Card>
                        <Card T={T}>
                            <Txt sz={14} w={700} c={T.text} mb={14}>💡 Skill Gap Severity</Txt>
                            <BarChart T={T} labels={missing.slice(0, 6)} values={stable.gapSeverity} colors={[T.danger, T.warn, "#8b5cf6", T.accent, T.accent3, "#ec4899"]} height={150} />
                        </Card>
                    </Grid>
                </div>
            )}

            {/* ── MOCK INTERVIEW ── */}
            {activeTab === "interview" && (
                <MockInterviewTab T={T} jobRole={jobRole} missing={missing} found={found} skillScore={skillScore} resumeText={resumeText || ""} />
            )}

            {/* ── SALARY ── */}
            {activeTab === "salary" && (
                <div>
                    <Txt sz={20} w={800} c={T.text} mb={18}>💰 Salary Intelligence (₹ INR)</Txt>
                    <Grid cols="repeat(auto-fit,minmax(170px,1fr))" gap={14} style={{ marginBottom: 18 }}>
                        {[{ l: "Current Estimate", v: INR(currentSalary), c: T.warn }, { l: "Role Base", v: INR(job.baseSalary), c: T.accent }, { l: "Full Potential", v: INR(potentialSalary), c: T.accent3 }, { l: "Gap to Close", v: INR(potentialSalary - currentSalary), c: "#8b5cf6" }].map(s => (
                            <Card T={T} key={s.l} style={{ textAlign: "center" }}>
                                <div style={{ height: 3, background: s.c, borderRadius: 4, marginBottom: 14 }} />
                                <Txt sz={22} w={800} c={s.c} mb={5}>{s.v}</Txt>
                                <Txt sz={11} c={T.muted}>{s.l}</Txt>
                            </Card>
                        ))}
                    </Grid>
                    <Grid cols="1fr 1fr" gap={16}>
                        <Card T={T}><Txt sz={14} w={700} c={T.text} mb={14}>Salary by Skill (₹)</Txt><BarChart T={T} labels={topCourses.map(c => c.skill)} values={topCourses.map(c => c.salaryBoost)} colors={[T.accent, T.accent3, "#8b5cf6", T.warn, T.danger, "#ec4899"]} height={155} /></Card>
                        <Card T={T}><Txt sz={14} w={700} c={T.text} mb={14}>5-Year Projection (₹L)</Txt>
                            <LineChart T={T} series={[{ label: "Current Path", data: [currentSalary / 100000, ...Array(5).fill(0).map((_, i) => +((currentSalary / 100000) * (1 + i * 0.05)).toFixed(1))], color: T.warn }, { label: "Optimized", data: [currentSalary / 100000, ...Array(5).fill(0).map((_, i) => +((currentSalary / 100000) * (1 + i * 0.13)).toFixed(1))], color: T.accent3 }]} labels={["Now", "Y1", "Y2", "Y3", "Y4", "Y5"]} height={165} />
                        </Card>
                        <Card T={T}><Txt sz={14} w={700} c={T.text} mb={14}>🌍 City-wise Salary (₹L/yr)</Txt><BarChart T={T} labels={["Bangalore", "Hyderabad", "Pune", "Mumbai", "Delhi", "Remote"]} values={[24, 21, 18, 22, 20, 19]} colors={[T.accent, "#8b5cf6", T.accent3, T.warn, T.accent, "#ec4899"]} height={145} /></Card>
                        <Card T={T}><Txt sz={14} w={700} c={T.text} mb={14}>🤖 Score Engine Output</Txt>
                            <div style={{ background: T.inputBg, borderRadius: 8, padding: 14 }}>
                                {[["Model", "Weighted Keyword Match", T.accent], ["Skill Score", `${skillScore}%`, T.accent3], ["Features", `${job.required.length} required skills`, T.text], ["Predicted", INR(currentSalary), T.warn], ["Potential", INR(potentialSalary), T.accent3]].map(([l, v, c]) => (
                                    <Row key={l as string} justify="space-between" style={{ marginBottom: 9 }}><Txt sz={13} c={T.muted}>{l}</Txt><Txt sz={13} c={c as string} w={600}>{v}</Txt></Row>
                                ))}
                            </div>
                        </Card>
                    </Grid>
                </div>
            )}

            {/* ── FORECAST ── */}
            {activeTab === "forecast" && (
                <div>
                    <Txt sz={20} w={800} c={T.text} mb={18}>📈 Skill Demand Forecast 2024–2029</Txt>
                    <Grid cols="1fr 1fr" gap={16}>
                        {found.slice(0, 4).map((skill: string, i: number) => {
                            const fc = stable.forecasts[i]; return (
                                <Card T={T} key={skill}>
                                    <Row justify="space-between" style={{ marginBottom: 10 }}><Txt sz={14} w={700} c={T.text}>{skill}</Txt><Badge color={T.accent3}>+{stable.demandPcts[i]}% demand</Badge></Row>
                                    <LineChart T={T} series={[{ label: "Demand", data: fc.map(f => f.demand), color: T.accent }]} labels={fc.map(f => f.year.toString())} height={135} />
                                </Card>
                            );
                        })}
                    </Grid>
                    <Card T={T} style={{ marginTop: 16 }}>
                        <Txt sz={14} w={700} c={T.text} mb={14}>🔮 Emerging Skills Index 2029</Txt>
                        <BarChart T={T} labels={["AI/ML", "Cloud", "DevOps", "NLP", "Blockchain", "Quantum", "Edge AI", "AutoML"]} values={[95, 88, 82, 90, 55, 40, 75, 78]} colors={[T.accent, T.accent3, "#8b5cf6", T.warn, T.danger, "#ec4899", T.accent, T.accent3]} height={165} />
                    </Card>
                </div>
            )}

            {/* ── PULSE ── */}
            {activeTab === "pulse" && <IndustryPulseTab T={T} />}

            {/* ── ROADMAP ── */}
            {activeTab === "roadmap" && <InteractiveRoadmap jobRole={jobRole} found={found} missing={missing} T={T} />}

            {/* ── COURSES ── */}
            {activeTab === "courses" && (
                <div>
                    <Txt sz={20} w={800} c={T.text} mb={5}>🎓 AI Course Recommendations</Txt>
                    <Txt sz={13} c={T.muted} mb={20}>Ranked by skill gap · salary impact · market demand</Txt>
                    <Grid cols="repeat(auto-fill,minmax(280px,1fr))" gap={16}>
                        {COURSES.map(c => {
                            const priority = missing.includes(c.skill) ? 100 : found.includes(c.skill) ? 60 : 40;
                            const score = Math.round(priority * 0.4 + (c.rating / 5 * 100) * 0.3 + (c.salaryBoost / 280000 * 100) * 0.3);
                            return (
                                <Card T={T} key={c.id} style={{ position: "relative", borderColor: missing.includes(c.skill) ? T.accent2 : T.border }}>
                                    {missing.includes(c.skill) && <div style={{ position: "absolute", top: -1, left: 20, background: `linear-gradient(135deg,${T.accent2},${T.accent})`, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: "0 0 8px 8px" }}>🎯 PRIORITY</div>}
                                    <div style={{ marginTop: missing.includes(c.skill) ? 12 : 0 }}>
                                        <Txt sz={14} w={700} c={T.text} mb={6}>{c.title}</Txt>
                                        <Row gap={6} wrap style={{ marginBottom: 10 }}><Badge color={T.accent}>{c.platform}</Badge><Badge color={T.accent3}>{c.skill}</Badge><Badge color={c.cost === 0 ? T.accent3 : T.muted}>{c.cost === 0 ? "Free" : "₹" + c.cost}</Badge></Row>
                                        <Grid cols="1fr 1fr 1fr" gap={8} style={{ marginBottom: 10 }}>
                                            {[[`⭐${c.rating}`, "Rating", T.accent], [`${c.hours}h`, "Hours", T.warn], [`+${INR(c.salaryBoost)}`, "Salary ↑", T.accent3]].map(([v, l, cl]) => (
                                                <div key={l as string} style={{ textAlign: "center", background: T.inputBg, borderRadius: 6, padding: 8 }}><Txt sz={12} w={700} c={cl}>{v}</Txt><Txt sz={10} c={T.muted}>{l}</Txt></div>
                                            ))}
                                        </Grid>
                                        <Row justify="space-between">
                                            <div><Txt sz={10} c={T.muted} mb={2}>AI Match</Txt><Progress pct={score} color={score > 80 ? T.accent3 : score > 60 ? T.accent : T.muted} h={5} T={T} style={{ width: 90 }} /></div>
                                            <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ background: `linear-gradient(135deg,${T.accent2},${T.accent})`, color: "#fff", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-block" }}>Enroll →</a>
                                        </Row>
                                    </div>
                                </Card>
                            );
                        })}
                    </Grid>
                </div>
            )}

            {/* ── REPORT ── */}
            {activeTab === "report" && (
                <div>
                    <Row justify="space-between" style={{ marginBottom: 22 }}>
                        <div><Txt sz={20} w={800} c={T.text} mb={4}>📋 Career Intelligence Report</Txt><Txt sz={12} c={T.muted}>Gap2Growth · {new Date().toLocaleDateString()} · {fileName || "Resume"}</Txt></div>
                        <button onClick={() => alert("PDF export — production: Python backend with WeasyPrint")} style={{ padding: "10px 20px", background: `linear-gradient(135deg,${T.accent2},${T.accent})`, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>⬇ Download PDF</button>
                    </Row>
                    <Card T={T}>
                        <div style={{ background: `linear-gradient(135deg,${T.accent2}22,${T.accent}14)`, borderRadius: 10, padding: 24, marginBottom: 22 }}>
                            <Row gap={14}>
                                <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${T.accent2},${T.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff" }}>{user.name[0]}</div>
                                <div><Txt sz={18} w={800} c={T.text} mb={3}>{user.name}</Txt><Txt sz={12} c={T.muted} mb={8}>{jobRole} · {fileName || "Resume"}</Txt><Row gap={6}><Badge color={T.accent}>DNA: {dnaScore}/100</Badge><Badge color={T.accent3}>Match: {skillScore}%</Badge><Badge color="#8b5cf6">Top {100 - peerPercentile}%</Badge></Row></div>
                            </Row>
                        </div>
                        {[
                            { t: "🧬 Skills", c: <Grid cols="1fr 1fr" gap={12}><div><Txt sz={12} c={T.muted} mb={7}>Matched</Txt><Row gap={6} wrap>{matched.map((s: string) => <Badge key={s} color={T.accent3}>{s}</Badge>)}</Row></div><div><Txt sz={12} c={T.muted} mb={7}>Missing</Txt><Row gap={6} wrap>{missing.map((s: string) => <Badge key={s} color={T.danger}>{s}</Badge>)}</Row></div></Grid> },
                            { t: "💰 Salary (₹ INR)", c: <Grid cols="1fr 1fr 1fr" gap={10}>{[["Current", INR(currentSalary), T.warn], ["Target", INR(job.baseSalary), T.accent], ["Potential", INR(potentialSalary), T.accent3]].map(([l, v, c]) => <div key={l as string} style={{ background: T.inputBg, borderRadius: 8, padding: 14, textAlign: "center" }}><Txt sz={18} w={800} c={c} mb={4}>{v}</Txt><Txt sz={11} c={T.muted}>{l}</Txt></div>)}</Grid> },
                            { t: "🗺️ Roadmap", c: <div>{stable.roadmap.map((p: any, i: number) => <Row key={i} gap={10} style={{ marginBottom: 7 }}><Badge color={T.accent}>Phase {i + 1}: {p.phase}</Badge><Txt sz={12} c={T.muted}>Wks {p.weeks} — {p.tasks.map((t: any) => t.skill).join(", ")}</Txt></Row>)}</div> },
                        ].map(s => (
                            <div key={s.t} style={{ marginBottom: 22 }}>
                                <Txt sz={14} w={700} c={T.text} mb={10}>{s.t}</Txt>
                                {s.c}
                                <div style={{ borderBottom: `1px solid ${T.border}`, marginTop: 18 }} />
                            </div>
                        ))}
                    </Card>
                </div>
            )}
        </div>
    );
}
