# Pathwise - Progress Tracker

## 2026-07-22 - Phase 1: Foundation
- Scaffolding for backend set up (FastAPI + uvicorn) with `/health` route.
- Initial SQL migrations for database schema created (users, student_profiles, scores, subjects_analysis, study_plans, tasks, exam_dates).
- Scaffolding for frontend set up (Next.js + TypeScript + Tailwind + shadcn/ui) with placeholder homepage and pastel theme configurations.
- Consolidated directory structure to use the cloned `PathWise` repository.

## 2026-07-22 - Phase 2: Auth + Excel Upload
- Added Supabase auth integration (signup, login endpoints) in FastAPI.
- Created frontend login page with toggleable signup/login forms.
- Added POST /upload-scores endpoint utilizing pandas for .xlsx parsing and validation.
- Built frontend dropzone page for file uploads at /upload.

## 2026-07-22 - Phase 3: AI Brain + Dashboard + Study Plan
- Added google-generativeai for Gemini integration.
- Created new wellbeing_checkins migration.
- Built /analysis/{student_id} to compute averages/trends and hit Gemini for subject classification.
- Built /exam-dates and /study-plan/{student_id} with Gemini AI scheduling and self-correction regen logic.
- Built /checkin/{student_id} for Industry 5.0 adaptive mood-based study reductions.
- Built /readiness/{student_id} formula.
- Created frontend /dashboard page with subject cards, streak ring, readiness ring, and checklist.
- Created frontend /plan page for daily scheduling.
- Modified /login to store student_id on auth.
