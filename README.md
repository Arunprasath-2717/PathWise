# PathWise: AI-Powered Academic Companion

PathWise is an intelligent, end-to-end academic dashboard designed to help students optimize their study habits and track their performance. Built as a comprehensive full-stack application, PathWise leverages AI to generate dynamic, personalized study plans based on a student's actual performance data.

## Project Insights & Architecture

This project is separated into a **Frontend** (Next.js/React) and a **Backend** (FastAPI/Python), integrated seamlessly via RESTful endpoints.

### 1. Frontend (Next.js + Tailwind CSS + Framer Motion)
- **Modern UI/UX**: The application uses a beautifully customized Material Design 3 (M3) inspired aesthetic, featuring a dynamic layout, glassmorphism elements, and smooth `framer-motion` animations.
- **Secure Authentication**: Built-in integration with Firebase Auth handles user signup, login, and secure token issuance.
- **Dynamic Dashboard**: The dashboard provides real-time progress indicators (Subjects, Internships, LinkedIn, Hackathons), upcoming deadline tracking, and an **AI Smart Insights** module that simulates intelligent alerts.
- **Data Uploads**: Users can upload their `.csv` or `.xlsx` grade files seamlessly via a drag-and-drop interface, kicking off the backend data pipeline.

### 2. Backend (FastAPI + Supabase + Groq AI)
- **High-Performance API**: The Python FastAPI backend serves as a lightning-fast router between the client, database, and LLM services.
- **Database (Supabase)**: A relational PostgreSQL schema manages `users`, `student_profiles`, `scores`, `subjects_analysis`, `study_plans`, and `tasks`. We implemented robust synchronization to ensure UUID integrity when users log in.
- **LLM Integration (Groq)**: PathWise uses Groq's blazing-fast inference engine to run `llama3-8b-8192`. The AI analyzes uploaded grades, determines weak/strong subjects, and generates a structured, day-by-day actionable study plan that directly populates the frontend UI.

## Setup & Local Development

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
*(Requires `.env` with `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `GROQ_API_KEY`, plus `serviceAccountKey.json` for Firebase Admin).*

## Core Features Flow
1. **Sync**: User authenticates via Firebase; frontend pings `/sync-user` to ensure database UUID parity.
2. **Upload**: User uploads grades; backend parses and inserts into Supabase.
3. **Analyze**: Backend triggers AI via `/analysis` to classify subject strengths.
4. **Plan**: User requests a study plan; AI returns structured JSON tasks that the frontend beautifully renders into an interactive schedule.
