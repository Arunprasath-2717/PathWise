"use client";

import React from "react";
import { StudyBlock } from "./DayCard";
import { motion } from "framer-motion";

interface DailyScheduleBoardProps {
  date: string;
  blocks: StudyBlock[];
  onToggleTask?: (taskId: string) => void;
}

export function DailyScheduleBoard({ date, blocks, onToggleTask }: DailyScheduleBoardProps) {
  
  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-surface-container-lowest border border-outline-variant rounded-xl text-center">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">event_busy</span>
        <p className="font-bold text-on-surface">No tasks for {date}</p>
        <p className="text-sm text-on-surface-variant mt-1 mb-4">You have a free day! Relax and recharge.</p>
      </div>
    );
  }

  // Derive today's unique subjects
  const subjects = Array.from(new Set(blocks.map(b => b.type || "General"))).join(", ");
  
  // Decorative paw print SVG for the goals
  const PawPrint = () => (
    <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.5 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm11 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 13.5A4.5 4.5 0 0 0 12 18a4.5 4.5 0 0 0 4-4.5 4.5 4.5 0 0 0-3-4.24v-.26A2.5 2.5 0 0 0 12 6.5a2.5 2.5 0 0 0-1 4.74v.26A4.5 4.5 0 0 0 8 13.5zm4 7.5a6 6 0 0 1-5.66-4h11.32A6 6 0 0 1 12 21z" />
    </svg>
  );

  return (
    <div className="w-full bg-[#f2f4f6] rounded-[32px] p-8 md:p-12 shadow-xl overflow-hidden relative font-sans text-gray-800">
      
      {/* --- Decorative Elements Background --- */}
      {/* Polaroid string top left */}
      <div className="absolute top-0 left-0 w-64 h-32 opacity-80 pointer-events-none">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path d="M 0 30 Q 100 50 200 20" fill="none" stroke="#4a5568" strokeWidth="2" />
          <rect x="20" y="32" width="24" height="28" fill="white" transform="rotate(-10 32 46)" />
          <rect x="23" y="35" width="18" height="18" fill="#4fd1c5" transform="rotate(-10 32 46)" />
          <rect x="70" y="42" width="24" height="28" fill="white" transform="rotate(5 82 56)" />
          <rect x="73" y="45" width="18" height="18" fill="#fc8181" transform="rotate(5 82 56)" />
        </svg>
      </div>

      {/* Moon and clouds top right */}
      <div className="absolute top-6 right-6 w-32 h-24 opacity-90 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M 60 40 A 20 20 0 0 1 80 20 A 25 25 0 1 0 40 50 A 20 20 0 0 1 60 40 Z" fill="#fbd38d" />
          <path d="M 30 60 Q 40 45 55 55 Q 70 40 85 55 Q 100 65 90 75 L 20 75 Q 10 65 30 60 Z" fill="#2b6cb0" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-center text-4xl md:text-5xl font-black text-gray-800 tracking-[0.2em] mb-12 uppercase drop-shadow-sm" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif" }}>
        DAILY STUDY PLAN
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 relative z-10">
        
        {/* Left Column (Date, Subject, Goals) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Date Box */}
          <div className="flex bg-white rounded-md overflow-hidden shadow-sm h-12">
            <div className="bg-[#8bbbb7] text-white font-bold tracking-widest px-4 py-3 flex items-center justify-center text-sm">
              DATE
            </div>
            <div className="flex-1 px-4 py-3 text-gray-600 font-medium flex items-center">
              {date}
            </div>
          </div>

          {/* Today Subject Box */}
          <div className="bg-white rounded-md shadow-sm p-5 h-36 relative"
               style={{ backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
            <h3 className="uppercase tracking-widest font-bold text-sm mb-3">Today Subject</h3>
            <div className="text-gray-700 font-medium leading-relaxed bg-white/60 inline-block px-2 rounded">
              {subjects}
            </div>
          </div>

          {/* Study Session Goal Box */}
          <div className="bg-white rounded-md shadow-sm p-5 flex-1 min-h-[220px]">
            <h3 className="uppercase tracking-widest font-bold text-sm mb-6">Study Session Goal</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <PawPrint />
                  {blocks[i] ? (
                    <span className="text-sm font-medium text-gray-700 truncate">{blocks[i].type || "Focus"}</span>
                  ) : (
                    <div className="flex-1 border-b-2 border-dashed border-gray-200 h-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Hourly Timetable) */}
        <div className="lg:col-span-7 bg-white rounded-md shadow-sm p-8 relative min-h-[400px]">
          {/* Teal Tape Top Right */}
          <div className="absolute -top-3 right-8 w-24 h-6 bg-[#a2d4cf] transform rotate-2 opacity-80 mix-blend-multiply"></div>
          
          <div className="space-y-[1.8rem] mt-2">
            {[
              "7-8 AM", "8-9 AM", "9-10 AM", "10-11 AM", "11-12 AM", 
              "12-1 PM", "1-2 PM", "2-3 PM", "3-4 PM", "4-5 PM"
            ].map((time) => (
              <div key={time} className="flex items-end group">
                <span className="w-20 text-xs font-bold text-gray-500 tracking-wider flex-shrink-0">
                  {time}
                </span>
                <div className="flex-1 border-b-2 border-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Task Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden mb-6 relative z-10">
        
        {/* Table Header */}
        <div className="bg-[#8bbbb7] text-white flex px-6 py-3 font-bold tracking-widest text-sm uppercase">
          <div className="w-12 text-center">✓</div>
          <div className="flex-1 text-center">TASKS</div>
          <div className="w-32 text-center border-l-2 border-white/30 pl-4">TIMES</div>
        </div>

        {/* Table Rows (Dynamic based on blocks) */}
        <div className="flex flex-col">
          {/* Create at least 7 rows to match the image's height */}
          {Array.from({ length: Math.max(7, blocks.length) }).map((_, i) => {
            const block = blocks[i];
            const isDone = block?.is_done;
            
            return (
              <div key={block?.id || `empty-${i}`} className="flex border-b border-gray-200 min-h-[3.5rem] group">
                
                {/* Checkbox Column */}
                <div className="w-16 flex items-center justify-center border-r-2 border-dashed border-gray-200 relative">
                  <div 
                    onClick={() => block && onToggleTask && onToggleTask(block.id)}
                    className={`w-5 h-5 rounded-[4px] border-[2.5px] border-[#a2d4cf] flex items-center justify-center cursor-pointer transition-colors ${isDone ? 'bg-[#a2d4cf]' : 'hover:bg-[#e6f2f0]'}`}
                  >
                    {isDone && <span className="text-white text-xs font-black">✓</span>}
                  </div>
                </div>
                
                {/* Task Title Column */}
                <div 
                  onClick={() => block && onToggleTask && onToggleTask(block.id)}
                  className={`flex-1 px-6 py-3 flex items-center cursor-pointer transition-colors ${block ? 'hover:bg-gray-50' : ''}`}
                >
                  {block && (
                    <span className={`font-medium text-gray-700 ${isDone ? 'line-through text-gray-400' : ''}`}>
                      {block.title}
                    </span>
                  )}
                </div>
                
                {/* Time/Duration Column */}
                <div className="w-32 border-l-2 border-dashed border-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                  {block?.duration || (block && "1 hr") || ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Decorative Bottom Elements */}
      <div className="absolute bottom-6 left-8 flex items-center gap-2 opacity-80 pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-rose-400" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-4 w-24 h-24 opacity-80 pointer-events-none transform -rotate-12 translate-y-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M 10 80 L 80 20 L 90 40 L 40 90 Z" fill="#4a90e2" />
          <path d="M 40 90 L 90 40 L 100 60 L 50 100 Z" fill="#2c5282" />
        </svg>
      </div>
      
    </div>
  );
}
