"use client";
import { useState, useRef, useEffect } from "react";
import { XCRecording } from "@/types";

const Q_LABEL: Record<string, { color: string; label: string }> = {
  A: { color: "#4a7a45", label: "Excelente" },
  B: { color: "#7aaa75", label: "Buena" },
  C: { color: "#b8860b", label: "Regular" },
  D: { color: "#c2510f", label: "Baja" },
  E: { color: "#9b2226", label: "Mínima" },
};

export default function AudioPlayer({ rec }: { rec: XCRecording }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileUrl = rec.file?.startsWith("//") ? `https:${rec.file}` : rec.file;
  const xcUrl   = rec.url?.startsWith("//")  ? `https:${rec.url}`  : rec.url;

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const toggle = () => {
    if (!fileUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(fileUrl);
      audioRef.current.addEventListener("timeupdate", () => {
        const a = audioRef.current!;
        setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
      });
      audioRef.current.addEventListener("ended", () => { setPlaying(false); setProgress(0); });
    }
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else          { audioRef.current.play();  setPlaying(true);  }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current?.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    audioRef.current.currentTime = ((e.clientX - r.left) / r.width) * audioRef.current.duration;
  };

  const q = Q_LABEL[rec.q];

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
      {/* Meta */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-soft)", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px" }}>
          {rec.type || "canto"}
        </span>
        {q && (
          <span style={{ fontSize: 10, color: q.color, fontFamily: "var(--font-mono)", border: `1px solid ${q.color}50`, borderRadius: 4, padding: "2px 6px" }}>
            Q:{rec.q} · {q.label}
          </span>
        )}
        {rec.sex && rec.sex !== "" && rec.sex !== "unknown" && (
          <span style={{ fontSize: 10, color: "var(--ink-muted)" }}>{rec.sex}</span>
        )}
        <span style={{ fontSize: 10, color: "var(--ink-faint)", marginLeft: "auto", fontFamily: "var(--font-mono)" }}>{rec.date}</span>
      </div>

      <div style={{ fontSize: 11, color: "var(--ink-muted)", marginBottom: 10 }}>
        <span style={{ color: "var(--ink-faint)" }}>Por </span>{rec.rec}
      </div>

      {/* Player */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={toggle} disabled={!fileUrl} style={{
          width: 34, height: 34, borderRadius: "50%", flexShrink: 0, border: "none",
          cursor: fileUrl ? "pointer" : "not-allowed",
          background: playing ? "var(--accent)" : "var(--bg-warm)",
          color: playing ? "#fff" : "var(--accent)",
          fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: playing ? "0 2px 8px rgba(194,81,15,0.3)" : "none",
          transition: "all 0.15s",
        }}>
          {playing ? "⏸" : "▶"}
        </button>

        <div onClick={seek} style={{ flex: 1, height: 3, background: "var(--bg-warm)", borderRadius: 2, cursor: "pointer", position: "relative" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "var(--accent)", borderRadius: 2, transition: "width 0.2s linear" }} />
        </div>

        <span style={{ fontSize: 10, color: "var(--ink-muted)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{rec.length}</span>
        <a href={xcUrl} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 10, color: "var(--sky)", textDecoration: "none", flexShrink: 0 }}
          title="Ver en Xeno-canto">↗ XC</a>
      </div>

      {rec.loc && (
        <div style={{ marginTop: 8, fontSize: 10, color: "var(--ink-faint)", display: "flex", alignItems: "center", gap: 4 }}>
          <span>📍</span> {rec.loc}{rec.cnt ? `, ${rec.cnt}` : ""}
        </div>
      )}
      {rec.rmk && (
        <div style={{ marginTop: 6, fontSize: 10, color: "var(--ink-faint)", fontStyle: "italic", lineHeight: 1.5, borderLeft: "2px solid var(--border)", paddingLeft: 8 }}>
          {rec.rmk.slice(0, 120)}{rec.rmk.length > 120 ? "…" : ""}
        </div>
      )}
    </div>
  );
}
