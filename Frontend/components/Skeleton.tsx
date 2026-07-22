"use client";

import React from "react";
import { motion } from "framer-motion";

export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={`bg-skytint rounded-lg ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
        backgroundColor: ["var(--color-skytint)", "var(--color-bordermist)", "var(--color-skytint)"]
      }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    />
  );
}
