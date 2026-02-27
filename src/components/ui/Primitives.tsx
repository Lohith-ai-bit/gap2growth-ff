import React from "react";
import { clamp } from "../../utils";

export const px = (s: number | string) => typeof s === "number" ? s + "px" : s;

export const Txt = ({ c, sz, w, mb, style, ...p }: any) => (
    <div style={{ color: c, fontSize: px(sz || 14), fontWeight: w || 400, marginBottom: px(mb || 0), ...style }} {...p} />
);

export const Row = ({ gap = 8, wrap, align = "center", justify, style, ...p }: any) => (
    <div style={{ display: "flex", alignItems: align, justifyContent: justify || "flex-start", gap: px(gap), flexWrap: wrap ? "wrap" : undefined, ...style }} {...p} />
);

export const Grid = ({ cols = "1fr 1fr", gap = 12, style, ...p }: any) => (
    <div style={{ display: "grid", gridTemplateColumns: cols, gap: px(gap), ...style }} {...p} />
);

// Fixed: was using T.card — now uses T.cardBg which is the correct token
export const Card = ({ T, style, ...p }: any) => (
    <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, ...style }} {...p} />
);

export const Badge = ({ color, bg, children, style }: any) => (
    <span style={{ background: bg || color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, display: "inline-block", ...style }}>{children}</span>
);

export const Btn = ({ onClick, disabled, children, sm, outline, T, style }: any) => (
    <button onClick={onClick} disabled={disabled} style={{ background: outline ? "transparent" : `linear-gradient(135deg,${T.accent2},${T.accent})`, color: outline ? T.muted : "#fff", border: outline ? `1px solid ${T.border}` : "none", padding: sm ? "6px 14px" : "10px 22px", borderRadius: 8, fontSize: sm ? 12 : 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...style }}>{children}</button>
);

// Fixed: progress bar background was hardcoded dark — now uses T.border for light-theme compat
export const Progress = ({ pct, color, h = 8, T, style }: any) => (
    <div style={{ background: T?.border || "#e5e7eb", borderRadius: 99, height: h, overflow: "hidden", ...style }}>
        <div style={{ width: `${clamp(pct)}%`, height: "100%", background: `linear-gradient(90deg,${color},${color}99)`, borderRadius: 99, transition: "width .6s ease" }} />
    </div>
);

export const Select = ({ options, value, onChange, T }: any) => (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, padding: "10px 14px", borderRadius: 8, width: "100%", fontSize: 14, outline: "none" }}>
        {options.map((o: any) => <option key={o}>{o}</option>)}
    </select>
);
