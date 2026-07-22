"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

export default function Resources() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const categories = [
    { name: "Past Papers", icon: "history_edu", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Textbooks", icon: "import_contacts", color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Video Lectures", icon: "smart_display", color: "text-red-500", bg: "bg-red-500/10" },
    { name: "My Notes", icon: "edit_document", color: "text-orange-500", bg: "bg-orange-500/10" },
    { name: "Study Guides", icon: "map", color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Flashcards", icon: "style", color: "text-teal-500", bg: "bg-teal-500/10" }
  ];

  return (
    <PageTransition>
      {/* Header */}
      <header className="h-16 flex justify-between items-center px-container-margin w-full bg-surface border-b border-outline-variant z-10 shrink-0">
        <div className="flex flex-col">
          <h2 className="font-headline-md text-headline-md font-bold text-primary leading-tight">
            Learning Resources
          </h2>
          <span className="text-[12px] text-on-surface-variant opacity-80">Access your study materials anywhere</span>
        </div>
        <div className="flex items-center gap-md">
          <motion.button whileTap={{ scale: 0.95 }} className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white hover:opacity-90 transition-opacity shadow-sm">
            <span className="material-symbols-outlined">search</span>
          </motion.button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-lg relative bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto space-y-xl pb-10">
          
          {/* Coming Soon Banner */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full rounded-2xl bg-gradient-to-r from-primary/10 via-tertiary/10 to-secondary/10 border border-primary/20 p-8 flex flex-col items-center justify-center text-center overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-[120px]">science</span>
            </div>
            <span className="material-symbols-outlined text-[48px] text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
              construction
            </span>
            <h3 className="font-headline-lg text-2xl font-black text-on-surface mb-2">Resource Library Coming Soon!</h3>
            <p className="text-on-surface-variant w-full max-w-2xl text-center">
              We're currently building a centralized hub for all your study materials. Soon, you'll be able to upload, organize, and access everything in one beautiful interface.
            </p>
          </motion.div>

          {/* Categories Grid Placeholder */}
          <div>
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-md ml-1">Categories</h3>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-gutter"
            >
              {categories.map((cat, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-full ${cat.bg} ${cat.color} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                  </div>
                  <span className="font-label-md font-bold text-on-surface text-center leading-tight">{cat.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
