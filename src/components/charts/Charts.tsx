import React, { useRef, useEffect } from "react";

export function LineChart({ series, labels, height = 160, T }: any) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext("2d"); if (!ctx) return;
        const W = cv.offsetWidth || 400, H = height;
        cv.width = W; cv.height = H; ctx.clearRect(0, 0, W, H);
        const pad = { t: 20, r: 20, b: 30, l: 40 }; const w = W - pad.l - pad.r, h = H - pad.t - pad.b;
        const all = series.flatMap((s: any) => s.data); const mn = Math.min(...all), mx = Math.max(...all);
        const sy = (v: number) => pad.t + h - (v - mn) / (mx - mn || 1) * h, sx = (i: number) => pad.l + i / (labels.length - 1 || 1) * w;
        ctx.strokeStyle = T.border; ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) { const y = pad.t + i * h / 4; ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + w, y); ctx.stroke(); }
        ctx.fillStyle = T.muted; ctx.font = "10px Inter,sans-serif"; ctx.textAlign = "center";
        labels.forEach((l: any, i: number) => ctx.fillText(l, sx(i), H - 6));
        series.forEach((s: any) => {
            ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.beginPath();
            s.data.forEach((v: number, i: number) => i === 0 ? ctx.moveTo(sx(i), sy(v)) : ctx.lineTo(sx(i), sy(v))); ctx.stroke();
            s.data.forEach((v: number, i: number) => { ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(sx(i), sy(v), 3, 0, Math.PI * 2); ctx.fill(); });
        });
    }, [series, labels, height, T]);
    return <canvas ref={ref} style={{ width: "100%", height }} />;
}

export function BarChart({ labels, values, colors, height = 160, T }: any) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext("2d"); if (!ctx) return;
        const W = cv.offsetWidth || 400, H = height;
        cv.width = W; cv.height = H; ctx.clearRect(0, 0, W, H);
        const pad = { t: 10, r: 10, b: 36, l: 50 }; const w = W - pad.l - pad.r, h = H - pad.t - pad.b;
        const mx = Math.max(...values, 1); const bw = Math.max(w / values.length - 8, 8);
        ctx.fillStyle = T.muted; ctx.font = "10px Inter,sans-serif"; ctx.textAlign = "right";
        for (let i = 0; i < 5; i++) { const v = Math.round(mx * i / 4); const y = pad.t + h - h * i / 4; ctx.fillText(v.toString(), pad.l - 4, y + 3); }
        values.forEach((v: number, i: number) => {
            const x = pad.l + i * (w / values.length) + (w / values.length - bw) / 2, bh = v / mx * h;
            const g = ctx.createLinearGradient(0, pad.t + h - bh, 0, pad.t + h);
            g.addColorStop(0, colors[i % colors.length]); g.addColorStop(1, colors[i % colors.length] + "44");
            ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, pad.t + h - bh, bw, bh, 4); ctx.fill();
            ctx.fillStyle = T.muted; ctx.font = "9px Inter,sans-serif"; ctx.textAlign = "center"; ctx.fillText(labels[i]?.slice(0, 7) || "", x + bw / 2, H - 4);
        });
    }, [labels, values, colors, height, T]);
    return <canvas ref={ref} style={{ width: "100%", height }} />;
}

export function RadarChart({ labels, values, color, size = 200, T }: any) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext("2d"); if (!ctx) return;
        cv.width = size; cv.height = size; ctx.clearRect(0, 0, size, size);
        const cx = size / 2, cy = size / 2, r = size / 2 - 30, n = labels.length;
        const angle = (i: number) => -Math.PI / 2 + i * 2 * Math.PI / n, pt = (i: number, rad: number) => [cx + rad * Math.cos(angle(i)), cy + rad * Math.sin(angle(i))];
        for (let g = 1; g <= 4; g++) { ctx.strokeStyle = T.border; ctx.lineWidth = 1; ctx.beginPath(); labels.forEach((_: any, i: number) => { const [x, y] = pt(i, r * g / 4); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }); ctx.closePath(); ctx.stroke(); }
        ctx.strokeStyle = T.border + "88"; labels.forEach((_: any, i: number) => { const [x, y] = pt(i, r); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); });
        ctx.fillStyle = color + "33"; ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
        values.forEach((v: number, i: number) => { const [x, y] = pt(i, r * v / 100); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = T.subtext; ctx.font = "bold 9px Inter,sans-serif"; ctx.textAlign = "center";
        labels.forEach((l: any, i: number) => { const [x, y] = pt(i, r + 14); ctx.fillText(l.slice(0, 8), x, y + 4); });
    }, [labels, values, color, size, T]);
    return <canvas ref={ref} style={{ width: size, height: size }} />;
}

export function DonutChart({ value, color, size = 120, label, T }: any) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext("2d"); if (!ctx) return;
        cv.width = size; cv.height = size; ctx.clearRect(0, 0, size, size);
        const cx = size / 2, cy = size / 2, r = size / 2 - 8, start = -Math.PI / 2, end = start + (value / 100) * 2 * Math.PI;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.strokeStyle = T.border; ctx.lineWidth = 18; ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, r, start, end); ctx.strokeStyle = color; ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.stroke();
        ctx.fillStyle = color; ctx.font = `bold ${size > 100 ? 17 : 13}px Inter,sans-serif`; ctx.textAlign = "center"; ctx.fillText(value + "%", cx, cy + 5);
        if (label) { ctx.fillStyle = T.muted; ctx.font = "10px Inter,sans-serif"; ctx.fillText(label, cx, cy + 19); }
    }, [value, color, size, label, T]);
    return <canvas ref={ref} style={{ width: size, height: size }} />;
}
