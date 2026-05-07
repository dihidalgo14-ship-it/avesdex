"use client";
import { useState } from "react";
import { SortOption, FilterGroup } from "@/types";
import { useAuth } from "@/lib/AuthContext";
import { useSightings } from "@/hooks/useSightings";
import UserProfile from "./UserProfile";

interface Props {
  total: number; showing: number;
  search: string; onSearch: (v: string) => void;
  sort: SortOption; onSort: (v: SortOption) => void;
  group: FilterGroup; onGroup: (v: FilterGroup) => void;
  favCount: number;
  showBack: boolean; onBack: () => void;
  activeView: "list" | "feed";
  onViewChange: (v: "list" | "feed") => void;
}

export default function Header({ total, showing, search, onSearch, sort, onSort, group, onGroup, favCount, showBack, onBack, activeView, onViewChange }: Props) {
  const { user, signInWithGoogle, loading } = useAuth();
  const { seenBirds } = useSightings();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header style={{ flexShrink: 0, background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, height: 52 }}>

          {/* Mobile back */}
          {showBack && (
            <button onClick={onBack} className="mobile-back" style={{
              display: "none", alignItems: "center", gap: 6, background: "none", border: "none",
              cursor: "pointer", color: "var(--accent)", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", padding: "6px 0",
            }}>← Catálogo</button>
          )}

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ fontSize: 22 }}>🦅</div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1 }}>Avesdex</div>
              <div style={{ fontSize: 9, color: "var(--ink-muted)", letterSpacing: "0.12em", fontFamily: "var(--font-mono)", lineHeight: 1, marginTop: 2 }}>CHILE · {total} ESPECIES</div>
            </div>
          </div>

          <div style={{ width: 1, height: 28, background: "var(--border)", flexShrink: 0 }} />

          {/* View toggle: Catálogo / Feed */}
          <div style={{ display: "flex", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
            {(["list", "feed"] as const).map((v) => (
              <button key={v} onClick={() => onViewChange(v)} style={{
                padding: "5px 12px", fontSize: 12, border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)", fontWeight: 500, transition: "all 0.15s",
                background: activeView === v ? "var(--accent)" : "transparent",
                color: activeView === v ? "#fff" : "var(--ink-soft)",
              }}>
                {v === "list" ? "🗂 Catálogo" : "🌐 Feed"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative", flex: 1, maxWidth: 340 }} className="desktop-search">
            <input
              type="text" value={search} placeholder="Buscar ave..."
              onChange={(e) => onSearch(e.target.value)}
              style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 28px 7px 10px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-body)", outline: "none", transition: "border-color 0.15s" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            {search && <button onClick={() => onSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-muted)", fontSize: 16 }}>×</button>}
          </div>

          {/* Sort + Filter — desktop only */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }} className="desktop-controls">
            <select value={sort} onChange={(e) => onSort(e.target.value as SortOption)}
              style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--ink-soft)", fontFamily: "var(--font-mono)", fontSize: 11, padding: "6px 8px", outline: "none", cursor: "pointer" }}>
              <option value="default">Original</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
              <option value="latin">Latín</option>
            </select>

            <div style={{ display: "flex", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
              {(["all", "seen", "unseen", "favorites"] as const).map((g) => {
                const labels: Record<string, string> = { all: "Todas", seen: `✓ Vistas (${seenBirds.size})`, unseen: "Pendientes", favorites: `♥ (${favCount})` };
                return (
                  <button key={g} onClick={() => onGroup(g as FilterGroup)} style={{
                    padding: "5px 10px", fontSize: 11, border: "none", cursor: "pointer",
                    fontFamily: "var(--font-body)", fontWeight: 500, transition: "all 0.15s",
                    background: group === g ? "var(--accent)" : "transparent",
                    color: group === g ? "#fff" : "var(--ink-soft)",
                  }}>{labels[g]}</button>
                );
              })}
            </div>

            <div style={{ fontSize: 11, color: "var(--ink-muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>{showing}/{total}</div>
          </div>

          {/* Auth */}
          {!loading && (
            user ? (
              <button onClick={() => setShowProfile(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 10px", cursor: "pointer", flexShrink: 0, transition: "border-color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}>
                <img src={user.photoURL || ""} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
                <span style={{ fontSize: 12, color: "var(--ink)", fontWeight: 500 }} className="desktop-name">{user.displayName?.split(" ")[0]}</span>
                {seenBirds.size > 0 && <span style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>{seenBirds.size}</span>}
              </button>
            ) : (
              <button onClick={signInWithGoogle} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent)", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", flexShrink: 0 }}>
                <span style={{ fontSize: 14 }}>G</span>
                <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }} className="desktop-name">Entrar</span>
              </button>
            )
          )}
        </div>
      </header>

      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}

      <style>{`
        @media (max-width: 767px) {
          .desktop-controls { display: none !important; }
          .desktop-search { display: none !important; }
          .desktop-name { display: none !important; }
          .mobile-back { display: flex !important; }
        }
      `}</style>
    </>
  );
}
