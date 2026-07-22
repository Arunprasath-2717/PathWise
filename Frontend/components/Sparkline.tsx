"use client";

import React from "react";
import { motion } from "framer-motion";

interface SparklineProps {
  data: number[]; // Array of values to plot
  color?: string; // Tailwind color variable e.g., var(--color-primary)
}

export function Sparkline({ data, color = "var(--color-primary)" }: SparklineProps) {
  // Simple normalization to fit in a 100x30 viewBox
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" L ");

  const pathD = `M ${points}`;

  return (
    <div className="w-full h-16 flex items-end">
      <svg viewBox={`0 -5 ${width} ${height + 10}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
