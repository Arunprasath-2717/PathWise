export interface User {
  name: string;
  role: string;
  avatar: string;
  major: string;
  year: string;
  email: string;
  id: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  score: number;
  trend: "up" | "down" | "flat";
  status: "strong" | "average" | "weak";
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  type?: string;
}

export interface StudyBlock {
  id: string;
  title: string;
  type: string;
  time: string;
  duration: string;
  colorClass: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
  risk: "high" | "medium" | "low";
  engagement: number;
  lastActive: string;
  trend: "up" | "down" | "flat";
}

export const mockUser: User = {
  name: "Alex",
  role: "Student",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  major: "Computer Science",
  year: "Sophomore",
  email: "alex@pathwise.edu",
  id: "STU-84920"
};

export const mockSubjects: Subject[] = [
  { id: "1", name: "Data Structures", code: "CS201", score: 92, trend: "up", status: "strong" },
  { id: "2", name: "Linear Algebra", code: "MATH210", score: 85, trend: "up", status: "average" },
  { id: "3", name: "Physics I", code: "PHYS101", score: 74, trend: "down", status: "weak" }
];

export const mockTasks: Task[] = [
  { id: "t1", title: "Review CS201 Notes", completed: true, time: "9:00 AM", type: "Study" },
  { id: "t2", title: "Complete Physics Lab Report", completed: false, time: "2:00 PM", type: "Assignment" },
  { id: "t3", title: "Read Chapter 4 (Math)", completed: false, type: "Reading" },
  { id: "t4", title: "Group Project Meeting", completed: false, time: "4:30 PM", type: "Meeting" }
];

export const mockStudyBlocks: StudyBlock[] = [
  { id: "b1", title: "Data Structures Review", type: "Deep Work", time: "9:00 AM", duration: "90 min", colorClass: "bg-surface-container-high" },
  { id: "b2", title: "Linear Algebra Problem Set", type: "Practice", time: "11:00 AM", duration: "60 min", colorClass: "bg-primary-container text-on-primary-container" },
  { id: "b3", title: "Physics Lab Write-up", type: "Assignment", time: "2:00 PM", duration: "120 min", colorClass: "bg-surface-container-high" }
];

export const mockStudents: Student[] = [
  { id: "STU-001", name: "Alex Chen", email: "alex.c@pathwise.edu", major: "Computer Science", risk: "low", engagement: 92, lastActive: "2h ago", trend: "up" },
  { id: "STU-002", name: "Sarah Jenkins", email: "s.jenkins@pathwise.edu", major: "Biology", risk: "medium", engagement: 78, lastActive: "1d ago", trend: "down" },
  { id: "STU-003", name: "Marcus Johnson", email: "mjohnson@pathwise.edu", major: "Business", risk: "high", engagement: 45, lastActive: "5d ago", trend: "down" },
  { id: "STU-004", name: "Emily Wang", email: "ewang@pathwise.edu", major: "Engineering", risk: "low", engagement: 88, lastActive: "4h ago", trend: "up" },
  { id: "STU-005", name: "David Kim", email: "dkim@pathwise.edu", major: "Psychology", risk: "medium", engagement: 65, lastActive: "2d ago", trend: "flat" }
];
