"use client";
import { Bird } from "@/types";
import { useCallback } from "react";

interface Props {
  birds: Bird[]; selected: Bird | null; loading: boolean;
  favorites: Set<string>; seenBirds: Set<string>;
  onSelect: (b: Bird) => void; onToggleFav: (uid: string) => void;
}

function Skeleton() {
  return (
    <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "center" }}>
      <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 8, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 13, width: "60%", marginBottom: 7 }} />
        <div className="skeleton" style={{ height: 10, width: "80%" }} />
      </div>
    </div>
  );
}

export default function BirdList({ birds, selected, loading, favorites, seenBirds, onSelect, onToggleFav }: Props) {
  const stopProp = useCallback((e: React.MouseEvent, uid: string) => {
    e.stopPropagation(); onToggleFav(uid);
  }, [onToggleFav]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--panel)" }}>
      <div style={{ padding: "6px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--card)" }}>
        <span style={{ fontSize: 11, color: "var(--ink-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>CATÁLOGO</span>
        <span style={{ fontSize: 11, color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>{birds.length} aves</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} />)
          : birds.length === 0
          ? <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--ink-muted)", fontSize: 13 }}>Sin resultados</div>
          : birds.map((bird, i) => {
              const active = selected?.uid === bird.uid;
              const fav    = favorites.has(bird.uid);
              const seen   = seenBirds.has(bird.uid);
              return (
                <div key={bird.uid} role="button" tabIndex={0}
                  onClick={() => onSelect(bird)}
                  onKeyDown={(e) => e.key === "Enter" && onSelect(bird)}
                  style={{
                    display: "flex", alignItems: "center", gap: 11,
                    padding: "10px 14px", borderBottom: "1px solid var(--border)",
                    background: active ? "var(--accent-bg)" : "transparent",
                    borderLeft: `3px solid ${active ? "var(--accent)" : "transparent"}`,
                    cursor: "pointer", transition: "all 0.12s", outline: "none",
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "var(--bg-warm)"; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                >
                  {/* Thumb */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 8, overflow: "hidden", border: `1.5px solid ${active ? "var(--accent)" : "var(--border)"}`, background: "var(--bg-warm)", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.12s" }}>
                      {active && bird.images?.thumb
                        ? <img src={bird.images.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 20, opacity: 0.25 }}>🐦</span>
                      }
                    </div>
                    {/* Seen checkmark badge */}
                    {seen && (
                      <div style={{ position: "absolute", bottom: -3, right: -3, width: 16, height: 16, borderRadius: "50%", background: "var(--leaf)", border: "1.5px solid var(--card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>✓</div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: active ? "var(--accent)" : "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3 }}>
                      {bird.name.spanish}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-muted)", fontStyle: "italic", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--font-display)" }}>
                      {bird.name.latin}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--ink-faint)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {bird.name.english}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                    <button onClick={(e) => stopProp(e, bird.uid)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", fontSize: 14, lineHeight: 1, transition: "transform 0.15s", color: fav ? "#e85d04" : "var(--ink-faint)", transform: fav ? "scale(1.1)" : "scale(1)" }}
                      title={fav ? "Quitar favorita" : "Agregar a favoritas"}>
                      {fav ? "♥" : "♡"}
                    </button>
                    <span style={{ fontSize: 9, color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>{String(i + 1).padStart(3, "0")}</span>
                  </div>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}
