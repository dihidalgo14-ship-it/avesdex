"use client";
import { useState, useEffect, useCallback } from "react";
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

export function useFavorites() {
  const { user } = useAuth();
  const [favs, setFavs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      // fallback: localStorage when not logged in
      try {
        setFavs(new Set(JSON.parse(localStorage.getItem("avesdex-favs") || "[]")));
      } catch {}
      return;
    }
    // Realtime listener from Firestore
    const ref = collection(db, "users", user.uid, "favorites");
    const unsub = onSnapshot(ref, (snap) => {
      setFavs(new Set(snap.docs.map((d) => d.id)));
    });
    return unsub;
  }, [user]);

  const toggle = useCallback(async (birdUid: string) => {
    if (!user) {
      // localStorage fallback
      setFavs((prev) => {
        const next = new Set(prev);
        next.has(birdUid) ? next.delete(birdUid) : next.add(birdUid);
        localStorage.setItem("avesdex-favs", JSON.stringify([...next]));
        return next;
      });
      return;
    }
    const ref = doc(db, "users", user.uid, "favorites", birdUid);
    if (favs.has(birdUid)) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { birdUid, createdAt: serverTimestamp() });
    }
  }, [user, favs]);

  return { favs, toggle };
}
