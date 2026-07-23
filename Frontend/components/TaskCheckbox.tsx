"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Task } from "@/lib/mock-data";

export function TaskCheckbox({ task }: { task: Task }) {
  const [isChecked, setIsChecked] = useState(task.completed);

  return (
    <motion.label
      animate={{
        backgroundColor: isChecked ? "var(--color-skytint)" : "#ffffff",
        borderColor: isChecked ? "var(--color-skytint)" : "var(--color-bordermist)"
      }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border hover:border-primary transition-colors group`}
      onClick={(e) => e.preventDefault()} // Let the inner div handle toggle or just toggle state on click label
      onTap={() => setIsChecked(!isChecked)}
    >
      <div className="relative flex items-center justify-center w-5 h-5 rounded border border-outline">
        <motion.div
          initial={false}
          animate={{
            backgroundColor: isChecked ? "var(--color-primary)" : "transparent",
            borderColor: isChecked ? "var(--color-primary)" : "var(--color-outline)"
          }}
          className="absolute inset-0 rounded border flex items-center justify-center"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M2 6L5 9L10 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isChecked ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </svg>
        </motion.div>
      </div>
      
      <div className="relative overflow-hidden flex-1">
        <span className={`font-label-md text-label-md text-on-surface ${isChecked ? 'opacity-50' : ''} transition-opacity duration-300`}>
          {task.title}
        </span>
        <motion.div
          initial={false}
          animate={{ width: isChecked ? "100%" : "0%" }}
          transition={{ duration: 0.25 }}
          className="absolute left-0 top-1/2 h-[1px] bg-on-surface -translate-y-1/2 opacity-50"
        />
      </div>
    </motion.label>
  );
}
