"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { StreakBadge } from "@/components/StreakBadge";
import { SubjectCard } from "@/components/SubjectCard";
import { TaskCheckbox } from "@/components/TaskCheckbox";
import { ProgressRing } from "@/components/ProgressRing";
import { AiAssistance } from "@/components/AiAssistance";
import { mockTasks } from "@/lib/mock-data";
import { useAuth } from "@/components/AuthContext";

export default function Dashboard() {
  const { studentId, token, user } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");
  const [currentDate, setCurrentDate] = useState("");

  // Focus Timer State
  const [focusTime, setFocusTime] = useState(1500); // 25 minutes
  const [focusActive, setFocusActive] = useState(false);
  const [focusSessions, setFocusSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (focusActive && focusTime > 0) {
      interval = setInterval(() => {
        setFocusTime((prev) => prev - 1);
      }, 1000);
    } else if (focusActive && focusTime === 0) {
      setFocusActive(false);
      setFocusSessions((prev) => prev + 1);
    }
    return () => clearInterval(interval);
  }, [focusActive, focusTime]);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(now.toLocaleDateString(undefined, options));
  }, []);

  useEffect(() => {
    if (studentId && token) {
      // Fetch analysis
      fetch(`http://localhost:8000/analysis/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.analysis) {
          setSubjects(data.analysis.map((s: any) => ({
            id: s.subject,
            name: s.subject,
            code: s.subject.substring(0, 4).toUpperCase(),
            score: s.avg_score,
            trend: s.trend === "improving" ? "up" : s.trend === "declining" ? "down" : "flat",
            status: s.status
          })));
        }
      })
      .catch(() => {});

      // Fetch study plan
      fetch(`http://localhost:8000/study-plan/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.tasks) {
          setTasks(data.tasks.map((t: any) => ({
            id: t.id,
            title: t.description,
            time: "Anytime",
            completed: t.is_done,
            subject: t.subject
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    } else if (!token) {
      setLoading(false);
    }
  }, [studentId, token]);
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
      <header className="h-auto min-h-[64px] py-3 flex justify-between items-center px-container-margin w-full bg-surface border-b border-outline-variant z-10 shrink-0 gap-4">
        <div className="flex flex-col min-w-0">
          <h2 className="font-headline-md text-xl md:text-headline-md font-bold text-primary leading-tight truncate">
            {greeting}, {user?.displayName || user?.email?.split('@')[0] || "Student"}
          </h2>
          <span className="text-[12px] text-on-surface-variant opacity-80 truncate mt-0.5">{currentDate || "Loading date..."}</span>
        </div>
        <div className="flex items-center gap-lg shrink-0">
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
                {loading ? (
                  <div className="col-span-3 text-center py-8 text-on-surface-variant">Loading analysis...</div>
                ) : subjects.length > 0 ? (
                  subjects.map(subject => (
                    <motion.div key={subject.id} variants={itemVariants}>
                      <SubjectCard subject={subject} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-on-surface-variant">Upload scores to see your subject analysis.</div>
                )}
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
                  <span className="text-[12px] text-primary font-bold">{tasks.filter(t => t.completed).length}/{tasks.length} Done</span>
                </div>
                <motion.div 
                  variants={containerVariants} 
                  initial="hidden" 
                  animate="show" 
                  className="space-y-sm"
                >
                  {loading ? (
                    <div className="text-center py-4 text-on-surface-variant">Loading tasks...</div>
                  ) : tasks.length > 0 ? (
                    tasks.map(task => (
                      <motion.div key={task.id} variants={itemVariants}>
                        <TaskCheckbox task={task} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-on-surface-variant">No tasks scheduled for today.</div>
                  )}
                </motion.div>
              </motion.div>

              {/* Focus Mode Timer */}
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
                  
                  {/* Timer Display */}
                  <div className="text-center my-3">
                    <span className="text-4xl font-black text-white tabular-nums tracking-tight">
                      {String(Math.floor(focusTime / 60)).padStart(2, '0')}:{String(focusTime % 60).padStart(2, '0')}
                    </span>
                    <p className="text-white/70 text-xs mt-1 font-medium">
                      {focusActive ? "Stay focused! 🔥" : focusTime < 1500 ? "Session paused" : "25-min Pomodoro"}
                    </p>
                  </div>

                  {focusSessions > 0 && (
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {Array.from({ length: focusSessions }).map((_, i) => (
                        <span key={i} className="w-2 h-2 rounded-full bg-white/80"></span>
                      ))}
                      <span className="text-white/70 text-[10px] ml-1 font-bold">{focusSessions} done</span>
                    </div>
                  )}
                </div>
                
                <div className="relative z-10 flex gap-2 mt-md">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (focusActive) {
                        setFocusActive(false);
                      } else {
                        setFocusActive(true);
                      }
                    }}
                    className="flex-1 bg-white text-[#FF9770] font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {focusActive ? "pause" : "play_arrow"}
                    </span>
                    {focusActive ? "Pause" : focusTime < 1500 ? "Resume" : "Start Focus"}
                  </motion.button>
                  {focusTime < 1500 && !focusActive && (
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setFocusTime(1500); setFocusActive(false); }}
                      className="w-12 bg-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                    </motion.button>
                  )}
                </div>
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

              <div className="w-full mt-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="font-medium">Subjects</span><span className="text-primary font-bold">85%</span></div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden"><div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="font-medium">Internship Prep</span><span className="text-[#FF9770] font-bold">60%</span></div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden"><div className="bg-[#FF9770] h-full rounded-full" style={{ width: '60%' }}></div></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="font-medium">LinkedIn Profile</span><span className="text-[#0A66C2] font-bold">90%</span></div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden"><div className="bg-[#0A66C2] h-full rounded-full" style={{ width: '90%' }}></div></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="font-medium">Hackathons</span><span className="text-tertiary font-bold">40%</span></div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden"><div className="bg-tertiary h-full rounded-full" style={{ width: '40%' }}></div></div>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Deadlines */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-surface-container-lowest border border-bordermist rounded-2xl p-lg"
            >
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-md">Upcoming Deadlines</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-bold shrink-0">
                    <span className="material-symbols-outlined text-[20px]">warning</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-md text-on-surface font-bold truncate">OS Project Phase 1</p>
                    <p className="text-[12px] text-red-500 font-medium mt-0.5">Tomorrow, 11:59 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-container-low border border-outline-variant rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-md text-on-surface font-bold truncate">Algo Problem Set</p>
                    <p className="text-[12px] text-on-surface-variant mt-0.5">Friday, 5:00 PM</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Smart Insights */}
            <AiAssistance />

            {/* Recommended Resources */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
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
