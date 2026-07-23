"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatusPill } from "./StatusPill";
import { Subject } from "@/lib/mock-data";

export function SubjectCard({ subject }: { subject: Subject }) {
  const getScoreColor = (status: string) => {
    switch (status) {
      case "strong": return "text-primary";
      case "average": return "text-[#B8860B]";
      case "weak": return "text-error";
      default: return "text-primary";
    }
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "strong": return "bg-primary/10 text-primary";
      case "average": return "bg-secondary/10 text-secondary";
      case "weak": return "bg-tertiary/10 text-tertiary";
      default: return "bg-primary/10 text-primary";
    }
  };

  const getBgClass = (status: string) => {
    if (status === "average") return "bg-surface-container-low";
    return "bg-surface-container-lowest";
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      className={`${getBgClass(subject.status)} border border-bordermist rounded-2xl p-lg flex flex-col justify-between h-48 transition-colors hover:border-primary`}
    >
      <div>
        <div className="flex justify-between items-start mb-base">
          <h4 className="font-headline-md text-[18px] font-bold text-on-surface">{subject.name}</h4>
          <span className={`px-3 py-1 font-bold rounded-full text-[10px] tracking-wide ${getBadgeStyle(subject.status)}`}>
            {subject.code}
          </span>
        </div>
        <p className="text-on-surface-variant text-[13px] leading-relaxed">
          {subject.status === "strong" && "Complexity analysis & algorithms."}
          {subject.status === "average" && "Electromagnetism & Circuits."}
          {subject.status === "weak" && "Vector spaces & matrices."}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <StatusPill status={subject.status} />
        <span className={`font-display-lg text-[20px] ${getScoreColor(subject.status)}`}>
          {subject.score}%
        </span>
      </div>
    </motion.div>
  );
}
