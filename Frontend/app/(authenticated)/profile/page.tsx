"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

export default function Profile() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <PageTransition>
      {/* TopAppBar */}
      <header className="h-16 flex justify-end items-center px-container-margin w-full bg-surface border-b border-outline-variant z-10 shrink-0">
        <div className="flex items-center gap-md">
          <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-primary">notifications</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-primary">account_circle</span>
          </motion.button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-container-margin relative">
        <div className="max-w-5xl mx-auto w-full pb-10">
          
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            {/* Profile Header */}
            <motion.section variants={itemVariants} className="flex flex-col md:flex-row items-center gap-lg mb-xl">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-surface-container-highest overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJh1JnH-7ItmCM8YL7otxNox9ltuPFvlFmIJrDyxrSs5GSgjUBxOxj8CYtyK-CYoIza6-09Es97bxbYNjH5EMs16q9dzCD25IwsJoat_grog9v8KXONrL_t5L7ruD5xcVJNJoQ6043ZhJXnsN4ySRy7RfYSAI2wupwqgJOIU9Odw-CiPV6bZDGAr5869xDKuAZJBRbUfULbzo6AnHlc3XvSVTxk_ZFrD2P4mh3bYM402oHHDSRXDSmp2WoWfXwtdU14pTPE8H1DW68" alt="Jane Doe" />
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-background transition-transform">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </motion.button>
              </div>
              <div className="text-center md:text-left flex-grow">
                <h1 className="font-display-lg-mobile md:font-display-lg text-on-background mb-xs">Jane Doe</h1>
                <p className="font-body-md text-on-surface-variant mb-md">jane.doe@pathwise-edu.com</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-sm">
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm">Senior Student</span>
                  <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm">Top 5% Rank</span>
                </div>
              </div>
              <div className="mt-md md:mt-0">
                <motion.button whileTap={{ scale: 0.95 }} className="px-md py-2 border-2 border-secondary text-secondary rounded-[10px] font-bold hover:bg-surface-container-low transition-colors">
                  Log Out
                </motion.button>
              </div>
            </motion.section>

            {/* Stats Grid */}
            <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
              {[
                { icon: "timer", value: "124", label: "Study Hours" },
                { icon: "auto_stories", value: "42", label: "Modules Finished" },
                { icon: "star", value: "4.8", label: "Avg. Score" }
              ].map((stat, i) => (
                <motion.div whileHover={{ y: -4 }} key={i} className="bg-surface-container-low p-lg rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center group hover:border-primary transition-all duration-300">
                  <div className="p-3 bg-surface-container-highest rounded-full mb-md group-hover:bg-primary-fixed-dim transition-colors">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                  </div>
                  <span className="font-display-lg-mobile font-bold text-on-background">{stat.value}</span>
                  <span className="font-label-md text-on-surface-variant uppercase tracking-wider">{stat.label}</span>
                </motion.div>
              ))}
            </motion.section>

            {/* Achievements */}
            <motion.section variants={itemVariants} className="mb-xl">
              <div className="flex justify-between items-end mb-md">
                <h3 className="font-headline-md text-on-background">Recent Achievements</h3>
                <button className="text-primary font-bold font-label-md hover:underline">View All</button>
              </div>
              <div className="flex gap-md overflow-x-auto pb-4 custom-scrollbar -mx-2 px-2">
                {[
                  { icon: "local_fire_department", bg: "bg-red-50", border: "border-red-100", text: "text-red-400", label: "7 Day Streak" },
                  { icon: "verified_user", bg: "bg-teal-50", border: "border-teal-100", text: "text-teal-400", label: "Top Scorer" },
                  { icon: "emoji_events", bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-400", label: "Quiz Master" },
                  { icon: "psychology", bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-400", label: "Early Bird" },
                  { icon: "groups", bg: "bg-green-50", border: "border-green-100", text: "text-green-400", label: "Team Lead" },
                ].map((badge, i) => (
                  <motion.div whileHover={{ scale: 1.05 }} key={i} className="flex-shrink-0 w-32 flex flex-col items-center gap-sm">
                    <div className={`w-20 h-20 rounded-full ${badge.bg} flex items-center justify-center border-2 ${badge.border}`}>
                      <span className={`material-symbols-outlined ${badge.text} text-3xl`}>{badge.icon}</span>
                    </div>
                    <span className="font-label-sm text-center text-on-surface">{badge.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Settings Stack */}
            <motion.section variants={itemVariants} className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden">
              <div className="p-lg border-b border-outline-variant">
                <h3 className="font-headline-md text-on-background">Account Settings</h3>
              </div>
              <div className="divide-y divide-outline-variant">
                {[
                  { icon: "person_outline", title: "Personal Information", desc: "Name, email, and social profiles", error: false },
                  { icon: "lock_open", title: "Security", desc: "Password, 2FA, and sessions", error: false },
                  { icon: "notifications_active", title: "Notifications", desc: "Email alerts and push preferences", error: false },
                  { icon: "credit_card", title: "Billing", desc: "Manage subscription and invoices", error: false },
                  { icon: "delete", title: "Deactivate Account", desc: "Permanently remove all your data", error: true }
                ].map((setting, i) => (
                  <motion.a whileHover={{ x: 4 }} key={i} className="flex items-center justify-between p-lg hover:bg-surface-container-low transition-colors group cursor-pointer">
                    <div className="flex items-center gap-md">
                      <span className={`material-symbols-outlined ${setting.error ? 'text-error group-hover:scale-110 transition-transform' : 'text-on-surface-variant group-hover:text-primary'}`}>{setting.icon}</span>
                      <div>
                        <p className={`font-body-md font-bold ${setting.error ? 'text-error' : 'text-on-surface'}`}>{setting.title}</p>
                        <p className="text-sm text-on-surface-variant">{setting.desc}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                  </motion.a>
                ))}
              </div>
            </motion.section>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
}
