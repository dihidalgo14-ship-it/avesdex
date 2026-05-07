"use client";
import { useState, useEffect, useCallback } from "react";
import BirdList from "@/components/BirdList";
import BirdDetail from "@/components/BirdDetail";
import Header from "@/components/Header";
import CommunityFeed from "@/components/CommunityFeed";
import Landing from "@/components/Landing";
import { Bird, SortOption, FilterGroup } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";
import { useSightings } from "@/hooks/useSightings";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [birds, setBirds]           = useState<Bird[]>([]);
  const [filtered, setFiltered]     = useState<Bird[]>([]);
  const [selected, setSelected]     = useState<Bird | null>(null);
  const [search, setSearch]         = useState("");
  const [sort, setSort]             = useState<SortOption>("default");
  const [group, setGroup]           = useState<FilterGroup>("all");
  const [showDetail, setShowDetail] = useState(false);
  const [activeView, setActiveView] = useState<"list" | "feed">("list");
  const [loading, setLoading]       = useState(true);

  const { favs, toggle } = useFavorites();
  const { seenBirds }    = useSightings();

  useEffect(() => {
    if (!user) return;
    fetch("/api/birds")
      .then((r) => r.json())
      .then((data: Bird[]) => { setBirds(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    let list = [...birds];
    if (group === "favorites") list = list.filter((b) => favs.has(b.uid));
    if (group === "seen")      list = list.filter((b) => seenBirds.has(b.uid));
    if (group === "unseen")    list = list.filter((b) => !seenBirds.has(b.uid));
    const q = search.toLowerCase().trim();
    if (q) list = list.filter((b) =>
      b.name.spanish.toLowerCase().includes(q) ||
      b.name.latin.toLowerCase().includes(q) ||
      b.name.english.toLowerCase().includes(q)
    );
    switch (sort) {
      case "az":    list.sort((a, b) => a.name.spanish.localeCompare(b.name.spanish, "es")); break;
      case "za":    list.sort((a, b) => b.name.spanish.localeCompare(a.name.spanish, "es")); break;
      case "latin": list.sort((a, b) => a.name.latin.localeCompare(b.name.latin)); break;
    }
    setFiltered(list);
  }, [search, sort, group, birds, favs, seenBirds]);

  const handleSelect = useCallback((bird: Bird) => {
    setSelected(bird);
    setShowDetail(true);
    setActiveView("list");
    window.scrollTo(0, 0);
  }, []);

  const handleSelectByUid = useCallback((uid: string) => {
    const bird = birds.find((b) => b.uid === uid);
    if (bird) handleSelect(bird);
  }, [birds, handleSelect]);

  // Mostrar loading spinner mientras Firebase inicializa
  if (authLoading) {
    return (
      <div style={{ height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🦅</div>
          <div style={{ width: 32, height: 32, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Si no hay usuario → landing obligatoria
  if (!user) return <Landing />;

  // App principal
  return (
    <>
      <style>{`
        html, body { height: 100%; margin: 0; padding: 0; }
        .app-shell { display: flex; flex-direction: column; height: 100dvh; overflow: hidden; background: var(--bg); }
        .app-body  { flex: 1; display: flex; overflow: hidden; }
        .list-panel   { width: 300px; flex-shrink: 0; display: flex; flex-direction: column; overflow: hidden; border-right: 1px solid var(--border); }
        .detail-panel { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
        @media (max-width: 767px) {
          .list-panel   { width: 100%; display: ${showDetail ? "none" : "flex"}; }
          .detail-panel { display: ${showDetail ? "flex" : "none"}; width: 100%; }
        }
      `}</style>

      <div className="app-shell">
        <Header
          total={birds.length} showing={filtered.length}
          search={search} onSearch={setSearch}
          sort={sort} onSort={setSort}
          group={group} onGroup={setGroup}
          favCount={favs.size}
          showBack={showDetail} onBack={() => setShowDetail(false)}
          activeView={activeView} onViewChange={setActiveView}
        />
        <div className="app-body">
          {activeView === "feed" ? (
            <div style={{ flex: 1, overflow: "hidden" }}>
              <CommunityFeed onSelectBird={handleSelectByUid} />
            </div>
          ) : (
            <>
              <div className="list-panel">
                <BirdList
                  birds={filtered} selected={selected} loading={loading}
                  favorites={favs} seenBirds={seenBirds}
                  onSelect={handleSelect} onToggleFav={toggle}
                />
              </div>
              <div className="detail-panel">
                <BirdDetail
                  bird={selected}
                  index={selected ? birds.findIndex((b) => b.uid === selected.uid) : -1}
                  isFavorite={selected ? favs.has(selected.uid) : false}
                  isSeen={selected ? seenBirds.has(selected.uid) : false}
                  onToggleFav={toggle}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}