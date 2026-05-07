"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User, onAuthStateChanged, signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await ensureUserDoc(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function ensureUserDoc(u: User) {
    const ref  = doc(db, "users", u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        displayName: u.displayName,
        email:       u.email,
        photoURL:    u.photoURL,
        totalSeen:   0,
        isPublic:    true,
        joinedAt:    serverTimestamp(),
      });
    }
  }

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
      // Migrate localStorage favorites to Firestore
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("avesdex-favs");
        if (stored) {
          const uids: string[] = JSON.parse(stored);
          const u = auth.currentUser;
          if (u && uids.length > 0) {
            const { writeBatch, doc: fbDoc, collection, serverTimestamp: st } = await import("firebase/firestore");
            const batch = writeBatch(db);
            uids.forEach((uid) => {
              const ref = fbDoc(collection(db, "users", u.uid, "favorites"), uid);
              batch.set(ref, { birdUid: uid, createdAt: st() }, { merge: true });
            });
            await batch.commit();
            localStorage.removeItem("avesdex-favs");
          }
        }
      }
    } catch (e) {
      console.error("Google sign in error:", e);
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
