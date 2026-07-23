"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface WeakSubject {
  subject: string;
  avg_score: number;
  trend: string;
  reason: string;
}

interface LowScoredStudent {
  student_id: string;
  email: string;
  weak_subjects: WeakSubject[];
  lowest_score: number;
}

interface DayTask {
  id: string;
  date: string;
  subject: string;
  hours: number;
  description: string;
  is_done: boolean;
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function FacultyDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<LowScoredStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, Record<string, DayTask[]>>>({});
  const [planLoading, setPlanLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [facultyEmail, setFacultyEmail] = useState("");

  useEffect(() => {
    setFacultyEmail(localStorage.getItem("faculty_email") || "");
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/faculty/low-scored-students", {
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/faculty/login");
        return;
      }
      const data = await res.json();
      setStudents(data.students || []);
    } catch {
      setError("Could not reach server");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentPlan = async (studentId: string) => {
    setPlanLoading(true);
    setSelectedStudent(studentId);
    try {
      const res = await fetch(`http://localhost:8000/faculty/student-plan/${studentId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setWeeklySchedule(data.weekly_schedule || {});
    } catch {
      setWeeklySchedule({});
    } finally {
      setPlanLoading(false);
    }
  };

  const handleRegenerate = async (studentId: string) => {
    setRegenerating(true);
    try {
      await fetch(`http://localhost:8000/faculty/regenerate-plan/${studentId}`, {
        method: "POST",
        credentials: "include",
      });
      await fetchStudentPlan(studentId);
    } catch {
      // silent
    } finally {
      setRegenerating(false);
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:8000/faculty/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("faculty_email");
    router.push("/faculty/login");
  };

  const statusColor = (score: number) => {
    if (score < 40) return "text-red-500 bg-red-500/10";
    if (score < 60) return "text-[#FF9770] bg-[#FF9770]/10";
    return "text-primary bg-primary/10";
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      {/* Top Bar */}
      <header className="h-16 flex justify-between items-center px-6 bg-surface border-b border-outline-variant sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          <div>
            <h1 className="font-bold text-on-surface text-lg leading-tight">Pathwise Faculty</h1>
            <span className="text-[11px] text-on-surface-variant">{facultyEmail}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={fetchStudents}
            className="h-9 px-4 rounded-lg border border-outline-variant flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="h-9 px-4 rounded-lg bg-red-500/10 text-red-500 flex items-center gap-2 hover:bg-red-500/20 transition-colors text-sm font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </motion.button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant">
            <span className="text-sm text-on-surface-variant uppercase tracking-wider font-medium">At-Risk Students</span>
            <p className="text-3xl font-bold text-red-500 mt-1">{students.length}</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant">
            <span className="text-sm text-on-surface-variant uppercase tracking-wider font-medium">Total Weak Subjects</span>
            <p className="text-3xl font-bold text-[#FF9770] mt-1">{students.reduce((a, s) => a + s.weak_subjects.length, 0)}</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant">
            <span className="text-sm text-on-surface-variant uppercase tracking-wider font-medium">Lowest Score</span>
            <p className="text-3xl font-bold text-primary mt-1">{students.length > 0 ? `${students[0]?.lowest_score}%` : "N/A"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Student List */}
          <div className="lg:col-span-5">
            <h2 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              Low-Scored Students
            </h2>

            {loading ? (
              <div className="text-center py-10 text-on-surface-variant">Loading students...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : students.length === 0 ? (
              <div className="text-center py-10 text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-xl">
                <span className="material-symbols-outlined text-4xl text-primary mb-2">celebration</span>
                <p className="font-bold">No at-risk students!</p>
                <p className="text-sm mt-1">All students are performing well.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student) => (
                  <motion.div
                    key={student.student_id}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => fetchStudentPlan(student.student_id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedStudent === student.student_id
                        ? "bg-primary/5 border-primary/30 shadow-sm"
                        : "bg-surface-container-lowest border-outline-variant hover:border-primary/20"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <p className="font-bold text-on-surface truncate">{student.email || student.student_id.slice(0, 8)}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {student.weak_subjects.map((ws) => (
                            <span key={ws.subject} className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${statusColor(ws.avg_score)}`}>
                              {ws.subject} ({ws.avg_score}%)
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant shrink-0 ml-2">chevron_right</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Study Plan Viewer */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedStudent ? (
                <motion.div
                  key={selectedStudent}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">calendar_month</span>
                      Weekly Study Plan
                    </h2>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRegenerate(selectedStudent)}
                      disabled={regenerating}
                      className="h-9 px-4 rounded-lg bg-primary text-white flex items-center gap-2 hover:opacity-90 transition-colors text-sm font-bold disabled:opacity-50"
                    >
                      {regenerating ? (
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                      )}
                      {regenerating ? "Generating..." : "Regenerate Plan"}
                    </motion.button>
                  </div>

                  {planLoading ? (
                    <div className="text-center py-10 text-on-surface-variant bg-surface-container-lowest rounded-xl border border-outline-variant">
                      Loading study plan...
                    </div>
                  ) : Object.keys(weeklySchedule).length === 0 ? (
                    <div className="text-center py-10 bg-surface-container-lowest rounded-xl border border-outline-variant">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">event_busy</span>
                      <p className="font-bold text-on-surface">No study plan yet</p>
                      <p className="text-sm text-on-surface-variant mt-1">Click "Regenerate Plan" to create one via AI.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(weeklySchedule).map(([weekKey, days]) => (
                        <div key={weekKey} className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
                          <div className="px-4 py-3 bg-primary/5 border-b border-outline-variant">
                            <h3 className="font-bold text-primary flex items-center gap-2">
                              <span className="material-symbols-outlined text-[20px]">date_range</span>
                              {weekKey}
                            </h3>
                          </div>
                          <div className="divide-y divide-outline-variant">
                            {DAY_ORDER.filter((d) => days[d]).map((dayName) => (
                              <div key={dayName} className="p-4">
                                <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-2 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                                  {dayName}
                                </h4>
                                <div className="space-y-2 pl-4">
                                  {days[dayName].map((task) => (
                                    <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${task.is_done ? "bg-green-500/5 border-green-500/20" : "bg-surface-container-low border-outline-variant"}`}>
                                      <span className={`material-symbols-outlined text-[18px] mt-0.5 ${task.is_done ? "text-green-500" : "text-on-surface-variant"}`}>
                                        {task.is_done ? "check_circle" : "radio_button_unchecked"}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex justify-between items-start">
                                          <p className={`text-sm font-medium ${task.is_done ? "line-through text-on-surface-variant" : "text-on-surface"}`}>{task.description}</p>
                                          <span className="text-xs font-bold text-primary shrink-0 ml-2">{task.hours}h</span>
                                        </div>
                                        <span className="text-xs text-on-surface-variant mt-0.5 inline-block">{task.subject} · {task.date}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-surface-container-lowest rounded-xl border border-outline-variant"
                >
                  <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30">touch_app</span>
                  <p className="font-bold text-on-surface mt-4">Select a student</p>
                  <p className="text-sm text-on-surface-variant mt-1">Click on a student from the list to view & manage their study plan</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
