import React, { useRef, useEffect, useState } from "react";

// --- Helpers for fluid animations & interaction ---
const easeOutCirc = (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2));
const easeOutElastic = (x: number) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

// ─── Fluid Line Chart with Ripple/Doodle Hover ──────────────────────────────
export function LineChart({ series, labels, height = 160, T }: any) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [mouse, setMouse] = useState<{ x: number, y: number } | null>(null);

    const dataHash = JSON.stringify(series) + JSON.stringify(labels);
    const startTimeRef = useRef(performance.now());

    useEffect(() => {
        startTimeRef.current = performance.now();
    }, [dataHash, height, T]);

    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext("2d"); if (!ctx) return;

        let frameId: number;
        const startTime = startTimeRef.current;
        const DURATION = 1200;

        const render = (now: number) => {
            const elapsed = Math.max(0, now - startTime);
            const rawProgress = Math.min(elapsed / DURATION, 1);
            const p = easeOutCirc(rawProgress); // fluid entrance

            const W = cv.offsetWidth || 400, H = height;
            cv.width = W; cv.height = H; ctx.clearRect(0, 0, W, H);
            const pad = { t: 20, r: 20, b: 30, l: 40 };
            const w = W - pad.l - pad.r, h = H - pad.t - pad.b;
            const all = series.flatMap((s: any) => s.data);
            const mn = Math.min(...all), mx = Math.max(...all);

            const sy = (v: number) => pad.t + h - (v - mn) / (mx - mn || 1) * h;
            const sx = (i: number) => pad.l + i / (labels.length - 1 || 1) * w;

            // Grid lines
            ctx.strokeStyle = T.border; ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const y = pad.t + i * h / 4;
                ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + w * p, y); ctx.stroke();
            }

            // X-Axis labels
            ctx.fillStyle = T.muted; ctx.font = "10px Inter,sans-serif"; ctx.textAlign = "center";
            ctx.globalAlpha = p;
            labels.forEach((l: any, i: number) => ctx.fillText(l, sx(i), H - 6));
            ctx.globalAlpha = 1;

            // Draw series
            series.forEach((s: any) => {
                const points = s.data.map((v: number, i: number) => {
                    const bx = sx(i);
                    const by = sy(v);
                    // Intro animation Y offset
                    const animatedY = by + (height - by) * (1 - p);

                    // Doodle / Ripple hover effect
                    let finalY = animatedY;
                    let radius = 3;
                    if (mouse && p === 1) {
                        const dx = mouse.x - bx;
                        const dist = Math.abs(dx);
                        if (dist < 40) {
                            // Ripple/lift effect
                            const lift = Math.max(0, 1 - dist / 40) * 12;
                            finalY -= lift;
                            radius += lift * 0.4;
                            // Doodle wobble
                            finalY += Math.sin(now / 150 + i) * 2;
                        }
                    }
                    return { x: bx, y: finalY, r: radius };
                });

                ctx.strokeStyle = s.color;
                ctx.lineWidth = 2.5;
                ctx.beginPath();

                // Draw path up to current progress
                const drawCount = Math.max(1, Math.floor(points.length * p));
                for (let i = 0; i < drawCount; i++) {
                    if (i === 0) ctx.moveTo(points[i].x, points[i].y);
                    else {
                        // Smooth curves
                        const cpX = (points[i - 1].x + points[i].x) / 2;
                        ctx.bezierCurveTo(cpX, points[i - 1].y, cpX, points[i].y, points[i].x, points[i].y);
                    }
                }
                ctx.stroke();

                // Draw points + Hover ripple rings
                for (let i = 0; i < drawCount; i++) {
                    const pt = points[i];
                    ctx.fillStyle = s.color;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
                    ctx.fill();

                    // Extra ripple ring on hover
                    if (mouse && p === 1 && Math.abs(mouse.x - pt.x) < 30) {
                        const ringPulse = (now % 1000) / 1000;
                        ctx.strokeStyle = s.color + Math.floor((1 - ringPulse) * 255).toString(16).padStart(2, '0');
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, pt.r + ringPulse * 15, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            });

            if (p < 1 || mouse) {
                frameId = requestAnimationFrame(render);
            }
        };

        frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, [dataHash, height, T, mouse]);

    const handleHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return <canvas
        ref={ref}
        style={{ width: "100%", height, cursor: mouse ? "crosshair" : "default" }}
        onMouseMove={handleHover}
        onMouseLeave={() => setMouse(null)}
    />;
}

