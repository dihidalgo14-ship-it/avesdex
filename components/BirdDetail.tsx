"use client";
import { useEffect, useState, useRef } from "react";
import { Bird, BirdDetail as BirdDetailType, XCResponse, XCRecording } from "@/types";
import AudioPlayer from "./AudioPlayer";
import SightingModal from "./SightingModal";
import { useAuth } from "@/lib/AuthContext";

interface Props {
  bird: Bird | null; index: number;
  isFavorite: boolean; isSeen: boolean; onToggleFav: (uid: string) => void;
}

type Tab = "info" | "sounds" | "locations";

const IUCN: Record<string, { color: string; bg: string; label: string }> = {
  LC: { color: "#4a7a45", bg: "#edf5ec", label: "Preocupación menor" },
  NT: { color: "#7aaa75", bg: "#edf5ec", label: "Casi amenazada" },
  VU: { color: "#b8860b", bg: "#fdf6e3", label: "Vulnerable" },
  EN: { color: "#c2510f", bg: "#fdf0e8", label: "En peligro" },
  CR: { color: "#9b2226", bg: "#fff0f0", label: "En peligro crítico" },
};

function NativePlayer({ file, author }: { file: string; author: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => { ref.current?.pause(); }, []);
  const toggle = () => {
    if (!ref.current) {
      ref.current = new Audio(file);
      ref.current.addEventListener("timeupdate", () => {
        const a = ref.current!;
        setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
      });
      ref.current.addEventListener("ended", () => { setPlaying(false); setProgress(0); });
    }
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current?.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    ref.current.currentTime = ((e.clientX - r.left) / r.width) * ref.current.duration;
  };
  return (
    <div style={{ background: "var(--leaf-bg)", border: "1px solid var(--leaf-lt)", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
      <div style={{ fontSize: 11, color: "var(--leaf)", fontWeight: 500, marginBottom: 8 }}>
        🎵 Grabación de referencia · <span style={{ fontWeight: 400, color: "var(--ink-muted)" }}>{author}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={toggle} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer", background: playing ? "var(--leaf)" : "var(--card)", color: playing ? "#fff" : "var(--leaf)", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
          {playing ? "⏸" : "▶"}
        </button>
        <div onClick={seek} style={{ flex: 1, height: 3, background: "var(--border)", borderRadius: 2, cursor: "pointer" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "var(--leaf)", borderRadius: 2, transition: "width 0.2s linear" }} />
        </div>
      </div>
    </div>
  );
}

export default function BirdDetail({ bird, index, isFavorite, isSeen, onToggleFav }: Props) {
  const [detail, setDetail]     = useState<BirdDetailType | null>(null);
  const [xcData, setXcData]     = useState<XCResponse | null>(null);
  const [dLoading, setDL]       = useState(false);
  const [xcLoading, setXL]      = useState(false);
  const [xcError, setXE]        = useState(false);
  const [tab, setTab]           = useState<Tab>("info");
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showSightingModal, setShowSightingModal] = useState(false);
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!bird) { setDetail(null); setXcData(null); return; }
    setDetail(null); setXcData(null); setXE(false);
    setTab("info"); setPhotoIdx(0);

    setDL(true);
    fetch(`/api/bird-detail?uid=${bird.uid}`)
      .then((r) => r.json()).then((d) => { setDetail(d); setDL(false); }).catch(() => setDL(false));

    const parts = bird.name.latin.trim().split(/\s+/);
    if (parts.length < 2) return;
    setXL(true);
    fetch(`/api/xeno-canto?gen=${encodeURIComponent(parts[0])}&sp=${encodeURIComponent(parts[1])}`)
      .then((r) => r.json()).then((d) => { setXcData(d); setXL(false); }).catch(() => { setXE(true); setXL(false); });
  }, [bird]);

  if (!bird) {
    return (
      <main style={{ flex: 1, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: 80, marginBottom: 20, opacity: 0.10 }}>🦜</div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--ink-muted)", fontStyle: "italic" }}>Selecciona un ave del catálogo</p>
          <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 6 }}>216 especies de Chile te esperan</p>
        </div>
      </main>
    );
  }

  const num = String(index + 1).padStart(3, "0");
  const recs: XCRecording[] = xcData?.recordings || [];
  const locations = recs.filter((r) => r.lat && r.lon);
  const isFallback = xcData?._fallback;
  const allPhotos = [
    bird.images?.full || bird.images?.main,
    ...(detail?.images?.gallery?.map((g) => g.url) || []),
  ].filter(Boolean) as string[];
  const iucnCat = (detail?.iucn as Record<string, string>)?.category;
  const iucnInfo = iucnCat ? IUCN[iucnCat] : null;

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: "info",      label: "Ficha completa" },
    { id: "sounds",    label: "Cantos",         count: recs.length },
    { id: "locations", label: "Avistamientos",  count: locations.length },
  ];

  return (
    <main style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }} className="anim-in">

      {/* ══════════════════════════════════════
          TOP SECTION: foto izq. | info der.
      ══════════════════════════════════════ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 420px) 1fr",
        gap: 0,
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        minHeight: 320,
      }} className="bird-hero-grid">

        {/* ── FOTO (izquierda) ── */}
        <div style={{ position: "relative", background: "#1a1208", overflow: "hidden", minHeight: 280 }}>
          {allPhotos.length > 0 && (
            <img
              key={allPhotos[photoIdx]}
              src={allPhotos[photoIdx]}
              alt={bird.name.spanish}
              className="anim-in"
              style={{
                width: "100%", height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
                minHeight: 280,
              }}
            />
          )}

          {/* Número badge */}
          <div style={{ position: "absolute", top: 10, left: 10, fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.5)", background: "rgba(0,0,0,0.45)", borderRadius: 4, padding: "3px 8px", backdropFilter: "blur(4px)" }}>
            #{num}
          </div>

          {/* Gallery dots */}
          {allPhotos.length > 1 && (
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              {allPhotos.map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)} style={{ width: i === photoIdx ? 18 : 6, height: 6, borderRadius: 3, border: "none", cursor: "pointer", background: i === photoIdx ? "#fff" : "rgba(255,255,255,0.35)", transition: "all 0.2s", padding: 0 }} />
              ))}
            </div>
          )}
        </div>

        {/* ── INFO (derecha) ── */}
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 0, borderLeft: "1px solid var(--border)" }}>

          {/* Encabezado + favorita */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15, margin: 0 }}>
                {bird.name.spanish}
              </h1>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "var(--ink-soft)", margin: "5px 0 2px", fontWeight: 400 }}>
                {bird.name.latin}
              </p>
              <p style={{ fontSize: 12, color: "var(--ink-faint)", margin: 0 }}>
                {bird.name.english}
              </p>
            </div>
            <button onClick={() => onToggleFav(bird.uid)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 18, color: isFavorite ? "#e85d04" : "var(--ink-faint)", transition: "all 0.15s", flexShrink: 0, marginLeft: 12 }}>
              {isFavorite ? "♥" : "♡"}
            </button>

          <button onClick={() => user ? setShowSightingModal(true) : signInWithGoogle()} style={{ position: "absolute", top: 10, right: 10, background: isSeen ? "#4a7a45" : "rgba(0,0,0,0.4)", border: "none", borderRadius: 4, padding: "3px 10px", cursor: "pointer", fontSize: 11, backdropFilter: "blur(4px)", transition: "all 0.15s", color: "#fff", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
            {isSeen ? "✓ VISTA" : "+ VISTA"}
          </button>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)", marginBottom: 16 }} />

          {/* Quick stats grid */}
          {dLoading ? (
            <div className="skeleton" style={{ height: 120, borderRadius: 10 }} />
          ) : detail ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>

              {detail.size && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>📏</span>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 2 }}>TAMAÑO</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{detail.size}</div>
                  </div>
                </div>
              )}

              {detail.order && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>🔬</span>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 2 }}>ORDEN</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--sky)" }}>{detail.order}</div>
                  </div>
                </div>
              )}

              {detail.species && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{detail.species === "Endémica" ? "🌟" : "🗺️"}</span>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 2 }}>ESPECIE</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: detail.species === "Endémica" ? "#7c3aed" : "var(--leaf)" }}>{detail.species}</div>
                  </div>
                </div>
              )}

              {iucnInfo && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>🛡️</span>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 2 }}>ESTADO IUCN</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: iucnInfo.color }}>{iucnCat} · {iucnInfo.label}</div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{detail?.migration ? "✈️" : "🏠"}</span>
                <div>
                  <div style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 2 }}>MIGRACIÓN</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: detail?.migration ? "var(--sky)" : "var(--ink-soft)" }}>{detail?.migration ? "Migratoria" : "Residente"}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>⚥</span>
                <div>
                  <div style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 2 }}>DIMORFISMO</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: detail?.dimorphism ? "#7c3aed" : "var(--ink-soft)" }}>{detail?.dimorphism ? "Sexual" : "No"}</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Mapa de distribución inline */}
          {detail?.map && (
            <>
              <div style={{ height: 1, background: "var(--border)", marginBottom: 14 }} />
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ background: "var(--bg-warm)", border: "1px solid var(--border)", borderRadius: 8, padding: 6, flexShrink: 0 }}>
                  <img src={detail.map.image} alt="Distribución" style={{ width: 90, display: "block" }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 4 }}>DISTRIBUCIÓN EN CHILE</div>
                  <p style={{ fontSize: 12, color: "var(--ink-muted)", lineHeight: 1.55, margin: 0 }}>{detail.map.title}</p>
                </div>
              </div>
            </>
          )}

          {/* Cantos disponibles badge */}
          {!xcLoading && recs.length > 0 && (
            <>
              <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, background: "var(--leaf-bg)", color: "var(--leaf)", border: "1px solid var(--leaf-lt)", borderRadius: 20, padding: "3px 10px", fontWeight: 500 }}>
                  🎵 {recs.length} grabacion{recs.length !== 1 ? "es" : ""} disponible{recs.length !== 1 ? "s" : ""}
                </span>
                {locations.length > 0 && (
                  <span style={{ fontSize: 11, background: "var(--sky-bg)", color: "var(--sky)", border: "1px solid var(--sky-lt)", borderRadius: 20, padding: "3px 10px", fontWeight: 500 }}>
                    📍 {locations.length} avistamiento{locations.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM SECTION: tabs con contenido
      ══════════════════════════════════════ */}

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--card)", position: "sticky", top: 0, zIndex: 10 }}>
        {TABS.map(({ id, label, count }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "13px 20px", fontSize: 13, border: "none", background: "none", cursor: "pointer",
            fontFamily: "var(--font-body)", fontWeight: tab === id ? 600 : 400,
            color: tab === id ? "var(--accent)" : "var(--ink-muted)",
            borderBottom: `2px solid ${tab === id ? "var(--accent)" : "transparent"}`,
            transition: "all 0.15s", marginBottom: -1, whiteSpace: "nowrap",
          }}>
            {label}{count !== undefined && count > 0 ? ` (${count})` : ""}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: "20px 24px", maxWidth: 760 }}>

        {/* FICHA COMPLETA */}
        {tab === "info" && (
          <div className="anim-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {dLoading ? (
              <>
                <div className="skeleton" style={{ height: 90, borderRadius: 10 }} />
                <div className="skeleton" style={{ height: 60, borderRadius: 10 }} />
              </>
            ) : detail ? (
              <>
                {detail.habitat && (
                  <section>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
                      🌿 Hábitat y distribución
                    </h2>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.8, margin: 0 }}>{detail.habitat}</p>
                  </section>
                )}

                {detail.didyouknow && (
                  <section style={{ background: "var(--gold-bg)", border: "1px solid #e9c46a50", borderRadius: 12, padding: "16px 18px" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--gold)", marginBottom: 8, display: "flex", alignItems: "center", gap: 7 }}>
                      💡 ¿Sabías que…?
                    </h2>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>{detail.didyouknow}</p>
                  </section>
                )}

                {detail.audio?.file && (
                  <section>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
                      🎵 Audio de referencia
                    </h2>
                    <NativePlayer file={detail.audio.file} author={detail.audio.author} />
                  </section>
                )}
              </>
            ) : (
              <p style={{ fontSize: 13, color: "var(--ink-muted)", fontStyle: "italic" }}>Sin información adicional disponible.</p>
            )}
          </div>
        )}

        {/* CANTOS */}
        {tab === "sounds" && (
          <div className="anim-up">
            {xcLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", fontSize: 13, color: "var(--ink-muted)" }}>
                <div style={{ width: 16, height: 16, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Buscando grabaciones en Xeno-canto...
              </div>
            )}
            {xcError && <p style={{ fontSize: 13, color: "#9b2226" }}>Error conectando con Xeno-canto</p>}
            {!xcLoading && !xcError && (
              <>
                {isFallback && (
                  <div style={{ fontSize: 11, color: "var(--gold)", background: "var(--gold-bg)", border: "1px solid #e9c46a40", borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>
                    ⚠ Sin grabaciones de Chile — mostrando registros globales
                  </div>
                )}
                {detail?.audio?.file && (
                  <div style={{ marginBottom: 18 }}>
                    <p style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em", marginBottom: 8 }}>NINJAS.CL</p>
                    <NativePlayer file={detail.audio.file} author={detail.audio.author || ""} />
                  </div>
                )}
                {recs.length > 0 && (
                  <>
                    <p style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em", marginBottom: 10 }}>
                      XENO-CANTO · {recs.length} GRABACIONES
                    </p>
                    {recs.map((r) => <AudioPlayer key={r.id} rec={r} />)}
                  </>
                )}
                {recs.length === 0 && !detail?.audio?.file && (
                  <p style={{ fontSize: 13, color: "var(--ink-muted)", fontStyle: "italic" }}>Sin grabaciones disponibles para esta especie.</p>
                )}
              </>
            )}
          </div>
        )}

        {/* AVISTAMIENTOS */}
        {tab === "locations" && (
          <div className="anim-up">
            {xcLoading
              ? <div style={{ fontSize: 13, color: "var(--ink-muted)", padding: "16px 0" }}>Cargando...</div>
              : locations.length === 0
              ? <p style={{ fontSize: 13, color: "var(--ink-muted)", fontStyle: "italic" }}>Sin coordenadas disponibles en Xeno-canto.</p>
              : (
                <>
                  <p style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em", marginBottom: 14 }}>
                    {locations.length} PUNTO{locations.length !== 1 ? "S" : ""} GEOREFERENCIADO{locations.length !== 1 ? "S" : ""}
                  </p>
                  {locations.map((r, i) => (
                    <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500, marginBottom: 3 }}>📍 {r.loc || "Sin nombre"}</div>
                          <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{r.cnt}</div>
                          <div style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                            {parseFloat(r.lat).toFixed(4)}, {parseFloat(r.lon).toFixed(4)}
                          </div>
                        </div>
                        <span style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{r.date}</span>
                      </div>
                    </div>
                  ))}
                  <a href="https://xeno-canto.org/explore/region/chile" target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, color: "var(--sky)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                    Ver mapa completo en Xeno-canto ↗
                  </a>
                </>
              )
            }
          </div>
        )}
      </div>

      {showSightingModal && bird && (
        <SightingModal bird={bird} onClose={() => setShowSightingModal(false)} />
      )}

      <style>{`
        @media (max-width: 900px) {
          .bird-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
