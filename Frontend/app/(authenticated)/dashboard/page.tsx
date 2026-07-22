"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { StreakBadge } from "@/components/StreakBadge";
import { SubjectCard } from "@/components/SubjectCard";
import { TaskCheckbox } from "@/components/TaskCheckbox";
import { ProgressRing } from "@/components/ProgressRing";
import { Sparkline } from "@/components/Sparkline";
import { mockUser, mockSubjects, mockTasks } from "@/lib/mock-data";

export default function Dashboard() {
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
        <div className="flex flex-col">
          <h2 className="font-headline-md text-headline-md font-bold text-primary leading-tight">
            Good morning, {mockUser.name.split(" ")[0]}
          </h2>
          <span className="text-[12px] text-on-surface-variant opacity-80">Wednesday, October 25, 2023</span>
        </div>
        <div className="flex items-center gap-lg">
          {/* Streak Badge */}
          <StreakBadge streak={14} />

          <div className="flex items-center gap-md hidden sm:flex">
            <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Scrollable Dashboard Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-lg relative">
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-gutter pb-10">
          
          {/* Welcome Section / Focus CTA */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
            
            {/* Subject Performance */}
            <section>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-md ml-1">Subject Performance</h3>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
              >
                {mockSubjects.map(subject => (
                  <motion.div key={subject.id} variants={itemVariants}>
                    <SubjectCard subject={subject} />
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Today's Tasks & Focus Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-2">
              {/* Animated Checklist Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-surface-container-lowest border border-bordermist rounded-2xl p-lg flex flex-col"
              >
                <div className="flex justify-between items-center mb-md">
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Today's Tasks</h3>
                  <span className="text-[12px] text-primary font-bold">2/4 Done</span>
                </div>
                <motion.div 
                  variants={containerVariants} 
                  initial="hidden" 
                  animate="show" 
                  className="space-y-sm"
                >
                  {mockTasks.map(task => (
                    <motion.div key={task.id} variants={itemVariants}>
                      <TaskCheckbox task={task} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Focus Mode CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-[#FF9770] rounded-2xl p-lg flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Abstract Decorative Elements */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-black/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-md backdrop-blur-sm">
                    <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-white mb-xs">Ready for Focus?</h3>
                  <p className="text-white/90 text-label-md leading-relaxed">Boost your productivity with a 25-minute Pomodoro session focused on your weakest subject.</p>
                </div>
                
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10 mt-xl w-full bg-white text-[#FF9770] font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Start Focus Mode
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Sidebar (Career Readiness) */}
          <aside className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
            
            {/* Career Readiness Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-surface-container-lowest border border-bordermist rounded-2xl p-lg flex flex-col items-center text-center"
            >
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-lg self-start">Career Readiness</h3>
              
              <ProgressRing percentage={75} label="Ready" />

              <div className="w-full space-y-md text-left mt-2">
                <div className="flex justify-between items-center px-sm">
                  <span className="text-label-md text-on-surface">Skill Growth</span>
                  <span className="text-label-md font-bold text-primary">+12% this week</span>
                </div>
                
                {/* Replaced CSS sparkline with SVG sparkline as requested */}
                <Sparkline data={[10, 20, 15, 30, 45, 40, 60]} />

                <div className="pt-md border-t border-bordermist">
                  <p className="text-[13px] text-on-surface-variant leading-relaxed">Based on your current pace, you are ahead of 82% of students in your cohort.</p>
                </div>
              </div>
            </motion.div>

            {/* Recommended Resources */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-surface-container-lowest border border-bordermist rounded-2xl p-lg"
            >
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-md">Recommended</h3>
              
              <div className="space-y-md">
                <motion.div whileHover={{ x: 4 }} className="flex items-center gap-md group cursor-pointer">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/20">
                    <span className="material-symbols-outlined text-primary">video_library</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-label-md font-bold truncate">Neural Networks Basics</p>
                    <p className="text-[11px] text-on-surface-variant">Video Tutorial • 12 min</p>
                  </div>
                </motion.div>

                <motion.div whileHover={{ x: 4 }} className="flex items-center gap-md group cursor-pointer">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-secondary/20">
                    <span className="material-symbols-outlined text-secondary">description</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-label-md font-bold truncate">Linear Algebra Cheatsheet</p>
                    <p className="text-[11px] text-on-surface-variant">PDF • 4 pages</p>
                  </div>
                </motion.div>
              </div>

              <button className="w-full mt-lg py-2 text-primary font-bold text-label-md hover:underline decoration-2 underline-offset-4">
                Browse All Resources
              </button>
            </motion.div>
          </aside>

        </div>
      </div>
    </PageTransition>
  );
}
