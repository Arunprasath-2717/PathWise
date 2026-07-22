"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { DayCard } from "@/components/DayCard";
import { ProgressRing } from "@/components/ProgressRing";
import { useAuth } from "@/components/AuthContext";

export default function StudyPlan() {
  const { studentId, token } = useAuth();
  const [studyBlocks, setStudyBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlan = () => {
    if (studentId && token) {
      setLoading(true);
      fetch(`http://localhost:8000/study-plan/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.tasks) {
          const blocks = data.tasks.map((t: any) => ({
            id: t.id,
            title: t.description,
            type: t.subject,
            time: "Anytime",
            duration: `${t.hours} hr`,
            colorClass: "bg-surface-container-high",
            date: t.date,
            is_done: t.is_done
          }));
          setStudyBlocks(blocks);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    } else if (!token) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [studentId, token]);

  const handleRegenerate = async () => {
    if (!studentId || !token) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:8000/generate-study-plan/${studentId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPlan();
    } catch (e) {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <PageTransition>
      <div className="flex-1 overflow-y-auto p-lg lg:p-xl custom-scrollbar relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-background mb-2">Study Plan</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Precision Pass alignment: Your personalized roadmap for mastering Computer Science architecture and systems.
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button 
              onClick={handleRegenerate}
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              {loading ? "Generating..." : "Regenerate Plan"}
            </motion.button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter pb-10">
          
          {/* Weekly Schedule */}
          <motion.section 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-12 grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <DayCard day="Mon" date="Oct 16" blocks={studyBlocks.slice(0, 1)} />
            <DayCard day="Tue" date="Oct 17" isToday={true} blocks={studyBlocks.slice(1, 3)} />
            <DayCard day="Wed" date="Oct 18" blocks={studyBlocks.slice(3, 5)} />
            <DayCard day="Thu" date="Oct 19" blocks={studyBlocks.slice(5, 7)} />
            <DayCard day="Fri" date="Oct 20" blocks={studyBlocks.slice(7)} />
          </motion.section>

          {/* Left Column: AI Suggestions & Focus Tags */}
          <section className="lg:col-span-8 flex flex-col gap-gutter mt-gutter">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"
            >
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Focus Topics &amp; AI Tags</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-[#E1F5FE] text-[#0277BD] rounded-full font-label-md text-label-md border border-[#81D4FA]">Computer Systems</span>
                <span className="px-4 py-2 bg-[#F3E5F5] text-[#7B1FA2] rounded-full font-label-md text-label-md border border-[#CE93D8]">High Complexity</span>
                <span className="px-4 py-2 bg-[#E8EAF6] text-[#303F9F] rounded-full font-label-md text-label-md border border-[#9FA8DA]">Periwinkle Review</span>
                <span className="px-4 py-2 bg-[#E1F5FE] text-[#0277BD] rounded-full font-label-md text-label-md border border-[#81D4FA]">Light Blue Core</span>
                <span className="px-4 py-2 bg-[#E8F5E9] text-[#2E7D32] rounded-full font-label-md text-label-md border border-[#A5D6A7]">Architecture Deep-dive</span>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary">tips_and_updates</span>
                    <h4 className="font-label-md text-label-md text-on-surface font-bold">Suggested Resource</h4>
                  </div>
                  <p className="text-on-surface-variant text-[14px]">Read "Modern Processor Architecture: An Introduction" Chapter 4 for your Wednesday session.</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    <h4 className="font-label-md text-label-md text-on-surface font-bold">Flashcard Sprint</h4>
                  </div>
                  <p className="text-on-surface-variant text-[14px]">Review 15 cards on 'RISC vs CISC' today to maintain your 5-day streak.</p>
                </div>
              </div>
            </motion.div>

            {/* Statistics / Visual Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden h-48"
              >
                <div className="relative z-10">
                  <h4 className="font-label-md text-label-md text-on-surface font-bold mb-1">Time Distribution</h4>
                  <p className="text-[32px] font-bold text-primary">24h <span className="text-body-md font-normal text-on-surface-variant">this week</span></p>
                </div>
                <div className="absolute bottom-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-[120px]">bar_chart</span>
                </div>
                {/* Visual placeholder for a graph */}
                <div className="mt-4 flex items-end gap-2 h-16">
                  <motion.div initial={{ height: 0 }} animate={{ height: "40%" }} transition={{ duration: 0.5 }} className="w-full bg-primary/20 rounded-t-sm"></motion.div>
                  <motion.div initial={{ height: 0 }} animate={{ height: "70%" }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full bg-primary/40 rounded-t-sm"></motion.div>
                  <motion.div initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full bg-primary rounded-t-sm"></motion.div>
                  <motion.div initial={{ height: 0 }} animate={{ height: "50%" }} transition={{ duration: 0.5, delay: 0.3 }} className="w-full bg-primary/60 rounded-t-sm"></motion.div>
                  <motion.div initial={{ height: 0 }} animate={{ height: "30%" }} transition={{ duration: 0.5, delay: 0.4 }} className="w-full bg-primary/30 rounded-t-sm"></motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden h-48"
              >
                <h4 className="font-label-md text-label-md text-on-surface font-bold mb-4">Study Pattern</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-[12px] text-on-surface-variant">Active Learning (65%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                      <span className="text-[12px] text-on-surface-variant">Reviewing (25%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                      <span className="text-[12px] text-on-surface-variant">Mock Tests (10%)</span>
                    </div>
                  </div>
                  <div className="w-24 h-24 rounded-full border-8 border-surface-variant relative flex items-center justify-center">
                    <motion.div 
                      initial={{ rotate: -180 }}
                      animate={{ rotate: -45 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent border-l-transparent transform -rotate-45"
                    />
                    <span className="font-bold text-primary">A+</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Right Column: Goals & Pro Tip */}
          <section className="lg:col-span-4 flex flex-col gap-gutter mt-gutter">
            {/* Goal Progress */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"
            >
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Learning Goal</h3>
              <div className="flex flex-col items-center gap-4 py-4">
                
                <ProgressRing percentage={70} label="Progress" />
                
                <div className="text-center mt-2">
                  <p className="font-label-md text-label-md text-on-surface font-bold">Exam Readiness: 12 days left</p>
                  <p className="text-[13px] text-on-surface-variant mt-1">You are ahead of 85% of peers on this module.</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-[13px] font-medium text-on-surface">
                  <span>Mastery Score</span>
                  <span className="text-primary">820 / 1000</span>
                </div>
                <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Pro Tip */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-primary text-white rounded-xl p-6 relative overflow-hidden shadow-lg mt-auto"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-white">lightbulb</span>
                  <span className="font-label-md text-label-md uppercase tracking-wider font-bold">Pro Tip</span>
                </div>
                <h4 className="font-headline-md text-headline-md leading-tight mb-4">The "Feynman" Effect</h4>
                <p className="font-body-md text-body-md text-white/90 mb-6">Explain your Assembly code to a rubber duck. If you can't describe the logic simply, you don't understand it yet.</p>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-surface-bright transition-colors"
                >
                  Try Active Recall
                </motion.button>
              </div>
              {/* Background decoration */}
              <div className="absolute -bottom-4 -right-4 opacity-10">
                <span className="material-symbols-outlined text-[150px]">psychology</span>
              </div>
            </motion.div>

          </section>
        </div>
      </div>
    </PageTransition>
  );
}
