"use client";
import { useFeed } from "@/hooks/useFeed";

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60)   return "hace un momento";
  if (s < 3600) return `hace ${Math.floor(s / 60)}m`;
  if (s < 86400) return `hace ${Math.floor(s / 3600)}h`;
  return `hace ${Math.floor(s / 86400)}d`;
}

export default function CommunityFeed({ onSelectBird }: { onSelectBird?: (uid: string) => void }) {
  const { feed, loading } = useFeed(30);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "ping-slow 2s ease infinite" }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>Feed comunitario</span>
        <span style={{ fontSize: 11, color: "var(--ink-muted)", marginLeft: "auto" }}>{feed.length} avistamientos recientes</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 10 }}>
              <div className="skeleton" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 11, width: "70%", marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 9, width: "50%" }} />
              </div>
            </div>
          ))
        ) : feed.length === 0 ? (
          <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--ink-muted)", fontSize: 13 }}>
            <div style={{ fontSize: 40, marginBottom: 8, opacity: 0.2 }}>🌿</div>
            Sé el primero en registrar un avistamiento
          </div>
        ) : feed.map((item) => (
          <div key={item.id}
            onClick={() => onSelectBird?.(item.birdUid)}
            style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 10, cursor: onSelectBird ? "pointer" : "default", transition: "background 0.12s" }}
            onMouseEnter={(e) => { if (onSelectBird) (e.currentTarget as HTMLDivElement).style.background = "var(--bg-warm)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
          >
            {/* User avatar */}
            <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, overflow: "hidden", border: "1.5px solid var(--border)" }}>
              {item.userPhoto
                ? <img src={item.userPhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", background: "var(--accent-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
              }
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.4 }}>
                <span style={{ fontWeight: 500 }}>{item.userName}</span>
                <span style={{ color: "var(--ink-muted)" }}> vio un </span>
                <span style={{ fontWeight: 500, color: "var(--accent)" }}>{item.birdName}</span>
              </div>
              {item.location && (
                <div style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 3 }}>
                  📍 {item.location}
                </div>
              )}
              {item.notes && (
                <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 3, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  "{item.notes}"
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              {item.birdThumb && (
                <img src={item.birdThumb} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", border: "1px solid var(--border)" }} />
              )}
              <span style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
                {item.seenAt instanceof Date ? timeAgo(item.seenAt) : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
