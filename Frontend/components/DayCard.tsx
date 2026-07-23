"use client";

import React from "react";
import { motion } from "framer-motion";

export interface StudyBlock {
  id: string;
  title: string;
  type: string;
  time: string;
  duration: string;
  colorClass: string;
  date: string;
  is_done: boolean;
}

interface DayCardProps {
  day: string;
  date: string;
  isToday?: boolean;
  blocks: StudyBlock[];
  onToggleTask?: (taskId: string) => void;
}

export function DayCard({ day, date, isToday = false, blocks, onToggleTask }: DayCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      className={`bg-surface-container-lowest flex flex-col gap-4 rounded-xl p-4 shrink-0 w-[260px] ${
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
      
      {blocks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-outline-variant rounded-lg bg-surface-container-low">
          <span className="material-symbols-outlined text-outline mb-1 text-[20px]">free_breakfast</span>
          <span className="text-xs text-on-surface-variant font-medium">No tasks</span>
        </div>
      ) : (
        blocks.map((block) => {
          let bg = block.is_done ? "bg-green-500/10" : "bg-[#E0F2F1]";
          let border = block.is_done ? "border-green-500" : "border-[#00796B]";
          let text = block.is_done ? "text-green-700" : "text-[#004D40]";
          let iconColor = block.is_done ? "text-green-600" : "text-[#00796B]";
          let icon = block.is_done ? "check_circle" : "memory";
          
          if (!block.is_done) {
            if (block.type === "Practice") {
              bg = "bg-[#FFF3E0]"; border = "border-[#F57C00]"; text = "text-[#E65100]"; iconColor = "text-[#F57C00]"; icon = "code";
            } else if (block.type === "Assignment") {
              bg = "bg-[#FFEBEE]"; border = "border-[#D32F2F]"; text = "text-[#B71C1C]"; iconColor = "text-[#D32F2F]"; icon = "architecture";
            }
          }

          return (
            <motion.div
              key={block.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onToggleTask && onToggleTask(block.id)}
              className={`p-3 rounded-lg ${bg} border-l-4 ${border} flex flex-col gap-1 cursor-pointer transition-shadow`}
            >
              <span className={`material-symbols-outlined ${iconColor} text-[18px]`}>{icon}</span>
              <p className={`font-label-md text-label-md ${text} font-bold leading-tight ${block.is_done ? 'line-through opacity-75' : ''}`}>
                {block.title}
              </p>
              <span className={`text-[10px] ${iconColor} font-semibold ${block.is_done ? 'opacity-75' : ''}`}>
                {block.time} ({block.duration})
              </span>
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
}
