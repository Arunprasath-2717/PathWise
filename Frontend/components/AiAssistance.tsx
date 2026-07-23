"use client";

import React from "react";
import { motion } from "framer-motion";

export function AiAssistance() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-primary/5 border border-primary/20 rounded-2xl p-lg relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-[100px] text-primary">psychology</span>
      </div>
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        <h3 className="font-headline-md text-[18px] font-bold text-primary">AI Smart Insights</h3>
      </div>
      <div className="space-y-4 relative z-10">
        <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            <strong className="text-primary">Performance Alert:</strong> You've shown a 15% improvement in Computer Architecture! Keep up the momentum with the new focus modules.
          </p>
        </div>
        <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            <strong className="text-[#FF9770]">Study Suggestion:</strong> Your optimal focus time is between 9 AM and 11 AM. Try scheduling your hardest subjects then.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
