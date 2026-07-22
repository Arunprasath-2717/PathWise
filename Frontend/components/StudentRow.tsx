"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Student } from "@/lib/mock-data";

export function StudentRow({ student }: { student: Student }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isAtRisk = student.risk === "high";

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 150);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("");
  };

  return (
    <motion.tr
      animate={{ backgroundColor: isUpdating ? "var(--color-surface-container-high)" : isAtRisk ? "#FFF5F2" : "transparent" }}
      transition={{ duration: 0.15 }}
      className={`group ${isAtRisk ? "border-l-4 border-l-[#FF7043]" : "hover:bg-surface-container transition-colors"}`}
      onClick={handleUpdate}
    >
      <td className="p-md">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isAtRisk ? "bg-error-container text-on-error-container" : "bg-secondary-container text-on-secondary-container"}`}>
            {getInitials(student.name)}
          </div>
          <span className={`font-body-md text-body-md ${isAtRisk ? "font-bold text-on-surface" : "font-medium"}`}>
            {student.name}
          </span>
        </div>
      </td>
      <td className="p-md text-body-md font-body-md text-on-surface-variant">{student.id}</td>
      <td className={`p-md text-center font-body-md text-body-md ${isAtRisk ? "font-bold text-error" : ""}`}>
        {student.risk === "high" ? "1.4" : "3.8"} {/* Mocking GPA based on risk */}
      </td>
      <td className={`p-md text-center font-body-md text-body-md ${isAtRisk ? "font-bold text-error" : ""}`}>
        {student.engagement}%
      </td>
      <td className="p-md">
        {isAtRisk ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#FF7043] border border-[#FF7043] font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span> Urgent
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Stable
          </span>
        )}
      </td>
      <td className="p-md text-right">
        {isAtRisk ? (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="bg-[#FF7043] hover:opacity-90 text-white px-4 py-1.5 rounded-lg font-label-md text-label-md font-bold shadow-sm transition-all"
          >
            Intervene
          </motion.button>
        ) : (
          <button className="text-primary font-label-md text-label-md hover:underline">View Profile</button>
        )}
      </td>
    </motion.tr>
  );
}
