"use client";
import { useState, useEffect, useCallback } from "react";
import {
  collection, doc, addDoc, deleteDoc, query,
  where, onSnapshot, serverTimestamp, updateDoc, increment,
  GeoPoint,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

export interface Sighting {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  birdUid: string;
  birdName: string;
  birdThumb: string;
  seenAt: Date;
  location: string;
  lat?: number;
  lon?: number;
  notes: string;
  photoURL?: string;
  isPublic: boolean;
}

export function useSightings() {
  const { user } = useAuth();
  const [seenBirds, setSeenBirds] = useState<Set<string>>(new Set());
  const [sightings, setSightings] = useState<Sighting[]>([]);

  useEffect(() => {
    if (!user) { setSeenBirds(new Set()); setSightings([]); return; }
    const q = query(collection(db, "sightings"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list: Sighting[] = snap.docs.map((d) => ({
        id: d.id, ...d.data(),
        seenAt: d.data().seenAt?.toDate?.() || new Date(),
      } as Sighting));
      setSightings(list);
      setSeenBirds(new Set(list.map((s) => s.birdUid)));
    });
    return unsub;
  }, [user]);

  const addSighting = useCallback(async (data: {
    birdUid: string; birdName: string; birdThumb: string;
    location: string; lat?: number; lon?: number;
    notes: string; isPublic: boolean; photo?: File;
  }) => {
    if (!user) return;

    let photoURL: string | undefined;
    if (data.photo) {
      const path = `sightings/${user.uid}/${Date.now()}_${data.photo.name}`;
      const snap = await uploadBytes(storageRef(storage, path), data.photo);
      photoURL = await getDownloadURL(snap.ref);
    }

    const sighting = {
      userId:    user.uid,
      userName:  user.displayName || "Anónimo",
      userPhoto: user.photoURL || "",
      birdUid:   data.birdUid,
      birdName:  data.birdName,
      birdThumb: data.birdThumb,
      seenAt:    serverTimestamp(),
      location:  data.location,
      ...(data.lat && data.lon ? { geoPoint: new GeoPoint(data.lat, data.lon) } : {}),
      notes:     data.notes,
      isPublic:  data.isPublic,
      ...(photoURL ? { photoURL } : {}),
    };

    await addDoc(collection(db, "sightings"), sighting);

    // Write to public feed if public
    if (data.isPublic) {
      await addDoc(collection(db, "feed"), {
        ...sighting,
        createdAt: serverTimestamp(),
      });
    }

    // Increment user total
    await updateDoc(doc(db, "users", user.uid), {
      totalSeen: increment(1),
    });
  }, [user]);

  const removeSighting = useCallback(async (sightingId: string) => {
    await deleteDoc(doc(db, "sightings", sightingId));
  }, []);

  return { seenBirds, sightings, addSighting, removeSighting };
}