// ─── Fluid Bar Chart with Spring Hover ────────────────────────────────────────
export function BarChart({ labels, values, colors, height = 160, T }: any) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [mouse, setMouse] = useState<{ x: number, y: number } | null>(null);

    const dataHash = JSON.stringify(values) + JSON.stringify(labels);
    const startTimeRef = useRef(performance.now());

    useEffect(() => {
        startTimeRef.current = performance.now();
    }, [dataHash, height, T, colors]);

    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext("2d"); if (!ctx) return;

        let frameId: number;
        const startTime = startTimeRef.current;
        const DURATION = 900;

        const render = (now: number) => {
            const elapsed = Math.max(0, now - startTime);
            const W = cv.offsetWidth || 400, H = height;
            cv.width = W; cv.height = H; ctx.clearRect(0, 0, W, H);
            const pad = { t: 10, r: 10, b: 36, l: 50 };
            const w = W - pad.l - pad.r, h = H - pad.t - pad.b;
            const mx = Math.max(...values, 1);
            const bw = Math.max(w / values.length - 8, 8);

            // Staggered entrance
            const rawProgress = Math.min(elapsed / DURATION, 1);

            ctx.fillStyle = T.muted; ctx.font = "10px Inter,sans-serif"; ctx.textAlign = "right";
            ctx.globalAlpha = easeOutCirc(rawProgress);
            for (let i = 0; i < 5; i++) {
                const v = Math.round(mx * i / 4);
                const y = pad.t + h - h * i / 4;
                ctx.fillText(v.toString(), pad.l - 4, y + 3);
            }
            ctx.globalAlpha = 1;

            values.forEach((v: number, i: number) => {
                // Staggered delay per bar
                const barP = Math.min(Math.max((elapsed - i * 50) / 600, 0), 1);
                const p = easeOutElastic(barP); // Bouncy entrance

                const x = pad.l + i * (w / values.length) + (w / values.length - bw) / 2;
                let targetH = (v / mx) * h;

                // Hover interactive spring
                let currentBw = bw;
                let isHovered = false;
                if (mouse && barP === 1) {
                    const isOverX = mouse.x >= x - 10 && mouse.x <= x + bw + 10;
                    if (isOverX) {
                        isHovered = true;
                        targetH += 8; // Spring up
                        currentBw += 4; // Widen slightly
                        // Doodle wave effect on hover
                        targetH += Math.sin(now / 100) * 3;
                    }
                }

                const bh = targetH * p;
                const barY = pad.t + h - bh;

                const baseColor = colors[i % colors.length];
                const g = ctx.createLinearGradient(0, barY, 0, pad.t + h);
                g.addColorStop(0, isHovered ? baseColor : baseColor + "dd");
                g.addColorStop(1, baseColor + (isHovered ? "66" : "22"));

                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.roundRect(x - (currentBw - bw) / 2, barY, currentBw, bh, [4, 4, 0, 0]);
                ctx.fill();

                if (isHovered) {
                    ctx.shadowColor = baseColor;
                    ctx.shadowBlur = 15;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }

                ctx.fillStyle = T.muted;
                ctx.font = "9px Inter,sans-serif";
                ctx.textAlign = "center";
                ctx.globalAlpha = Math.max(0, p);
                ctx.fillText(labels[i]?.slice(0, 7) || "", x + bw / 2, H - 4);
                ctx.globalAlpha = 1;
            });

            if (rawProgress < 1 || mouse) {
                frameId = requestAnimationFrame(render);
            }
        };

        frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, [dataHash, height, T, colors, mouse]);

    return <canvas
        ref={ref}
        style={{ width: "100%", height }}
        onMouseMove={(e) => {
            const rect = ref.current?.getBoundingClientRect();
            if (rect) setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseLeave={() => setMouse(null)}
    />;
}

// ─── Fluid Radar Chart with Rotation ──────────────────────────────────────────
export function RadarChart({ labels, values, color, size = 200, T }: any) {
    const ref = useRef<HTMLCanvasElement>(null);

    const dataHash = JSON.stringify(values) + JSON.stringify(labels);
    const startTimeRef = useRef(performance.now());

    useEffect(() => {
        startTimeRef.current = performance.now();
    }, [dataHash, size, color, T]);

    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext("2d"); if (!ctx) return;

        let frameId: number;
        const startTime = startTimeRef.current;

        const render = (now: number) => {
            const elapsed = Math.max(0, now - startTime);
            cv.width = size; cv.height = size; ctx.clearRect(0, 0, size, size);

            const p = easeOutCirc(Math.min(elapsed / 1000, 1));
            // Slow continuous rotation after entrance
            const rotOffset = p === 1 ? (elapsed - 1000) * 0.0002 : 0;

            const cx = size / 2, cy = size / 2, r = size / 2 - 30, n = labels.length;
            const angle = (i: number) => -Math.PI / 2 + i * 2 * Math.PI / n + rotOffset;
            const pt = (i: number, rad: number) => [cx + rad * Math.cos(angle(i)), cy + rad * Math.sin(angle(i))];

            // Grid
            for (let g = 1; g <= 4; g++) {
                ctx.strokeStyle = T.border; ctx.lineWidth = 1; ctx.beginPath();
                labels.forEach((_: any, i: number) => {
                    const [x, y] = pt(i, r * g / 4 * p);
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                });
                ctx.closePath(); ctx.stroke();
            }
            ctx.strokeStyle = T.border + "88";
            labels.forEach((_: any, i: number) => {
                const [x, y] = pt(i, r * p); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
            });

            // Data poly
            ctx.fillStyle = color + "33"; ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.beginPath();
            values.forEach((v: number, i: number) => {
                const [x, y] = pt(i, r * (v / 100) * p);
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            });
            ctx.closePath(); ctx.fill(); ctx.stroke();

            // Labels fade in
            ctx.globalAlpha = p;
            ctx.fillStyle = T.subtext; ctx.font = "bold 9px Inter,sans-serif"; ctx.textAlign = "center";
            labels.forEach((l: any, i: number) => {
                const [x, y] = pt(i, r + 16);
                ctx.fillText(l.slice(0, 8), x, y + 4);
            });
            ctx.globalAlpha = 1;

            frameId = requestAnimationFrame(render);
        };

        frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, [dataHash, size, color, T]);

    return <canvas ref={ref} style={{ width: size, height: size }} />;
}

