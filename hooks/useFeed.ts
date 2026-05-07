"use client";
import { useState, useEffect } from "react";
import {
  collection, query, orderBy, limit, onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Sighting } from "./useSightings";

export function useFeed(maxItems = 20) {
  const [feed, setFeed]       = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "feed"),
      orderBy("createdAt", "desc"),
      limit(maxItems)
    );
    const unsub = onSnapshot(q, (snap) => {
      setFeed(snap.docs.map((d) => ({
        id: d.id, ...d.data(),
        seenAt: d.data().createdAt?.toDate?.() || new Date(),
      } as Sighting)));
      setLoading(false);
    });
    return unsub;
  }, [maxItems]);

  return { feed, loading };
}
