"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";

interface ProgressRingProps {
  percentage: number;
  label: string;
}

export function ProgressRing({ percentage, label }: ProgressRingProps) {
  const shouldReduceMotion = useReducedMotion();
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (percentage / 100) * circumference;
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, percentage, {
      duration: shouldReduceMotion ? 0 : 0.8,
      ease: "easeOut"
    });
    return animation.stop;
  }, [percentage, count, shouldReduceMotion]);

  return (
    <div className="relative w-40 h-40 flex items-center justify-center mb-lg">
      <svg className="w-full h-full transform -rotate-90">
        <circle 
          className="text-skytint" 
          cx="80" 
          cy="80" 
          fill="transparent" 
          r={radius} 
          stroke="currentColor" 
          strokeWidth="8"
        />
        <motion.circle 
          className="text-primary stroke-round" 
          cx="80" 
          cy="80" 
          fill="transparent" 
          r={radius} 
          stroke="currentColor" 
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeWidth="10"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display-lg text-[40px] text-primary leading-none flex items-baseline">
          <motion.span>{rounded}</motion.span>
          <span className="text-[20px]">%</span>
        </span>
        <span className="text-[12px] font-bold text-on-surface-variant">{label}</span>
      </div>
    </div>
  );
}
