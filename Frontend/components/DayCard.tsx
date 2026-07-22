"use client";

import React from "react";
import { motion } from "framer-motion";
import { StudyBlock } from "@/lib/mock-data";

interface DayCardProps {
  day: string;
  date: string;
  isToday?: boolean;
  blocks: StudyBlock[];
}

export function DayCard({ day, date, isToday = false, blocks }: DayCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      className={`bg-surface-container-lowest flex flex-col gap-4 rounded-xl p-4 ${
        isToday ? "border-2 border-primary ring-4 ring-primary/10" : "border border-outline-variant"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className={`font-label-md text-label-md uppercase ${isToday ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
          {day} {isToday && "(Today)"}
        </span>
        <span className={`font-label-sm text-label-sm ${isToday ? 'text-primary font-bold' : 'text-outline'}`}>
          {date}
        </span>
      </div>
      
      {blocks.map((block) => {
        // Quick map for demo purposes based on type to colors
        let bg = "bg-[#E0F2F1]";
        let border = "border-[#00796B]";
        let text = "text-[#004D40]";
        let iconColor = "text-[#00796B]";
        let icon = "memory";
        
        if (block.type === "Practice") {
          bg = "bg-[#FFF3E0]";
          border = "border-[#F57C00]";
          text = "text-[#E65100]";
          iconColor = "text-[#F57C00]";
          icon = "code";
        } else if (block.type === "Assignment") {
          bg = "bg-[#FFEBEE]";
          border = "border-[#D32F2F]";
          text = "text-[#B71C1C]";
          iconColor = "text-[#D32F2F]";
          icon = "architecture";
        }

        return (
          <motion.div
            key={block.id}
            whileHover={{ scale: 1.02 }}
            className={`p-3 rounded-lg ${bg} border-l-4 ${border} flex flex-col gap-1 cursor-grab active:cursor-grabbing transition-shadow`}
          >
            <span className={`material-symbols-outlined ${iconColor} text-[18px]`}>{icon}</span>
            <p className={`font-label-md text-label-md ${text} font-bold leading-tight`}>{block.title}</p>
            <span className={`text-[10px] ${iconColor} font-semibold`}>{block.time} ({block.duration})</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
