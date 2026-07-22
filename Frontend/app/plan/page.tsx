"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:8000";

interface Task {
  id: string;
  date: string;
  subject: string;
  hours: number;
  description: string;
  is_done: boolean;
}

interface Plan {
  id: string;
  exam_date: string;
  is_active: boolean;
}

interface ExamDate {
  id: string;
  subject: string;
  exam_date: string;
}

export default function StudyPlanPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSubject, setNewSubject] = useState("");
  const [newDate, setNewDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const sid = localStorage.getItem("student_id");
    if (!token) { router.push("/login"); return; }
    if (!sid) { setLoading(false); return; }
    setStudentId(sid);
    loadData(sid);
  }, [router]);

  const loadData = async (sid: string) => {
    setLoading(true);
    const [planRes, examRes] = await Promise.all([
      fetch(`${API}/study-plan/${sid}`),
      fetch(`${API}/exam-dates/${sid}`),
    ]);
    const planData = await planRes.json();
    const examData = await examRes.json();
    setPlan(planData.plan);
    setTasks(planData.tasks || []);
    setExamDates(examData.exam_dates || []);
    setLoading(false);
  };

  const addExamDate = async () => {
    if (!studentId || !newSubject || !newDate) return;
    await fetch(`${API}/exam-dates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, subject: newSubject, exam_date: newDate }),
    });
    setNewSubject("");
    setNewDate("");
    loadData(studentId);
  };

  const generatePlan = async () => {
    if (!studentId) return;
    setLoading(true);
    await fetch(`${API}/generate-study-plan/${studentId}`, { method: "POST" });
    loadData(studentId);
  };

  const toggleTask = async (taskId: string) => {
    await fetch(`${API}/tasks/${taskId}/toggle`, { method: "POST" });
    if (studentId) loadData(studentId);
  };

  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  tasks.forEach(t => {
    if (!tasksByDate[t.date]) tasksByDate[t.date] = [];
    tasksByDate[t.date].push(t);
  });
  const sortedDates = Object.keys(tasksByDate).sort();

  const today = new Date().toISOString().split("T")[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-lavender)]">
      <div className="animate-pulse text-xl text-gray-600">Loading study plan...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--primary-lavender)] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Study Plan</h1>
            <p className="text-gray-500 mt-1">Your AI-generated day-by-day schedule</p>
          </div>
          <Link href="/dashboard" className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700 text-sm font-medium">
            ← Dashboard
          </Link>
        </div>

        {/* Add Exam Date */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border-t-4 border-[var(--accent-peach)]">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Exam Date</h2>
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-600 mb-1">Subject</label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--accent-sky)] focus:border-[var(--accent-sky)]"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-600 mb-1">Exam Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--accent-sky)] focus:border-[var(--accent-sky)]"
              />
            </div>
            <button
              onClick={addExamDate}
              className="px-6 py-2 bg-[var(--accent-peach)] rounded-md hover:bg-orange-200 transition-colors text-gray-800 font-medium"
            >
              Add
            </button>
          </div>

          {/* Saved Exam Dates */}
          {examDates.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {examDates.map(ed => (
                <span key={ed.id} className="px-3 py-1 bg-orange-50 rounded-full text-sm text-orange-700 border border-orange-200">
                  {ed.subject}: {ed.exam_date}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Generate Plan Button */}
        <div className="text-center mb-8">
          <button
            onClick={generatePlan}
            className="px-8 py-3 bg-[var(--accent-sky)] rounded-xl hover:bg-blue-200 transition-colors text-gray-800 font-bold text-lg shadow-sm hover:shadow-md"
          >
            ✨ Generate AI Study Plan
          </button>
        </div>

        {/* Day-by-Day Cards */}
        {sortedDates.length > 0 ? (
          <div className="space-y-4">
            {sortedDates.map(d => {
              const isToday = d === today;
              const dayTasks = tasksByDate[d];
              const allDone = dayTasks.every(t => t.is_done);
              const dateObj = new Date(d + "T00:00:00");
              const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
              const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              const totalHours = dayTasks.reduce((s, t) => s + t.hours, 0);

              return (
                <div
                  key={d}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${isToday ? "ring-2 ring-[var(--accent-sky)]" : ""}`}
                >
                  <div className={`px-6 py-3 flex items-center justify-between ${isToday ? "bg-blue-50" : allDone ? "bg-green-50" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-3">
                      {isToday && <span className="px-2 py-0.5 bg-[var(--accent-sky)] rounded text-xs font-bold text-white">TODAY</span>}
                      <h3 className="font-semibold text-gray-800">{dayName}, {dateStr}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{totalHours}h total</span>
                      {allDone && <span className="text-green-600 font-medium">✓ Complete</span>}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {dayTasks.map(t => (
                      <div
                        key={t.id}
                        className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${t.is_done ? "opacity-60" : ""}`}
                        onClick={() => toggleTask(t.id)}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${t.is_done ? "bg-green-400 border-green-400" : "border-gray-300"}`}>
                          {t.is_done && <span className="text-white text-xs">✓</span>}
                        </div>
                        <div className="flex-1">
                          <p className={`text-gray-800 ${t.is_done ? "line-through" : ""}`}>{t.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-50 rounded-full text-xs text-purple-700 font-medium">{t.subject}</span>
                        <span className="text-sm text-gray-500">{t.hours}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            <p className="text-xl mb-2">No study plan yet</p>
            <p className="text-sm">Add exam dates above and click &quot;Generate AI Study Plan&quot; to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
