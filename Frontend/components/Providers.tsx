"use client";

import { MotionConfig } from "framer-motion";
import { AuthProvider } from "./AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </AuthProvider>
  );
}
