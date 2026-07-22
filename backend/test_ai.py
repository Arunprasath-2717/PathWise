import os
import time
import requests

API = "http://localhost:8000"
# Get a user by looking at the DB
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SECRET_KEY"))
res = supabase.table("student_profiles").select("id, user_id").limit(1).execute()
if not res.data:
    print("No student profile found")
    exit()

student_id = res.data[0]['id']
user_id = res.data[0]['user_id']
print(f"Using student_id: {student_id}")

# 1. Create a dummy CSV
csv_content = """Student Name,Subject,Test Name,Score,Max Score,Date
Test User,Mathematics,Midterm,85,100,2026-05-01
Test User,Physics,Midterm,45,100,2026-05-02
Test User,History,Midterm,90,100,2026-05-03"""
with open("dummy.csv", "w") as f:
    f.write(csv_content)

# 2. We can't hit POST /upload-scores easily without a valid Firebase JWT token for the Depends(get_current_user).
# So instead, let's just insert the scores directly into Supabase for this test.
print("Inserting scores into DB...")
supabase.table("scores").delete().eq("student_id", student_id).execute()
supabase.table("scores").insert([
    {"student_id": student_id, "subject": "Mathematics", "test_name": "Midterm", "score": 85, "max_score": 100, "test_date": "2026-05-01"},
    {"student_id": student_id, "subject": "Physics", "test_name": "Midterm", "score": 45, "max_score": 100, "test_date": "2026-05-02"},
    {"student_id": student_id, "subject": "History", "test_name": "Midterm", "score": 90, "max_score": 100, "test_date": "2026-05-03"}
]).execute()

# 3. Call the analysis endpoint
print("Calling /analysis endpoint to trigger Gemini...")
resp = requests.get(f"{API}/analysis/{student_id}")
print(f"Status Code: {resp.status_code}")
try:
    print(resp.json())
except:
    print(resp.text)
