import React, { useState, useRef, useCallback } from "react";
import { Txt, Row, Progress, Badge } from "./ui/Primitives";
import { extractTextFromPDF } from "../utils";

export function PDFUpload({ onFileReady, T }: any) {
    const [drag, setDrag] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [err, setErr] = useState("");
    const [preview, setPreview] = useState("");
    const [parsing, setParsing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const MAX = 5 * 1024 * 1024;
    const handle = useCallback(async (f: File) => {
        setErr("");
        if (!f) return;
        if (f.type !== "application/pdf") return setErr("❌ Only PDF files are supported.");
        if (f.size > MAX) return setErr("❌ File exceeds 5 MB limit.");
        setFile(f); setParsing(true);
        const text = await extractTextFromPDF(f);
        setParsing(false); setPreview(text.slice(0, 350) + "..."); onFileReady(text, f);
    }, [onFileReady]);
    const pct = file ? Math.round(file.size / MAX * 100) : 0;
    const barC = pct > 80 ? T.danger : pct > 50 ? T.warn : T.accent3;
    return (
        <div>
            <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]); }}
                onClick={() => inputRef.current?.click()}
                style={{ border: `2px dashed ${drag ? T.accent : file ? T.accent3 : T.border}`, borderRadius: 14, background: drag ? T.accent + "08" : file ? T.accent3 + "08" : T.inputBg, padding: "32px 20px", textAlign: "center", cursor: "pointer", transition: "all .2s" }}>
                <input ref={inputRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) handle(e.target.files[0]); }} />
                {parsing ? (
                    <div><div style={{ fontSize: 32, animation: "spin 1s linear infinite" }}>⚙️</div><Txt sz={14} c={T.accent} w={600} style={{ marginTop: 8 }}>Parsing PDF…</Txt></div>
                ) : file ? (
                    <div>
                        <div style={{ fontSize: 36, marginBottom: 6 }}>✅</div>
                        <Txt sz={14} w={700} c={T.accent3} mb={4}>{file.name}</Txt>
                        <Txt sz={11} c={T.muted} mb={10}>{(file.size / 1024 / 1024).toFixed(2)} MB / 5 MB</Txt>
                        <div style={{ maxWidth: 220, margin: "0 auto 10px" }}><Progress pct={pct} color={barC} h={5} T={T} /><Row justify="space-between" style={{ marginTop: 3 }}><Txt sz={9} c={T.muted}>0 MB</Txt><Txt sz={9} c={barC} w={600}>{(file.size / 1024 / 1024).toFixed(2)} MB</Txt><Txt sz={9} c={T.muted}>5 MB</Txt></Row></div>
                        <Badge color={T.accent3}>✓ Parsed</Badge>
                        <Txt sz={10} c={T.muted} style={{ marginTop: 8 }}>Click to replace</Txt>
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: 44, marginBottom: 10 }}>📄</div>
                        <Txt sz={15} w={700} c={T.text} mb={4}>Drop Resume PDF here</Txt>
                        <Txt sz={12} c={T.muted} mb={12}>or click to browse</Txt>
                        <Row gap={6} style={{ justifyContent: "center" }}><Badge color={T.accent}>PDF only</Badge><Badge color={T.muted}>Max 5 MB</Badge><Badge color={T.accent3}>NLP extract</Badge></Row>
                    </div>
                )}
            </div>
            {err && <div style={{ marginTop: 8, background: T.danger + "18", border: `1px solid ${T.danger}44`, borderRadius: 8, padding: "8px 12px" }}><Txt sz={12} c={T.danger}>{err}</Txt></div>}
            {file && !err && (
                <Row justify="space-between" style={{ marginTop: 10, background: T.inputBg, borderRadius: 8, padding: "10px 14px" }}>
                    <Row gap={8}><span>📄</span><div><Txt sz={12} c={T.text} w={600}>{file.name}</Txt><Txt sz={10} c={T.muted}>{new Date(file.lastModified).toLocaleDateString()}</Txt></div></Row>
                    <button onClick={e => { e.stopPropagation(); setFile(null); setPreview(""); onFileReady("", null); }} style={{ background: "none", border: `1px solid ${T.danger}44`, color: T.danger, borderRadius: 6, padding: "3px 9px", cursor: "pointer", fontSize: 12 }}>✕</button>
                </Row>
            )}
            {preview && <div style={{ marginTop: 10, background: T.inputBg, borderRadius: 8, padding: 10, maxHeight: 80, overflowY: "auto" }}><Txt sz={11} c={T.muted} style={{ fontFamily: "monospace", lineHeight: 1.6 }}>{preview}</Txt></div>}
        </div>
    );
}