// ─── Fluid Donut Chart ────────────────────────────────────────────────────────
export function DonutChart({ value, color, size = 120, label, T }: any) {
    const ref = useRef<HTMLCanvasElement>(null);

    const startTimeRef = useRef(performance.now());
    useEffect(() => {
        startTimeRef.current = performance.now();
    }, [value, size, color, T]);

    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext("2d"); if (!ctx) return;

        let frameId: number;
        const startTime = startTimeRef.current;

        const render = (now: number) => {
            const elapsed = Math.max(0, now - startTime);
            cv.width = size; cv.height = size; ctx.clearRect(0, 0, size, size);

            const p = easeOutCirc(Math.min(elapsed / 1000, 1));

            const cx = size / 2, cy = size / 2, r = size / 2 - 8;
            const start = -Math.PI / 2;
            const targetEnd = start + (value / 100) * 2 * Math.PI;
            const end = start + (targetEnd - start) * p;

            // BG ring
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.strokeStyle = T.border; ctx.lineWidth = 18; ctx.stroke();

            // Value arc
            ctx.beginPath(); ctx.arc(cx, cy, r, start, end);
            ctx.strokeStyle = color; ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.stroke();

            // Text
            ctx.globalAlpha = p;
            const displayVal = Math.round(value * p);
            ctx.fillStyle = color; ctx.font = `bold ${size > 100 ? 17 : 13}px Inter,sans-serif`;
            ctx.textAlign = "center"; ctx.fillText(displayVal + "%", cx, cy + 5);

            if (label) {
                ctx.fillStyle = T.muted; ctx.font = "10px Inter,sans-serif";
                ctx.fillText(label, cx, cy + 19);
            }
            ctx.globalAlpha = 1;

            if (p < 1) frameId = requestAnimationFrame(render);
        };

        frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, [value, size, color, label, T]);

    return <canvas ref={ref} style={{ width: size, height: size }} />;
}
