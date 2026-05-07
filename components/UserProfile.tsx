"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { useSightings } from "@/hooks/useSightings";
import { useFavorites } from "@/hooks/useFavorites";

export default function UserProfile({ onClose }: { onClose: () => void }) {
  const { user, signOut }    = useAuth();
  const { sightings }        = useSightings();
  const { favs }             = useFavorites();
  const [totalSeen, setTotal] = useState(0);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((d) => {
      if (d.exists()) setTotal(d.data().totalSeen || 0);
    });
  }, [user, sightings]);

  if (!user) return null;

  const recentSightings = [...sightings]
    .sort((a, b) => b.seenAt.getTime() - a.seenAt.getTime())
    .slice(0, 5);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 16 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--card)", borderRadius: 16, padding: 0, width: 340, marginTop: 52, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "var(--accent-bg)", padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={user.photoURL || ""} alt="" style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid var(--accent)" }} />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{user.displayName}</div>
              <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{user.email}</div>
            </div>
            <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--ink-faint)" }}>×</button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 16 }}>
            {[
              { label: "Vistas", value: sightings.length, icon: "👁️" },
              { label: "Favoritas", value: favs.size, icon: "♥" },
              { label: "De 216", value: `${Math.round((sightings.length / 216) * 100)}%`, icon: "🏆" },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ background: "var(--card)", borderRadius: 8, padding: "8px 10px", textAlign: "center", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 16 }}>{icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)", lineHeight: 1.2, marginTop: 2 }}>{value}</div>
                <div style={{ fontSize: 10, color: "var(--ink-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent sightings */}
        <div style={{ padding: "14px 20px" }}>
          <div style={{ fontSize: 11, color: "var(--ink-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 10 }}>AVISTAMIENTOS RECIENTES</div>
          {recentSightings.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--ink-muted)", fontStyle: "italic" }}>Aún no has registrado avistamientos</p>
          ) : recentSightings.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
              {s.birdThumb && <img src={s.birdThumb} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover" }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.birdName}</div>
                {s.location && <div style={{ fontSize: 10, color: "var(--ink-muted)" }}>📍 {s.location}</div>}
              </div>
              <div style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                {s.seenAt instanceof Date ? s.seenAt.toLocaleDateString("es-CL", { day: "numeric", month: "short" }) : ""}
              </div>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
          <button onClick={async () => { await signOut(); onClose(); }}
            style={{ width: "100%", padding: "9px", border: "1px solid var(--border)", borderRadius: 8, background: "none", cursor: "pointer", fontSize: 13, color: "var(--ink-muted)", fontFamily: "var(--font-body)" }}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
