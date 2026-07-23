"use client";

import React from "react";
import { StudyBlock } from "./DayCard";
import { motion, AnimatePresence } from "framer-motion";

interface DailyScheduleBoardProps {
  date: string;
  blocks: StudyBlock[];
  onToggleTask?: (taskId: string) => void;
}

export function DailyScheduleBoard({ date, blocks, onToggleTask }: DailyScheduleBoardProps) {
  
  if (blocks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest border border-outline-variant rounded-3xl text-center shadow-sm"
      >
        <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
        </div>
        <h3 className="font-display-md text-on-surface mb-2">No Scheduled Tasks</h3>
        <p className="text-on-surface-variant max-w-sm mx-auto">Your schedule for {date} is clear. Take this time to rest, recharge, or regenerate your study plan.</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full relative rounded-[32px] overflow-hidden bg-surface-container-lowest border border-outline-variant shadow-lg group">
      {/* Premium Header with subtle gradient */}
      <div className="relative overflow-hidden px-8 py-10 bg-gradient-to-br from-primary-fixed to-tertiary-fixed border-b border-outline-variant">
        {/* Decorative background blurs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full mix-blend-overlay"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/5 blur-3xl rounded-full mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h4 className="text-primary font-bold tracking-wider text-sm uppercase mb-2">Daily Study Plan</h4>
            <h2 className="text-3xl md:text-5xl font-black text-on-surface tracking-tight">
              {date}
            </h2>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/50 shadow-sm flex flex-col items-center justify-center">
              <span className="text-xl font-black text-on-surface">{blocks.length}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">Sessions</span>
            </div>
            <div className="bg-white/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/50 shadow-sm flex flex-col items-center justify-center">
              <span className="text-xl font-black text-primary">
                {blocks.filter(b => b.is_done).length}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Timeline Layout */}
      <div className="p-8 md:p-12 relative bg-surface-container-lowest">
        {/* Vertical Timeline Line */}
        <div className="absolute left-8 md:left-[8.5rem] top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary/30 via-outline-variant to-transparent rounded-full"></div>

        <div className="flex flex-col gap-10 relative z-10">
          <AnimatePresence>
            {blocks.map((block, idx) => {
              const isDone = block.is_done;
              
              // Generate a mock time if not available, just to make the timeline look complete
              const startHour = 8 + (idx * 2); 
              const endHour = startHour + 1;
              const timeString = `${startHour > 12 ? startHour - 12 : startHour}:00 ${startHour >= 12 ? 'PM' : 'AM'} - ${endHour > 12 ? endHour - 12 : endHour}:00 ${endHour >= 12 ? 'PM' : 'AM'}`;
              
              return (
                <motion.div 
                  key={block.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex flex-col md:flex-row items-start gap-6 md:gap-12 relative"
                >
                  {/* Timeline Node & Time */}
                  <div className="flex items-center gap-6 md:w-32 md:shrink-0 md:justify-end z-10 bg-surface-container-lowest py-2">
                    <span className="text-sm font-bold text-on-surface-variant tracking-wider hidden md:block">
                      {block.duration || "1 hr"}
                    </span>
                    
                    {/* Node Dot */}
                    <div 
                      className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-sm
                        ${isDone 
                          ? 'bg-primary border-primary scale-110' 
                          : 'bg-surface border-outline-variant hover:border-primary'
                        }
                      `}
                    >
                      {isDone && <span className="material-symbols-outlined text-white text-[12px] font-black">check</span>}
                    </div>
                  </div>

                  {/* Task Card (Glassmorphism & Interactive) */}
                  <div 
                    onClick={() => onToggleTask && onToggleTask(block.id)}
                    className={`
                      flex-1 w-full rounded-2xl p-6 border transition-all duration-300 cursor-pointer relative overflow-hidden group
                      ${isDone 
                        ? 'bg-surface-container/50 border-transparent shadow-none opacity-60' 
                        : 'bg-surface border-outline-variant shadow-sm hover:shadow-md hover:border-primary hover:-translate-y-1'
                      }
                    `}
                  >
                    {/* Status indicator strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${isDone ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/50'}`}></div>

                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${isDone ? 'bg-surface-container-high text-on-surface-variant' : 'bg-primary-container text-on-primary-container'}`}>
                            {block.type || "Focus Session"}
                          </span>
                          {!isDone && (
                            <span className="text-xs font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-[14px]">touch_app</span> 
                              Mark Complete
                            </span>
                          )}
                        </div>
                        
                        <h3 className={`text-xl font-bold mb-2 transition-colors ${isDone ? 'text-on-surface-variant line-through decoration-2' : 'text-on-surface group-hover:text-primary'}`}>
                          {block.title}
                        </h3>
                        
                        {block.description && (
                          <p className="text-sm text-on-surface-variant line-clamp-2">
                            {block.description}
                          </p>
                        )}
                      </div>

                      {/* Right Action Button / Status */}
                      <div className="shrink-0 flex flex-col items-end">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-primary text-white' : 'bg-surface-container text-outline hover:bg-primary-container hover:text-primary'}`}>
                           <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                             {isDone ? 'done_all' : 'radio_button_unchecked'}
                           </span>
                        </div>
                        <span className="text-xs font-bold text-on-surface-variant mt-2 md:hidden">
                          {block.duration || "1 hr"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
