import os
from dotenv import load_dotenv
from supabase import create_client
import uuid

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SECRET_KEY"))

fake_uid = "YjHkTesting123"
user_id = str(uuid.uuid5(uuid.NAMESPACE_OID, fake_uid))

try:
    print("Testing insert into users...")
    supabase.table("users").insert({
        "id": user_id,
        "email": "testsync@gmail.com",
        "password_hash": "handled_by_firebase",
        "role": "student"
    }).execute()
    print("Success inserting into users!")
    
    print("Testing insert into student_profiles...")
    supabase.table("student_profiles").insert({
        "user_id": user_id
    }).execute()
    print("Success inserting into student_profiles!")
except Exception as e:
    print(f"ERROR: {e}")
