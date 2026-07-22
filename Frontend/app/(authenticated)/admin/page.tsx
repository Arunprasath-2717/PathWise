"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { StudentRow } from "@/components/StudentRow";
import { mockStudents } from "@/lib/mock-data";

export default function AdminView() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <PageTransition>
      {/* TopAppBar */}
      <header className="h-16 flex justify-between items-center px-container-margin w-full bg-surface border-b border-outline-variant z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">admin_panel_settings</span>
          <h2 className="font-headline-md font-bold text-on-surface">Instructor Dashboard</h2>
        </div>
        <div className="flex items-center gap-md">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-label-sm font-bold text-on-surface-variant">Live Sync Active</span>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-primary">notifications</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors bg-secondary-container text-on-secondary-container">
            <span className="text-sm font-bold">PT</span>
          </motion.button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-container-margin relative">
        <div className="max-w-7xl mx-auto w-full pb-10">
          
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-xl">
            {/* KPI Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
              {[
                { label: "Total Students", value: "248", icon: "school", color: "text-primary", bg: "bg-primary-container/20" },
                { label: "Active Now", value: "42", icon: "bolt", color: "text-secondary", bg: "bg-secondary-container/20" },
                { label: "Avg. Cohort Score", value: "84%", icon: "monitoring", color: "text-tertiary", bg: "bg-tertiary-container/20" },
                { label: "At-Risk Alerts", value: "12", icon: "warning", color: "text-[#FF7043]", bg: "bg-[#FF7043]/10" }
              ].map((kpi, i) => (
                <motion.div variants={itemVariants} whileHover={{ y: -4 }} key={i} className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex flex-col justify-between h-32 transition-shadow hover:shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="font-label-md text-on-surface-variant uppercase tracking-wider">{kpi.label}</span>
                    <div className={`p-2 rounded-lg ${kpi.bg}`}>
                      <span className={`material-symbols-outlined ${kpi.color} text-[20px]`} style={{ fontVariationSettings: "'FILL' 1" }}>{kpi.icon}</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="font-display-lg-mobile font-bold text-on-background leading-none">{kpi.value}</span>
                    <span className="text-xs font-bold text-primary flex items-center">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span> +2%
                    </span>
                  </div>
                </motion.div>
              ))}
            </section>

            {/* Performance Overview & Student Roster */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              {/* Main Table Area */}
              <div className="lg:col-span-12 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="font-headline-md font-bold text-on-surface">Student Roster</h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                      <input type="text" placeholder="Search students..." className="w-full sm:w-64 h-10 pl-9 pr-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <motion.button whileTap={{ scale: 0.95 }} className="h-10 px-4 rounded-lg border border-outline-variant flex items-center gap-2 hover:bg-surface-container-low transition-colors whitespace-nowrap">
                      <span className="material-symbols-outlined text-[18px]">filter_list</span>
                      <span>Filter</span>
                    </motion.button>
                  </div>
                </div>

                <motion.div variants={itemVariants} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant">
                          <th className="p-md font-label-sm uppercase text-on-surface-variant font-bold">Student Name</th>
                          <th className="p-md font-label-sm uppercase text-on-surface-variant font-bold">Student ID</th>
                          <th className="p-md font-label-sm uppercase text-on-surface-variant font-bold text-center">Current GPA</th>
                          <th className="p-md font-label-sm uppercase text-on-surface-variant font-bold text-center">Attendance</th>
                          <th className="p-md font-label-sm uppercase text-on-surface-variant font-bold">Status</th>
                          <th className="p-md font-label-sm uppercase text-on-surface-variant font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <motion.tbody variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-outline-variant text-on-surface">
                        {mockStudents.map((student) => (
                          <StudentRow key={student.id} student={student} />
                        ))}
                      </motion.tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
}
