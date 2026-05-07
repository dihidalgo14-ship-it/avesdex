"use client";
import { useAuth } from "@/lib/AuthContext";

const PREVIEW_BIRDS = [
  { name: "Cóndor Andino",    latin: "Vultur gryphus",         emoji: "🦅" },
  { name: "Flamenco Chileno", latin: "Phoenicopterus chilensis", emoji: "🦩" },
  { name: "Pingüino de Magallanes", latin: "Spheniscus magellanicus", emoji: "🐧" },
  { name: "Chincol",          latin: "Zonotrichia capensis",    emoji: "🐦" },
  { name: "Picaflor del Norte", latin: "Rhodopis vesper",       emoji: "🌺" },
  { name: "Cisne de Cuello Negro", latin: "Cygnus melancoryphus", emoji: "🦢" },
];

const FEATURES = [
  { icon: "👁️", title: "Registra tus avistamientos",  desc: "Lleva un diario de campo con lugar, fecha y fotos propias." },
  { icon: "🌐", title: "Feed comunitario en vivo",     desc: "Mira en tiempo real qué aves está viendo la comunidad en Chile." },
  { icon: "♥",  title: "Favoritas sincronizadas",     desc: "Tus aves favoritas disponibles en cualquier dispositivo." },
  { icon: "📊", title: "Tu progreso personal",        desc: "Cuántas has visto, cuántas te faltan y dónde las encontraste." },
  { icon: "🎵", title: "Cantos y grabaciones",        desc: "Escucha los cantos reales de cada especie desde Xeno-canto." },
  { icon: "🗺️", title: "Mapa de avistamientos",       desc: "Visualiza todos tus registros en un mapa de Chile." },
];

export default function Landing() {
  const { signInWithGoogle } = useAuth();

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", display: "flex", flexDirection: "column", overflowY: "auto" }}>

      {/* Header mínimo */}
      <header style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--border)", background: "var(--card)", flexShrink: 0 }}>
        <span style={{ fontSize: 24 }}>🦅</span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>Avesdex</div>
          <div style={{ fontSize: 10, color: "var(--ink-muted)", letterSpacing: "0.12em", fontFamily: "var(--font-mono)" }}>CHILE · 216 ESPECIES</div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ padding: "60px 24px 40px", textAlign: "center", maxWidth: 600, margin: "0 auto", width: "100%" }}>
        <div style={{ fontSize: 72, marginBottom: 16, lineHeight: 1 }}>🦜</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2, margin: "0 0 14px" }}>
          La guía de aves<br />
          <span style={{ color: "var(--accent)" }}>más completa de Chile</span>
        </h1>
        <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, margin: "0 0 32px" }}>
          216 especies con fotos, cantos y datos de campo. Registra tus avistamientos, 
          conecta con otros observadores y lleva tu lista personal de vida.
        </p>

        {/* CTA */}
        <button onClick={signInWithGoogle} style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: "var(--accent)", border: "none", borderRadius: 12,
          padding: "14px 28px", cursor: "pointer", fontSize: 15, fontWeight: 700,
          color: "#fff", fontFamily: "var(--font-body)",
          boxShadow: "0 4px 20px rgba(194,81,15,0.35)",
          transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(194,81,15,0.4)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(194,81,15,0.35)"; }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.5-8 19.5-20 0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.9 6l6.2 5.2C41.1 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continuar con Google
        </button>

        <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 12 }}>
          Gratis · Sin spam · Solo para observadores de aves
        </p>
      </div>

      {/* Preview aves */}
      <div style={{ padding: "0 24px 40px", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <p style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textAlign: "center", marginBottom: 14 }}>ALGUNAS ESPECIES DEL CATÁLOGO</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
          {PREVIEW_BIRDS.map((b) => (
            <div key={b.name} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{b.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name}</div>
                <div style={{ fontSize: 10, color: "var(--ink-muted)", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.latin}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "0 24px 60px", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <p style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textAlign: "center", marginBottom: 16 }}>QUÉ PUEDES HACER</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: "32px 24px 48px", textAlign: "center", borderTop: "1px solid var(--border)", background: "var(--card)" }}>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 16 }}>¿Listo para empezar tu lista de vida?</p>
        <button onClick={signInWithGoogle} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--accent)", border: "none", borderRadius: 10,
          padding: "12px 24px", cursor: "pointer", fontSize: 14, fontWeight: 600,
          color: "#fff", fontFamily: "var(--font-body)", transition: "opacity 0.15s",
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
        >
          Crear mi cuenta gratis →
        </button>
      </div>

    </div>
  );
}