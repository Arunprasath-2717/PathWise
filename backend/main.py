import os
import hashlib
import json
import pandas as pd
from datetime import date, datetime, timedelta
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Header, Cookie, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
from groq import Groq
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
import uuid

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY) if SUPABASE_URL and SUPABASE_SECRET_KEY else None

FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS", "serviceAccountKey.json")
try:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS)
    firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Warning: Firebase Admin not initialized ({e})")

app = FastAPI(title="Pathwise API")

# Allow frontend origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients


if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)
else:
    groq_client = None

# ─── Pydantic Models ─────────────────────────────────────────────────────────

class AuthRequest(BaseModel):
    email: str
    password: str

class ExamDateRequest(BaseModel):
    student_id: str
    subject: str
    exam_date: str  # YYYY-MM-DD

class WellbeingRequest(BaseModel):
    student_id: str
    mood: str  # low, okay, good

class SubjectAnalysis(BaseModel):
    subject: str
    status: str  # weak, average, strong
    reason: str
    avg_score: float
    trend: str

class DayTask(BaseModel):
    date: str
    subject: str
    hours: float
    description: str

class FacultyLoginRequest(BaseModel):
    email: str
    password: str

# ─── Faculty Session Store ───────────────────────────────────────────────────

# Simple in-memory session store for faculty (no Firebase needed)
faculty_sessions: dict[str, dict] = {}

# Default faculty credentials (in production, store in DB with hashed passwords)
FACULTY_CREDENTIALS = {
    "faculty@pathwise.edu": hashlib.sha256("faculty123".encode()).hexdigest(),
    "admin@pathwise.edu": hashlib.sha256("admin123".encode()).hexdigest(),
}

def get_faculty_session(session_id: str = Cookie(None, alias="faculty_session")):
    if not session_id or session_id not in faculty_sessions:
        raise HTTPException(status_code=401, detail="Faculty session expired or invalid. Please login.")
    return faculty_sessions[session_id]

# ─── Auth Helper ──────────────────────────────────────────────────────────────

class FirebaseUser:
    def __init__(self, uid: str, email: str):
        self.id = str(uuid.uuid5(uuid.NAMESPACE_OID, uid))
        self.email = email
        self.firebase_uid = uid

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing Authorization header")
    
    token = authorization.split(" ")[1]
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return FirebaseUser(uid=decoded_token['uid'], email=decoded_token.get('email', ''))
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {str(e)}")

# ─── LLM Helper ────────────────────────────────────────────────────────────

def call_llm(prompt: str) -> str:
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq API key not configured")
    completion = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
    )
    return completion.choices[0].message.content

# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/student-profile")
async def get_student_profile(current_user = Depends(get_current_user)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    profile_res = supabase.table("student_profiles").select("id").eq("user_id", current_user.id).execute()
    if not profile_res.data:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return {"student_id": profile_res.data[0]["id"], "user_id": current_user.id}

# ─── Auth Sync ─────────────────────────────────────────────────────────────────

@app.post("/sync-user")
def sync_user(current_user = Depends(get_current_user)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    try:
        existing = supabase.table("users").select("id").eq("id", current_user.id).execute()
        if not existing.data:
            user_data = {
                "id": current_user.id,
                "email": current_user.email,
                "password_hash": "handled_by_firebase",
                "role": "student"
            }
            supabase.table("users").insert(user_data).execute()
        
        # Always ensure profile exists
        profile_existing = supabase.table("student_profiles").select("id").eq("user_id", current_user.id).execute()
        if not profile_existing.data:
            profile_data = {
                "user_id": current_user.id
            }
            supabase.table("student_profiles").insert(profile_data).execute()
            
        return {"message": "User synced successfully", "id": current_user.id}
    except Exception as e:
        print(f"SYNC ERROR DETAILS: {repr(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ─── Upload Scores ────────────────────────────────────────────────────────────

@app.post("/upload-scores")
async def upload_scores(file: UploadFile = File(...), current_user = Depends(get_current_user)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    fname = (file.filename or "").lower()
    if not (fname.endswith('.xlsx') or fname.endswith('.xls') or fname.endswith('.csv')):
        raise HTTPException(status_code=400, detail="Only .csv, .xls, and .xlsx files are supported")
    
    try:
        # Get student_id
        import time
        profile_res = None
        for attempt in range(3):
            try:
                profile_res = supabase.table("student_profiles").select("id").eq("user_id", current_user.id).execute()
                break
            except Exception as e:
                if attempt == 2: raise e
                time.sleep(1)
        
        if not profile_res or not profile_res.data:
            raise HTTPException(status_code=404, detail="Student profile not found")
        student_id = profile_res.data[0]['id']

        # Read file — handle mislabeled extensions
        raw_bytes = await file.read()
        if len(raw_bytes) == 0:
            raise HTTPException(status_code=400, detail="File is empty")
        
        import io
        df = None
        if fname.endswith('.csv'):
            try:
                df = pd.read_csv(io.BytesIO(raw_bytes))
            except Exception:
                # Maybe it's actually an Excel file mislabeled as .csv
                try:
                    df = pd.read_excel(io.BytesIO(raw_bytes))
                except Exception:
                    raise HTTPException(status_code=400, detail="Could not parse file. Ensure it is a valid CSV or Excel file.")
        else:
            try:
                df = pd.read_excel(io.BytesIO(raw_bytes))
            except Exception:
                # Maybe it's actually a CSV file mislabeled as .xlsx
                try:
                    df = pd.read_csv(io.BytesIO(raw_bytes))
                except Exception:
                    raise HTTPException(status_code=400, detail="Could not parse file. Ensure it is a valid CSV or Excel file.")
        
        if df is None or df.empty:
            raise HTTPException(status_code=400, detail="File contains no data rows")
        
        # Drop completely blank rows
        df = df.dropna(how='all').reset_index(drop=True)
        if df.empty:
            raise HTTPException(status_code=400, detail="File contains only blank rows")
        
        # Normalize column names
        df.columns = df.columns.astype(str).str.strip().str.lower()
        
        import datetime as dt
        today_str = dt.datetime.now().strftime('%Y-%m-%d')
        
        records = []
        skipped = 0
        errors_detail = []
        
        # Detect format: wide vs long
        marks_cols = [c for c in df.columns if ('marks' in c or 'score' in c) and 'max' not in c]
        is_wide = 'student_name' in df.columns and len(marks_cols) > 0 and 'subject' not in df.columns
        
        if is_wide:
            for idx, row in df.iterrows():
                for col in marks_cols:
                    subject = col.replace('_marks', '').replace('_score', '').replace('_', ' ').strip().title()
                    if not subject:
                        skipped += 1
                        continue
                    try:
                        score = float(row[col])
                        if pd.isna(score):
                            skipped += 1
                            continue
                        # Clamp negative scores to 0
                        score = max(0, score)
                        records.append({
                            "student_id": student_id,
                            "subject": subject[:100],
                            "test_name": "General Assessment",
                            "score": round(score, 2),
                            "max_score": 100.0,
                            "test_date": today_str
                        })
                    except (ValueError, TypeError):
                        skipped += 1
        else:
            # Long format — map columns flexibly
            col_map = {}
            for c in df.columns:
                cl = c.lower()
                if 'subject' in cl and 'subject' not in col_map:
                    col_map['subject'] = c
                elif ('name' in cl and 'test' not in cl) and 'student_name' not in col_map:
                    col_map['student_name'] = c
                elif ('test' in cl or 'exam' in cl) and 'name' in cl and 'test_name' not in col_map:
                    col_map['test_name'] = c
                elif 'max' in cl and ('score' in cl or 'mark' in cl) and 'max_score' not in col_map:
                    col_map['max_score'] = c
                elif ('score' in cl or 'mark' in cl) and 'max' not in cl and 'score' not in col_map:
                    col_map['score'] = c
                elif 'date' in cl and 'date' not in col_map:
                    col_map['date'] = c
            
            # Minimum required: subject + score
            if 'subject' not in col_map or 'score' not in col_map:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Missing required columns: need at least 'subject' and 'score'. Found columns: {list(df.columns)}"
                )

            for idx, row in df.iterrows():
                try:
                    # Subject
                    subj_raw = row.get(col_map.get('subject', ''), None)
                    if pd.isna(subj_raw) or str(subj_raw).strip() == '':
                        skipped += 1
                        continue
                    subject = str(subj_raw).strip().title()[:100]
                    
                    # Score
                    score_raw = row.get(col_map.get('score', ''), None)
                    if pd.isna(score_raw):
                        skipped += 1
                        continue
                    try:
                        score = float(score_raw)
                    except (ValueError, TypeError):
                        skipped += 1
                        continue
                    score = max(0, score)
                    
                    # Max score
                    max_score = 100.0
                    if 'max_score' in col_map:
                        try:
                            ms = float(row[col_map['max_score']])
                            if not pd.isna(ms) and ms > 0:
                                max_score = ms
                        except (ValueError, TypeError):
                            pass
                    # Guard against zero/negative max_score
                    if max_score <= 0:
                        max_score = 100.0
                    
                    # Clamp score to max_score
                    if score > max_score:
                        score = max_score
                    
                    # Test name
                    test_name = "General Assessment"
                    if 'test_name' in col_map:
                        tn = row.get(col_map['test_name'], '')
                        if not pd.isna(tn) and str(tn).strip():
                            test_name = str(tn).strip()[:100]
                    
                    # Date
                    test_date = today_str
                    if 'date' in col_map:
                        date_raw = row.get(col_map['date'], '')
                        if not pd.isna(date_raw) and str(date_raw).strip():
                            try:
                                test_date = pd.to_datetime(date_raw, dayfirst=False, errors='coerce')
                                if pd.isna(test_date):
                                    test_date = today_str
                                else:
                                    test_date = test_date.strftime('%Y-%m-%d')
                            except Exception:
                                test_date = today_str
                    
                    records.append({
                        "student_id": student_id,
                        "subject": subject,
                        "test_name": test_name,
                        "score": round(score, 2),
                        "max_score": round(max_score, 2),
                        "test_date": test_date
                    })
                except Exception as row_err:
                    skipped += 1
        
        # Deduplicate (same subject + test_name + date)
        seen = set()
        unique_records = []
        for r in records:
            key = (r["subject"], r["test_name"], r["test_date"])
            if key not in seen:
                seen.add(key)
                unique_records.append(r)
        
        deduped = len(records) - len(unique_records)
        records = unique_records
        
        if not records:
            raise HTTPException(
                status_code=400, 
                detail=f"No valid score rows found. {skipped} rows skipped due to missing/invalid data."
            )
        
        # Insert in batches
        chunk_size = 50
        for i in range(0, len(records), chunk_size):
            chunk = records[i:i + chunk_size]
            for attempt in range(3):
                try:
                    supabase.table("scores").insert(chunk).execute()
                    break
                except Exception as e:
                    if attempt == 2: raise e
                    time.sleep(1)
        
        msg = f"Successfully uploaded {len(records)} scores"
        if skipped > 0:
            msg += f" ({skipped} rows skipped due to invalid data)"
        if deduped > 0:
            msg += f" ({deduped} duplicates removed)"
        
        return {"message": msg, "inserted": len(records), "skipped": skipped, "deduplicated": deduped}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


# ─── Analysis Endpoint ────────────────────────────────────────────────────────

@app.get("/analysis/{student_id}")
def get_analysis(student_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    # Fetch all scores for the student
    scores_res = supabase.table("scores").select("*").eq("student_id", student_id).order("test_date").execute()
    if not scores_res.data:
        return {"analysis": []}
    
    # Group scores by subject and compute avg + trend
    subjects = {}
    for row in scores_res.data:
        subj = row["subject"]
        if subj not in subjects:
            subjects[subj] = []
        subjects[subj].append({
            "score": float(row["score"]),
            "max_score": float(row["max_score"]),
            "date": row["test_date"]
        })
    
    subject_stats = []
    for subj, entries in subjects.items():
        percentages = [(e["score"] / e["max_score"]) * 100 for e in entries if e["max_score"] > 0]
        avg = sum(percentages) / len(percentages) if percentages else 0
        # Trend: compare first half avg to second half avg
        if len(percentages) >= 2:
            mid = len(percentages) // 2
            first_half = sum(percentages[:mid]) / mid
            second_half = sum(percentages[mid:]) / (len(percentages) - mid)
            if second_half > first_half + 5:
                trend = "improving"
            elif second_half < first_half - 5:
                trend = "declining"
            else:
                trend = "stable"
        else:
            trend = "insufficient_data"
        
        subject_stats.append({
            "subject": subj,
            "avg_score": round(avg, 2),
            "trend": trend
        })
    
    # Ask Gemini to classify subjects
    prompt = f"""You are an educational AI mentor. Analyze these student subject statistics and classify each as weak, average, or strong. Give a one-line reason for each.

Subject data:
{json.dumps(subject_stats, indent=2)}

Respond ONLY with a valid JSON array like this, no markdown formatting, no code fences:
[
  {{"subject": "Math", "status": "weak", "reason": "Consistently below 50% with declining trend", "avg_score": 45.5, "trend": "declining"}},
  ...
]"""

    try:
        raw = call_llm(prompt)
        # Clean response - strip markdown fences if present
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
        
        analyses = json.loads(cleaned)
        
        # Validate with Pydantic
        validated = [SubjectAnalysis(**a) for a in analyses]
        
        # Save to subjects_analysis (upsert: delete old, insert new)
        supabase.table("subjects_analysis").delete().eq("student_id", student_id).execute()
        for v in validated:
            supabase.table("subjects_analysis").insert({
                "student_id": student_id,
                "subject": v.subject,
                "status": v.status,
                "reason": v.reason,
                "avg_score": v.avg_score,
                "trend": v.trend
            }).execute()
        
        return {"analysis": [v.model_dump() for v in validated]}
    except json.JSONDecodeError as e:
        print(f"GEMINI JSON PARSE ERROR: {raw}")
        raise HTTPException(status_code=500, detail=f"Failed to parse Gemini response: {str(e)}")
    except Exception as e:
        print(f"ANALYSIS ERROR: {repr(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ─── Exam Dates ───────────────────────────────────────────────────────────────

@app.post("/exam-dates")
def save_exam_date(req: ExamDateRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    try:
        supabase.table("exam_dates").insert({
            "student_id": req.student_id,
            "subject": req.subject,
            "exam_date": req.exam_date
        }).execute()
        return {"message": "Exam date saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/exam-dates/{student_id}")
def get_exam_dates(student_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    res = supabase.table("exam_dates").select("*").eq("student_id", student_id).execute()
    return {"exam_dates": res.data}

# ─── Study Plan ───────────────────────────────────────────────────────────────

@app.post("/generate-study-plan/{student_id}")
def generate_study_plan(student_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    # Get weak subjects from analysis
    analysis_res = supabase.table("subjects_analysis").select("*").eq("student_id", student_id).execute()
    if not analysis_res.data:
        raise HTTPException(status_code=404, detail="No analysis found. Run /analysis first.")
    
    weak_subjects = [a for a in analysis_res.data if a["status"] in ("weak", "average")]
    if not weak_subjects:
        weak_subjects = analysis_res.data  # If all strong, still make a plan
    
    # Get exam dates
    exam_res = supabase.table("exam_dates").select("*").eq("student_id", student_id).execute()
    
    # Determine earliest exam or default to 14 days from now
    if exam_res.data:
        earliest = min(exam_res.data, key=lambda x: x["exam_date"])
        exam_date_str = earliest["exam_date"]
        exam_date = datetime.strptime(exam_date_str, "%Y-%m-%d").date()
    else:
        exam_date = date.today() + timedelta(days=14)
        exam_date_str = exam_date.isoformat()
    
    days_remaining = (exam_date - date.today()).days
    if days_remaining < 1:
        days_remaining = 7
        exam_date = date.today() + timedelta(days=7)
        exam_date_str = exam_date.isoformat()
    
    # Check recent wellbeing for adaptive hours
    wellbeing_res = supabase.table("wellbeing_checkins").select("*").eq("student_id", student_id).order("date", desc=True).limit(2).execute()
    reduce_hours = False
    if wellbeing_res.data and len(wellbeing_res.data) >= 2:
        if all(w["mood"] == "low" for w in wellbeing_res.data[:2]):
            reduce_hours = True
    
    subjects_info = json.dumps([{"subject": s["subject"], "status": s["status"], "avg_score": s["avg_score"], "trend": s["trend"]} for s in weak_subjects])
    
    base_hours = 4 if not reduce_hours else 3  # 30% reduction from ~4 hrs
    
    prompt = f"""You are a study planner AI. Create a day-by-day study schedule.

Subjects to focus on (prioritize weak ones):
{subjects_info}

Days remaining until exam: {days_remaining}
Start date: {date.today().isoformat()}
Max study hours per day: {base_hours}
{"IMPORTANT: Student has been feeling low recently. Keep sessions lighter and add encouraging task descriptions." if reduce_hours else ""}

Respond ONLY with a valid JSON array, no markdown, no code fences:
[
  {{"date": "2026-07-23", "subject": "Math", "hours": 2.0, "description": "Practice integration problems chapter 5"}},
  ...
]
Generate exactly {min(days_remaining, 14)} days of tasks."""

    try:
        raw = call_llm(prompt)
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
        
        tasks_data = json.loads(cleaned)
        validated = [DayTask(**t) for t in tasks_data]
        
        # Deactivate old plans
        supabase.table("study_plans").update({"is_active": False}).eq("student_id", student_id).eq("is_active", True).execute()
        
        # Create new plan
        plan_res = supabase.table("study_plans").insert({
            "student_id": student_id,
            "exam_date": exam_date_str,
            "is_active": True
        }).execute()
        plan_id = plan_res.data[0]["id"]
        
        # Insert tasks
        for t in validated:
            supabase.table("tasks").insert({
                "study_plan_id": plan_id,
                "date": t.date,
                "subject": t.subject,
                "hours": t.hours,
                "description": t.description,
                "is_done": False
            }).execute()
        
        return {"plan_id": plan_id, "tasks": [t.model_dump() for t in validated]}
    except json.JSONDecodeError as e:
        print(f"GEMINI STUDY PLAN PARSE ERROR: {raw}")
        raise HTTPException(status_code=500, detail=f"Failed to parse Gemini response: {str(e)}")
    except Exception as e:
        print(f"STUDY PLAN ERROR: {repr(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/study-plan/{student_id}")
def get_study_plan(student_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    plan_res = supabase.table("study_plans").select("*").eq("student_id", student_id).eq("is_active", True).execute()
    if not plan_res.data:
        return {"plan": None, "tasks": []}
    
    plan = plan_res.data[0]
    tasks_res = supabase.table("tasks").select("*").eq("study_plan_id", plan["id"]).order("date").execute()
    
    # Self-Correction Logic
    today = date.today().isoformat()
    needs_regen = any(t["date"] < today and not t["is_done"] for t in tasks_res.data)
    
    if needs_regen:
        try:
            generate_study_plan(student_id)
            # Re-fetch after regeneration
            plan_res = supabase.table("study_plans").select("*").eq("student_id", student_id).eq("is_active", True).execute()
            if plan_res.data:
                plan = plan_res.data[0]
                tasks_res = supabase.table("tasks").select("*").eq("study_plan_id", plan["id"]).order("date").execute()
        except Exception as e:
            print(f"Self-correction failed: {e}")
    
    return {"plan": plan, "tasks": tasks_res.data}

# ─── Task Completion Toggle ──────────────────────────────────────────────────

@app.post("/tasks/{task_id}/toggle")
def toggle_task(task_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    task_res = supabase.table("tasks").select("is_done").eq("id", task_id).execute()
    if not task_res.data:
        raise HTTPException(status_code=404, detail="Task not found")
    
    new_status = not task_res.data[0]["is_done"]
    supabase.table("tasks").update({"is_done": new_status}).eq("id", task_id).execute()
    return {"is_done": new_status}

# ─── Wellbeing Check-in ──────────────────────────────────────────────────────

class MoodRequest(BaseModel):
    mood: str

@app.post("/checkin/{student_id}")
def submit_wellbeing(student_id: str, req: MoodRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    today = date.today().isoformat()
    note = None
    
    # Check if two consecutive low days (including today)
    if req.mood == "low":
        recent = supabase.table("wellbeing_checkins").select("mood").eq("student_id", student_id).order("date", desc=True).limit(1).execute()
        if recent.data and recent.data[0]["mood"] == "low":
            # Two low days in a row — get an encouraging note from Gemini
            try:
                raw = call_llm(
                    "A student has been feeling low for two days in a row. "
                    "Write ONE short, warm, encouraging sentence (max 20 words) to lift their spirits. "
                    "Do not use markdown. Just the sentence."
                )
                note = raw.strip().strip('"')
            except Exception:
                note = "Remember: it's okay to take it slow. You're doing great just by showing up."
    
    # Upsert today's check-in
    try:
        existing = supabase.table("wellbeing_checkins").select("id").eq("student_id", student_id).eq("date", today).execute()
        if existing.data:
            supabase.table("wellbeing_checkins").update({
                "mood": req.mood,
                "note": note
            }).eq("id", existing.data[0]["id"]).execute()
        else:
            supabase.table("wellbeing_checkins").insert({
                "student_id": student_id,
                "date": today,
                "mood": req.mood,
                "note": note
            }).execute()
        
        return {"message": "Check-in saved", "note": note, "mood": req.mood}
    except Exception as e:
        print(f"WELLBEING ERROR: {repr(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/wellbeing/{student_id}")
def get_wellbeing(student_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    res = supabase.table("wellbeing_checkins").select("*").eq("student_id", student_id).order("date", desc=True).limit(7).execute()
    return {"checkins": res.data}

# ─── Career Readiness ────────────────────────────────────────────────────────

@app.get("/readiness/{student_id}")
def career_readiness(student_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    # 1. Average score across all subjects (percentage)
    scores_res = supabase.table("scores").select("score,max_score").eq("student_id", student_id).execute()
    if scores_res.data:
        percentages = [(float(s["score"]) / float(s["max_score"])) * 100 for s in scores_res.data if float(s["max_score"]) > 0]
        avg_score = sum(percentages) / len(percentages) if percentages else 0
    else:
        avg_score = 0
    
    # 2. Task completion rate
    plans_res = supabase.table("study_plans").select("id").eq("student_id", student_id).execute()
    total_tasks = 0
    done_tasks = 0
    if plans_res.data:
        plan_ids = [p["id"] for p in plans_res.data]
        for pid in plan_ids:
            tasks_res = supabase.table("tasks").select("is_done").eq("study_plan_id", pid).execute()
            if tasks_res.data:
                total_tasks += len(tasks_res.data)
                done_tasks += sum(1 for t in tasks_res.data if t["is_done"])
    task_completion = (done_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    # 3. Wellbeing average (low=1, okay=2, good=3 → scaled to 0-100)
    wellbeing_res = supabase.table("wellbeing_checkins").select("mood").eq("student_id", student_id).order("date", desc=True).limit(7).execute()
    mood_map = {"low": 1, "okay": 2, "good": 3}
    if wellbeing_res.data:
        mood_scores = [mood_map.get(w["mood"], 2) for w in wellbeing_res.data]
        wellbeing_avg = (sum(mood_scores) / (len(mood_scores) * 3)) * 100
    else:
        wellbeing_avg = 50  # neutral default
    
    # Formula: 0.5*avg_score + 0.3*task_completion + 0.2*wellbeing_avg
    readiness = round(0.5 * avg_score + 0.3 * task_completion + 0.2 * wellbeing_avg, 1)
    
    return {
        "readiness": readiness,
        "avg_score": round(avg_score, 1),
        "task_completion": round(task_completion, 1),
        "wellbeing_avg": round(wellbeing_avg, 1),
        "total_tasks": total_tasks,
        "done_tasks": done_tasks
    }

# ─── Dashboard Summary ───────────────────────────────────────────────────────

@app.get("/dashboard/{student_id}")
def dashboard(student_id: str):
    """Single endpoint that aggregates all dashboard data."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    # Analysis
    analysis_res = supabase.table("subjects_analysis").select("*").eq("student_id", student_id).execute()
    
    # Today's tasks
    today = date.today().isoformat()
    plans_res = supabase.table("study_plans").select("id").eq("student_id", student_id).eq("is_active", True).execute()
    today_tasks = []
    if plans_res.data:
        plan_id = plans_res.data[0]["id"]
        tasks_res = supabase.table("tasks").select("*").eq("study_plan_id", plan_id).eq("date", today).execute()
        today_tasks = tasks_res.data
    
    # Streak: consecutive days with all tasks done
    streak = 0
    if plans_res.data:
        plan_id = plans_res.data[0]["id"]
        all_tasks = supabase.table("tasks").select("date,is_done").eq("study_plan_id", plan_id).order("date", desc=True).execute()
        if all_tasks.data:
            # Group by date
            by_date = {}
            for t in all_tasks.data:
                d = t["date"]
                if d not in by_date:
                    by_date[d] = {"total": 0, "done": 0}
                by_date[d]["total"] += 1
                if t["is_done"]:
                    by_date[d]["done"] += 1
            
            # Count streak backwards from yesterday
            check_date = date.today() - timedelta(days=1)
            while True:
                ds = check_date.isoformat()
                if ds in by_date and by_date[ds]["total"] > 0 and by_date[ds]["done"] == by_date[ds]["total"]:
                    streak += 1
                    check_date -= timedelta(days=1)
                else:
                    break
    
    # Wellbeing
    wellbeing_res = supabase.table("wellbeing_checkins").select("*").eq("student_id", student_id).eq("date", today).execute()
    today_wellbeing = wellbeing_res.data[0] if wellbeing_res.data else None
    
    # Career readiness
    readiness_data = career_readiness(student_id)
    
    return {
        "analysis": analysis_res.data,
        "today_tasks": today_tasks,
        "streak": streak,
        "wellbeing": today_wellbeing,
        "readiness": readiness_data
    }

# ─── Faculty Session Auth ─────────────────────────────────────────────────────

@app.post("/faculty/login")
def faculty_login(req: FacultyLoginRequest, response: Response):
    hashed = hashlib.sha256(req.password.encode()).hexdigest()
    if req.email not in FACULTY_CREDENTIALS or FACULTY_CREDENTIALS[req.email] != hashed:
        raise HTTPException(status_code=401, detail="Invalid faculty credentials")
    
    session_id = str(uuid.uuid4())
    faculty_sessions[session_id] = {"email": req.email, "role": "faculty"}
    
    response.set_cookie(
        key="faculty_session",
        value=session_id,
        httponly=True,
        samesite="lax",
        max_age=86400  # 24 hours
    )
    return {"message": "Faculty login successful", "email": req.email}

@app.post("/faculty/logout")
def faculty_logout(response: Response, session_id: str = Cookie(None, alias="faculty_session")):
    if session_id and session_id in faculty_sessions:
        del faculty_sessions[session_id]
    response.delete_cookie("faculty_session")
    return {"message": "Logged out successfully"}

@app.get("/faculty/me")
def faculty_me(session: dict = Depends(get_faculty_session)):
    return {"email": session["email"], "role": session["role"]}

# ─── Faculty: Low-Scored Students ─────────────────────────────────────────────

@app.get("/faculty/low-scored-students")
def get_low_scored_students(session: dict = Depends(get_faculty_session)):
    """Get all students who have at least one 'weak' subject."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    # Get all weak analyses
    weak_res = supabase.table("subjects_analysis").select("*").eq("status", "weak").execute()
    
    if not weak_res.data:
        return {"students": []}
    
    # Group by student_id
    student_map = {}
    for entry in weak_res.data:
        sid = entry["student_id"]
        if sid not in student_map:
            student_map[sid] = {
                "student_id": sid,
                "weak_subjects": [],
                "email": "",
                "lowest_score": 100
            }
        student_map[sid]["weak_subjects"].append({
            "subject": entry["subject"],
            "avg_score": entry["avg_score"],
            "trend": entry["trend"],
            "reason": entry["reason"]
        })
        if entry["avg_score"] < student_map[sid]["lowest_score"]:
            student_map[sid]["lowest_score"] = entry["avg_score"]
    
    # Fetch user emails
    for sid in student_map:
        profile_res = supabase.table("student_profiles").select("user_id").eq("id", sid).execute()
        if profile_res.data:
            user_id = profile_res.data[0]["user_id"]
            user_res = supabase.table("users").select("email").eq("id", user_id).execute()
            if user_res.data:
                student_map[sid]["email"] = user_res.data[0]["email"]
    
    students = sorted(student_map.values(), key=lambda s: s["lowest_score"])
    return {"students": students}

# ─── Faculty: View Student Study Plan ─────────────────────────────────────────

@app.get("/faculty/student-plan/{student_id}")
def faculty_view_student_plan(student_id: str, session: dict = Depends(get_faculty_session)):
    """Faculty views a student's current active study plan grouped by week/day."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    plans_res = supabase.table("study_plans").select("id").eq("student_id", student_id).eq("is_active", True).execute()
    if not plans_res.data:
        return {"plan": None, "weekly_schedule": {}}
    
    plan_id = plans_res.data[0]["id"]
    tasks_res = supabase.table("tasks").select("*").eq("study_plan_id", plan_id).order("date").execute()
    
    # Group tasks into weekly day-wise schedule
    weekly_schedule = {}
    for task in (tasks_res.data or []):
        task_date = task["date"]
        try:
            dt = datetime.strptime(task_date, "%Y-%m-%d")
            week_num = dt.isocalendar()[1]
            day_name = dt.strftime("%A")
            week_key = f"Week {week_num}"
        except:
            week_key = "Unscheduled"
            day_name = "Unknown"
        
        if week_key not in weekly_schedule:
            weekly_schedule[week_key] = {}
        if day_name not in weekly_schedule[week_key]:
            weekly_schedule[week_key][day_name] = []
        
        weekly_schedule[week_key][day_name].append({
            "id": task["id"],
            "date": task_date,
            "subject": task["subject"],
            "hours": task["hours"],
            "description": task["description"],
            "is_done": task["is_done"]
        })
    
    return {"plan_id": plan_id, "student_id": student_id, "weekly_schedule": weekly_schedule}

# ─── Faculty: Regenerate Student Study Plan ───────────────────────────────────

@app.post("/faculty/regenerate-plan/{student_id}")
def faculty_regenerate_plan(student_id: str, session: dict = Depends(get_faculty_session)):
    """Faculty can regenerate a student's study plan (same AI logic, faculty-triggered)."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    # Reuse the existing generate_study_plan logic
    return generate_study_plan(student_id)
