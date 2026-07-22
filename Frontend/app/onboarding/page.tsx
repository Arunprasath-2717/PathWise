"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const totalSteps = 3;

  const titles: Record<number, string> = {
    1: "Welcome to Pathwise",
    2: "Your academic status",
    3: "What do you study?",
  };

  const subtitles: Record<number, string> = {
    1: "Let's set up your profile",
    2: "Help us personalize your difficulty level",
    3: "Select your core subjects",
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowModal(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <PageTransition>
      <div className="bg-surface min-h-screen flex items-center justify-center font-body-md text-on-background selection:bg-primary-fixed relative">
        {/* Progress Bar (Thin Sky Blue) */}
        <div className="fixed top-0 left-0 w-full h-1 bg-surface-variant overflow-hidden z-50">
          <motion.div
            className="h-full bg-secondary-container"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Onboarding Card Container */}
        <main className="w-full max-w-[520px] px-container-margin py-xl relative z-10">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant relative overflow-hidden transition-all duration-300">
            {/* Step Header */}
            <header className="p-lg border-b border-outline-variant flex items-center justify-between">
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">{titles[currentStep]}</h1>
                <p className="font-label-md text-label-md text-on-surface-variant mt-1">{subtitles[currentStep]}</p>
              </div>
              <div className="bg-surface-container-high rounded-lg p-sm">
                <span className="font-label-sm text-label-sm text-primary">Step {currentStep} of {totalSteps}</span>
              </div>
            </header>

            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-lg flex flex-col gap-lg"
                    >
                      <div className="flex flex-col gap-sm">
                        <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="user-name">Full Name</label>
                        <input
                          className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-lg px-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          id="user-name"
                          name="name"
                          placeholder="John Doe"
                          type="text"
                        />
                      </div>
                      <div className="aspect-video w-full rounded-lg bg-surface-container overflow-hidden border border-surface-variant relative group">
                        <div className="absolute inset-0 bg-primary opacity-5 group-hover:opacity-10 transition-opacity"></div>
                        <img
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCja9lFOGusGioaei49j_vGB4LGeyWqGpWUuPVa6BURmeezgKk7-zLNCR4OsG_kAEEPIMvhw8HZsDJtmfSRvODpC-jEv3tdGBetsvbHzhkdO0-Pmo-kJaPvcev0bp3IGlI2hpCNmLp1_fiHWZ6jdhX-uOldK51vrsVGPtiUVlFuTIK30TQTNmXzMr2FgCfoLApf98mNPVZkBy-rFIrLEOrEV8f4u6Z5eZLtMHu8P1U7VS9aiUepk6FteuupsPbaCzzWb2d-KSgm_qc"
                          alt="Workspace"
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-lg flex flex-col gap-lg"
                    >
                      <div className="flex flex-col gap-sm">
                        <label className="font-label-md text-label-md text-on-surface-variant">Academic Year</label>
                        <div className="grid grid-cols-2 gap-md">
                          {["Freshman", "Sophomore", "Junior", "Senior"].map((year) => (
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              key={year}
                              onClick={() => setSelectedYear(year)}
                              className={`h-14 border rounded-lg flex items-center justify-center font-label-md text-label-md transition-all ${
                                selectedYear === year
                                  ? "border-primary bg-primary/10 text-primary font-bold"
                                  : "border-outline-variant hover:border-primary hover:bg-surface-container-low"
                              }`}
                              type="button"
                            >
                              {year}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      <div className="p-md bg-secondary-fixed rounded-lg border border-secondary-container flex gap-md items-start">
                        <span className="material-symbols-outlined text-on-secondary-fixed-variant">info</span>
                        <p className="font-body-md text-body-md text-on-secondary-fixed-variant text-sm">Pathwise adjusts your module difficulty based on your current academic progress.</p>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-lg flex flex-col gap-lg"
                    >
                      <div className="flex flex-col gap-sm">
                        <label className="font-label-md text-label-md text-on-surface-variant">Core Subjects</label>
                        <div className="flex flex-wrap gap-sm">
                          {[
                            { name: "Mathematics", icon: "calculate" },
                            { name: "Physics", icon: "science" },
                            { name: "Engineering", icon: "architecture" },
                            { name: "CS Theory", icon: "computer" },
                            { name: "Bio-Science", icon: "biotech" },
                          ].map((subject) => {
                            const isSelected = selectedSubjects.includes(subject.name);
                            return (
                              <motion.div
                                whileTap={{ scale: 0.95 }}
                                key={subject.name}
                                onClick={() => toggleSubject(subject.name)}
                                className={`px-md py-sm rounded-full border cursor-pointer transition-all flex items-center gap-2 ${
                                  isSelected
                                    ? "bg-primary text-white border-primary"
                                    : "bg-surface-container-high border-outline-variant hover:border-primary text-on-surface"
                                }`}
                              >
                                <span className="material-symbols-outlined text-[18px]">{subject.icon}</span>
                                <span className="font-label-sm text-label-sm">{subject.name}</span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-sm">
                        <div className="bg-surface-container-low p-md rounded-lg border border-surface-variant text-center">
                          <p className="font-headline-md text-headline-md text-primary">120+</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">Sub-topics</p>
                        </div>
                        <div className="bg-surface-container-low p-md rounded-lg border border-surface-variant text-center">
                          <p className="font-headline-md text-headline-md text-primary">15k</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">Daily Students</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions Footer */}
              <footer className="p-lg bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between">
                <button
                  className={`px-lg h-12 flex items-center justify-center font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all ${currentStep === 1 ? 'invisible' : ''}`}
                  onClick={prevStep}
                  type="button"
                >
                  Back
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#2F6FB0] hover:bg-primary px-xl h-12 rounded-lg flex items-center justify-center font-label-md text-label-md text-white transition-all"
                  onClick={nextStep}
                  type="button"
                >
                  {currentStep === totalSteps ? 'Complete' : 'Continue'}
                </motion.button>
              </footer>
            </form>
          </div>

          {/* Footer Help */}
          <div className="mt-xl flex flex-col items-center gap-md">
            <p className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Pathwise Precision Alignment v2.4.0</p>
            <div className="flex gap-lg">
              <Link href="#" className="text-xs text-primary hover:underline">Support</Link>
              <Link href="#" className="text-xs text-primary hover:underline">Privacy Policy</Link>
              <Link href="#" className="text-xs text-primary hover:underline">Terms of Service</Link>
            </div>
          </div>
        </main>

        {/* Success Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 bg-on-background/20 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative bg-surface-container-lowest p-xl rounded-xl border border-surface-variant shadow-none w-full max-w-sm text-center"
              >
                <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-lg">
                  <span className="material-symbols-outlined text-white text-[32px]">check_circle</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">All Set!</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-xl">Your educational path has been perfectly aligned. Redirecting to your dashboard...</p>
                <Link href="/dashboard" passHref>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#2F6FB0] text-white h-12 rounded-lg font-label-md text-label-md hover:bg-primary transition-colors"
                  >
                    Go to Dashboard
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
