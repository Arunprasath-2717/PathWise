"use client";

import React from "react";
import { motion } from "framer-motion";

export function StreakBadge({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-error-container rounded-full border border-error/20">
      <motion.span 
        className="material-symbols-outlined text-error" 
        data-icon="local_fire_department" 
        style={{ fontVariationSettings: "'FILL' 1" }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
      >
        local_fire_department
      </motion.span>
      <span className="font-label-md text-label-md text-on-error-container font-bold">{streak} Day Streak</span>
    </div>
  );
}
