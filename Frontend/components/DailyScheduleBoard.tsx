"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { StudyBlock } from "./DayCard";

interface DailyScheduleBoardProps {
  date: string;
  blocks: StudyBlock[];
  onToggleTask?: (taskId: string) => void;
}

// Helper to generate sequential time slots
function generateTimeSlots(blocks: StudyBlock[]) {
  let currentHour = 6; // Start at 6:00 AM
  let currentMinute = 0;
  
  return blocks.map(block => {
    // Parse duration. e.g., "1 hr", "0.5 hr", "2 hr"
    let durHours = 1;
    if (block.duration) {
      const parsed = parseFloat(block.duration.split(' ')[0]);
      if (!isNaN(parsed)) durHours = parsed;
    }
    
    // Format start time
    const startPeriod = currentHour >= 12 ? "PM" : "AM";
    let dispStartHour = currentHour > 12 ? currentHour - 12 : currentHour;
    if (dispStartHour === 0) dispStartHour = 12;
    const dispStartMin = currentMinute.toString().padStart(2, '0');
    const startTimeStr = `${dispStartHour}:${dispStartMin} ${startPeriod}`;

    // Add duration
    let endHour = currentHour + Math.floor(durHours);
    let endMinute = currentMinute + (durHours % 1) * 60;
    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }

    // Format end time
    const endPeriod = endHour >= 12 && endHour < 24 ? "PM" : "AM";
    let dispEndHour = endHour > 12 ? endHour - 12 : endHour;
    if (dispEndHour === 0) dispEndHour = 12;
    const dispEndMin = endMinute.toString().padStart(2, '0');
    const endTimeStr = `${dispEndHour}:${dispEndMin} ${endPeriod}`;

    // Update current for next block
    currentHour = endHour;
    currentMinute = endMinute;

    return {
      ...block,
      timeSlot: `${startTimeStr} - ${endTimeStr}`
    };
  });
}

export function DailyScheduleBoard({ date, blocks, onToggleTask }: DailyScheduleBoardProps) {
  const blocksWithTime = useMemo(() => generateTimeSlots(blocks), [blocks]);

  // Fill up to a multiple of 5 for a perfect grid if needed
  const filledBlocks = [...blocksWithTime];
  const remainder = filledBlocks.length % 5;
  if (remainder !== 0 && filledBlocks.length > 0) {
    const toAdd = 5 - remainder;
    for (let i = 0; i < toAdd; i++) {
      filledBlocks.push({
        id: `empty-${i}`,
        title: "",
        type: "Empty",
        time: "",
        duration: "",
        colorClass: "",
        date: date,
        is_done: false,
        timeSlot: ""
      });
    }
  }

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-surface-container-lowest border border-outline-variant rounded-xl text-center">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">event_busy</span>
        <p className="font-bold text-on-surface">No tasks for {date}</p>
        <p className="text-sm text-on-surface-variant mt-1 mb-4">You have a free day! Relax and recharge.</p>
      </div>
    );
  }

  const redAccent = "#f87171"; // Tailwind red-400 equivalent for the schedule

  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mt-4 relative">
      {/* Top Banner Area */}
      <div className="bg-[#f0f0f0] pt-6 pb-8 relative flex items-center justify-center">
        <h2 className="text-3xl font-black tracking-widest uppercase text-gray-800">
          DAILY SCHEDULE <span className="text-lg text-gray-500 font-medium ml-2 capitalize">({date})</span>
        </h2>
      </div>

      {/* The Red Binder Strip */}
      <div className="h-6 w-full relative" style={{ backgroundColor: redAccent }}>
        {/* Binder Rings */}
        <div className="absolute -top-6 left-0 w-full flex justify-around px-8">
          {[1, 2, 3, 4, 5].map((ring) => (
            <div key={ring} className="w-4 h-10 bg-gray-400 rounded-full shadow-md z-10 border-2 border-gray-300"></div>
          ))}
        </div>
      </div>

      {/* Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-5 border-l-4 border-r-4 border-b-4 bg-white" style={{ borderColor: redAccent }}>
        {filledBlocks.map((block, idx) => {
          const isRightCol = (idx + 1) % 5 === 0;
          const isBottomRow = idx >= filledBlocks.length - 5;
          const isEmpty = block.type === "Empty";

          return (
            <div 
              key={block.id} 
              onClick={() => !isEmpty && onToggleTask && onToggleTask(block.id)}
              className={`
                min-h-[140px] p-4 flex flex-col items-center text-center relative
                ${!isRightCol ? 'border-r-4' : ''} 
                ${!isBottomRow ? 'border-b-4' : ''}
                ${!isEmpty ? 'cursor-pointer hover:bg-red-50 transition-colors' : ''}
                ${block.is_done ? 'bg-gray-100 opacity-70' : ''}
              `}
              style={{ borderColor: redAccent }}
            >
              {!isEmpty && (
                <>
                  <div className="font-bold text-sm mb-2" style={{ color: redAccent }}>
                    {block.timeSlot}
                  </div>
                  <div className={`text-sm text-gray-800 font-medium ${block.is_done ? 'line-through text-gray-500' : ''}`}>
                    <span className="block mb-1 font-bold text-gray-900">{block.type}</span>
                    {block.title}
                  </div>
                  {block.is_done && (
                    <div className="absolute top-2 right-2 text-green-500">
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
