import React from "react";
import { motion } from "framer-motion";

interface StatusPillProps {
  status: "strong" | "average" | "weak";
}

export function StatusPill({ status }: StatusPillProps) {
  const configs = {
    strong: {
      bg: "bg-[#E1F5FE]",
      text: "text-primary",
      border: "border-primary/10",
      dot: "bg-primary",
      label: "Strong",
    },
    average: {
      bg: "bg-[#FFF8E1]",
      text: "text-[#B8860B]",
      border: "border-amber-200",
      dot: "bg-amber-500",
      label: "Average",
    },
    weak: {
      bg: "bg-error-container",
      text: "text-error",
      border: "border-error/10",
      dot: "bg-error",
      label: "Weak",
    },
  };

  const config = configs[status];

  return (
    <div className={`px-3 py-1 ${config.bg} ${config.text} rounded-full text-[12px] font-bold border ${config.border} flex items-center gap-1 transition-colors duration-150`}>
      <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
      {config.label}
    </div>
  );
}
