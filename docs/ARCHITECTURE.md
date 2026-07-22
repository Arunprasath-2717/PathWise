# Pathwise Architecture

## Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, shadcn/ui components (Pastel theme), Firebase Auth client SDK.
- **Backend**: FastAPI (Python), Pandas (data processing), firebase-admin (Auth verification).
- **Database**: Supabase PostgreSQL.
- **AI Brain**: Groq API (`llama3-8b-8192`).

## API Routes
- `GET /health`: Health check endpoint.
- `POST /signup`: Register a new student user via Supabase Auth.
- `POST /login`: Authenticate and receive a session JWT.
- `POST /upload-scores`: Accept an .xlsx file, parse it using Pandas, and insert scores for the authenticated user.
- `GET /student-profile`: Fetches student ID for logged-in user.
- `GET /analysis/{student_id}`: AI subject classification (weak/avg/strong).
- `POST /exam-dates` & `GET /study-plan/{student_id}`: AI study planner with self-correction.
- `POST /checkin/{student_id}`: Adaptive wellbeing tracker.
- `GET /readiness/{student_id}`: Computed career readiness score.
- `GET /dashboard/{student_id}`: Aggregated dashboard summary.

## Database Tables
- `users`: Core user authentication and roles.
- `student_profiles`: Student-specific data (resume, domains, skills).
- `scores`: Individual test scores for students.
- `subjects_analysis`: AI-generated analysis of student performance per subject.
- `study_plans`: High-level study plans.
- `tasks`: Daily or specific tasks linked to study plans.
- `exam_dates`: Target exam dates for subjects.
- `wellbeing_checkins`: Tracks daily student mood and stores encouraging AI notes.

