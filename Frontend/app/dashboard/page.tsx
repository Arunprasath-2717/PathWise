"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:8000";

interface SubjectAnalysis {
  subject: string;
  status: string;
  reason: string;
  avg_score: number;
  trend: string;
}

interface Task {
  id: string;
  subject: string;
  hours: number;
  description: string;
  is_done: boolean;
}

interface Wellbeing {
  mood: string;
  note: string | null;
}

interface ReadinessData {
  readiness: number;
  avg_score: number;
  task_completion: number;
  wellbeing_avg: number;
  total_tasks: number;
  done_tasks: number;
}

interface DashboardData {
  analysis: SubjectAnalysis[];
  today_tasks: Task[];
  streak: number;
  wellbeing: Wellbeing | null;
  readiness: ReadinessData;
}

function statusColor(status: string) {
  switch (status) {
    case "weak": return "bg-red-100 text-red-700 border-red-200";
    case "average": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "strong": return "bg-green-100 text-green-700 border-green-200";
    default: return "bg-gray-100 text-gray-700";
  }
}

function trendIcon(trend: string) {
  switch (trend) {
    case "improving": return "↗️";
    case "declining": return "↘️";
    case "stable": return "→";
    default: return "•";
  }
}

function ReadinessRing({ value }: { value: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? "#86efac" : value >= 40 ? "#fde68a" : "#fca5a5";

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{value}%</span>
        <span className="text-xs text-gray-500">Readiness</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [wellbeingNote, setWellbeingNote] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const sid = localStorage.getItem("student_id");
    if (!token) { router.push("/login"); return; }
    if (!sid) { setError("No student profile found. Please upload scores first."); setLoading(false); return; }
    setStudentId(sid);

    fetch(`${API}/dashboard/${sid}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [router]);

  const handleMood = async (mood: string) => {
    if (!studentId) return;
    setSelectedMood(mood);
    const res = await fetch(`${API}/checkin/${studentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood }),
    });
    const d = await res.json();
    if (d.note) setWellbeingNote(d.note);
  };

  const toggleTask = async (taskId: string) => {
    await fetch(`${API}/tasks/${taskId}/toggle`, { method: "POST" });
    // Refresh
    if (studentId) {
      const r = await fetch(`${API}/dashboard/${studentId}`);
      const d = await r.json();
      setData(d);
    }
  };

  const runAnalysis = async () => {
    if (!studentId) return;
    setLoading(true);
    await fetch(`${API}/analysis/${studentId}`);
    const r = await fetch(`${API}/dashboard/${studentId}`);
    const d = await r.json();
    setData(d);
    setLoading(false);
  };

  const generatePlan = async () => {
    if (!studentId) return;
    setLoading(true);
    await fetch(`${API}/generate-study-plan/${studentId}`, { method: "POST" });
    const r = await fetch(`${API}/dashboard/${studentId}`);
    const d = await r.json();
    setData(d);
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-lavender)]">
      <div className="animate-pulse text-xl text-gray-600">Loading your dashboard...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-lavender)]">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/upload" className="text-[var(--accent-sky)] hover:underline">Go to Upload</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--primary-lavender)] p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pathwise Dashboard</h1>
            <p className="text-gray-500 mt-1">Your AI-powered study companion</p>
          </div>
          <div className="flex gap-3">
            <Link href="/upload" className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700 text-sm font-medium">
              Upload Scores
            </Link>
            <Link href="/plan" className="px-4 py-2 bg-[var(--accent-sky)] rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-800 text-sm font-medium">
              Study Plan
            </Link>
          </div>
        </div>

        {/* Top Row: Readiness + Streak + Wellbeing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Career Readiness Ring */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center border-t-4 border-[var(--accent-peach)]">
            <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Career Readiness</h2>
            <ReadinessRing value={data?.readiness.readiness || 0} />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center w-full">
              <div>
                <p className="text-lg font-bold text-gray-800">{data?.readiness.avg_score || 0}%</p>
                <p className="text-xs text-gray-500">Avg Score</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{data?.readiness.task_completion || 0}%</p>
                <p className="text-xs text-gray-500">Tasks Done</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{data?.readiness.wellbeing_avg || 0}%</p>
                <p className="text-xs text-gray-500">Wellbeing</p>
              </div>
            </div>
          </div>

          {/* Streak Badge */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center border-t-4 border-[var(--accent-mint)]">
            <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Study Streak</h2>
            <div className="text-6xl mb-2">🔥</div>
            <p className="text-4xl font-bold text-gray-800">{data?.streak || 0}</p>
            <p className="text-gray-500 text-sm mt-1">consecutive days</p>
          </div>

          {/* Wellbeing Check-in */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-[var(--accent-blush)]">
            <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">How are you feeling?</h2>
            {data?.wellbeing && !selectedMood ? (
              <div className="text-center">
                <p className="text-2xl mb-2">
                  {data.wellbeing.mood === "good" ? "😊" : data.wellbeing.mood === "okay" ? "😐" : "😔"}
                </p>
                <p className="text-gray-600 capitalize">{data.wellbeing.mood}</p>
                {data.wellbeing.note && (
                  <p className="mt-3 text-sm italic text-purple-600 bg-purple-50 rounded-lg p-3">{data.wellbeing.note}</p>
                )}
              </div>
            ) : selectedMood ? (
              <div className="text-center">
                <p className="text-2xl mb-2">
                  {selectedMood === "good" ? "😊" : selectedMood === "okay" ? "😐" : "😔"}
                </p>
                <p className="text-gray-600 capitalize">{selectedMood} — recorded!</p>
                {wellbeingNote && (
                  <p className="mt-3 text-sm italic text-purple-600 bg-purple-50 rounded-lg p-3">{wellbeingNote}</p>
                )}
              </div>
            ) : (
              <div className="flex gap-4 justify-center mt-6">
                {[
                  { mood: "low", emoji: "😔", label: "Low" },
                  { mood: "okay", emoji: "😐", label: "Okay" },
                  { mood: "good", emoji: "😊", label: "Good" },
                ].map(m => (
                  <button
                    key={m.mood}
                    onClick={() => handleMood(m.mood)}
                    className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <span className="text-3xl mb-1">{m.emoji}</span>
                    <span className="text-sm text-gray-600">{m.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subject Analysis Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Subject Analysis</h2>
            <button onClick={runAnalysis} className="text-sm px-4 py-2 bg-[var(--accent-sky)] rounded-lg hover:bg-blue-200 transition-colors text-gray-800 font-medium">
              Run AI Analysis
            </button>
          </div>
          {data?.analysis && data.analysis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.analysis.map((a, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">{a.subject}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(a.status)}`}>
                      {a.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{a.reason}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Avg: {a.avg_score}%</span>
                    <span>{trendIcon(a.trend)} {a.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
              <p>No analysis yet. Upload scores and click &quot;Run AI Analysis&quot; to get started.</p>
            </div>
          )}
        </div>

        {/* Today's Checklist */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Today&apos;s Checklist</h2>
            <button onClick={generatePlan} className="text-sm px-4 py-2 bg-[var(--accent-mint)] rounded-lg hover:bg-green-200 transition-colors text-gray-800 font-medium border border-green-200">
              Generate Study Plan
            </button>
          </div>
          {data?.today_tasks && data.today_tasks.length > 0 ? (
            <div className="space-y-3">
              {data.today_tasks.map((t) => (
                <div
                  key={t.id}
                  className={`bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer ${t.is_done ? "opacity-60" : ""}`}
                  onClick={() => toggleTask(t.id)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${t.is_done ? "bg-green-400 border-green-400" : "border-gray-300"}`}>
                    {t.is_done && <span className="text-white text-sm">✓</span>}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-gray-800 ${t.is_done ? "line-through" : ""}`}>{t.description}</p>
                    <p className="text-sm text-gray-500">{t.subject} · {t.hours}h</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
              <p>No tasks for today. Generate a study plan to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
