"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  studentId: string | null;
  role: "student" | "admin" | null;
  token: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  studentId: null,
  role: null,
  token: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [role, setRole] = useState<"student" | "admin" | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const idToken = await firebaseUser.getIdToken();
          setToken(idToken);

          // Sync with backend
          try {
            await fetch("http://localhost:8000/sync-user", {
              method: "POST",
              headers: { Authorization: `Bearer ${idToken}` },
            });
            const profileRes = await fetch("http://localhost:8000/student-profile", {
              headers: { Authorization: `Bearer ${idToken}` },
            });
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              setStudentId(profileData.student_id);
            } else {
              setStudentId("stu_" + firebaseUser.uid.slice(0, 8));
            }
          } catch {
            setStudentId("stu_" + firebaseUser.uid.slice(0, 8));
          }

          setRole(firebaseUser.email?.includes("admin") ? "admin" : "student");
        } catch (error) {
          console.error("Auth error:", error);
        }
      } else {
        setUser(null);
        setToken(null);
        setStudentId(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, studentId, role, token, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
