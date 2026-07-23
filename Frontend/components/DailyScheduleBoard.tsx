"use client";

import React, { useMemo } from "react";
import { StudyBlock } from "./DayCard";

interface DailyScheduleBoardProps {
  date: string;
  blocks: StudyBlock[];
  onToggleTask?: (taskId: string) => void;
}

const TEMPLATE_SLOTS = [
  { time: "6:00 AM - 6:30 AM", type: "Morning Routine", text: "Personal hygiene and light stretching or meditation", isStudy: false },
  { time: "6:30 AM - 7:00 AM", type: "Review", text: "Review yesterday's notes or study material", isStudy: false },
  { time: "7:00 AM - 10:00 AM", type: "Deep Focus", text: "Choose a subject, focus on concepts and solving problems", isStudy: true },
  { time: "10:00 AM - 10:30 AM", type: "Break", text: "Take a short break for breakfast", isStudy: false },
  { time: "10:30 AM - 1:00 PM", type: "Deep Focus", text: "Then change the subject", isStudy: true },
  
  { time: "1:00 PM - 2:00 PM", type: "Break", text: "Take your lunch and relax for some time.", isStudy: false },
  { time: "2:00 PM - 4:00 PM", type: "School", text: "Complete school or online classes and homework", isStudy: false },
  { time: "4:00 PM - 5:00 PM", type: "Practice", text: "Practice papers or focus on a subject you find difficult", isStudy: true },
  { time: "5:00 PM - 6:00 PM", type: "Activity", text: "Outdoor activity, exercise, or hobbies", isStudy: false },
  { time: "6:00 PM - 7:00 PM", type: "Review", text: "Review notes from the day's lessons", isStudy: false },
  
  { time: "7:00 PM - 8:00 PM", type: "Break", text: "Dinner and relaxation", isStudy: false },
  { time: "8:00 PM - 9:00 PM", type: "Free Time", text: "Free time or catch up on any missed studies", isStudy: false },
  { time: "9:00 PM - 9:30 PM", type: "Wind Down", text: "Prepare for bed, read a book, etc", isStudy: false },
  { time: "9:30 PM", type: "Rest", text: "Sleep", isStudy: false },
  { time: "", type: "Empty", text: "", isStudy: false },
];

export function DailyScheduleBoard({ date, blocks, onToggleTask }: DailyScheduleBoardProps) {
  
  // Inject the actual generated tasks into the designated study slots
  const filledSlots = useMemo(() => {
    let taskIndex = 0;
    return TEMPLATE_SLOTS.map((slot) => {
      if (slot.isStudy && taskIndex < blocks.length) {
        const studentTask = blocks[taskIndex];
        taskIndex++;
        return {
          ...slot,
          type: studentTask.type || slot.type,
          text: studentTask.title,
          id: studentTask.id,
          is_done: studentTask.is_done
        };
      }
      return {
        ...slot,
        id: `fixed-${Math.random()}`,
        is_done: false
      };
    });
  }, [blocks]);

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-surface-container-lowest border border-outline-variant rounded-xl text-center">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">event_busy</span>
        <p className="font-bold text-on-surface">No tasks for {date}</p>
        <p className="text-sm text-on-surface-variant mt-1 mb-4">You have a free day! Relax and recharge.</p>
      </div>
    );
  }

  const redAccent = "#fd6b68"; 

  return (
    <div className="w-full bg-[#f9f9f9] rounded-xl shadow-md overflow-hidden border border-gray-200 mt-6 relative">
      {/* Top Banner Area */}
      <div className="bg-[#e9ecef] pt-6 pb-6 relative flex items-center justify-center border-b-[16px]" style={{ borderColor: redAccent }}>
        <h2 className="text-4xl font-black tracking-widest uppercase text-gray-900 mt-2 mb-2">
          DAILY SCHEDULE <span className="text-xl text-gray-600 font-medium ml-2 capitalize tracking-normal">({date})</span>
        </h2>
        
        {/* Binder Rings */}
        <div className="absolute -bottom-6 left-0 w-full flex justify-around px-8">
          {[1, 2, 3, 4, 5].map((ring) => (
            <div key={ring} className="w-6 h-12 bg-[#a3a3a3] rounded-full shadow-md z-10 border-2 border-gray-100 flex items-center justify-center">
              <div className="w-4 h-10 bg-[#8c8c8c] rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-5 bg-white">
        {filledSlots.map((slot, idx) => {
          const isRightCol = (idx + 1) % 5 === 0;
          const isBottomRow = idx >= filledSlots.length - 5;
          const isEmpty = slot.type === "Empty";
          const isStudentTask = slot.isStudy;

          return (
            <div 
              key={slot.id} 
              onClick={() => isStudentTask && slot.id && onToggleTask && onToggleTask(slot.id)}
              className={`
                min-h-[140px] p-4 flex flex-col items-center text-center relative
                ${!isRightCol ? 'border-r-4' : ''} 
                ${!isBottomRow ? 'border-b-4' : ''}
                ${isStudentTask ? 'cursor-pointer hover:bg-red-50 transition-colors bg-white' : 'bg-[#fafafa]'}
                ${slot.is_done ? 'bg-gray-100 opacity-70' : ''}
              `}
              style={{ borderColor: redAccent }}
            >
              {!isEmpty && (
                <>
                  <div className="font-bold text-sm mb-2 uppercase tracking-wide" style={{ color: redAccent }}>
                    {slot.time}
                  </div>
                  <div className={`text-[15px] leading-snug text-gray-800 ${slot.is_done ? 'line-through text-gray-500' : ''}`}>
                    {isStudentTask && (
                      <span className="block mb-1 font-bold text-gray-900">{slot.type}</span>
                    )}
                    {slot.text}
                  </div>
                  {slot.is_done && (
                    <div className="absolute top-2 right-2 text-green-500">
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                    </div>
                  )}
                  {isStudentTask && !slot.is_done && (
                    <div className="absolute top-2 right-2 text-primary opacity-50">
                      <span className="material-symbols-outlined text-sm">edit_note</span>
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
