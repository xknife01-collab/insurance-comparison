import uuid
import requests
import json

url = "https://wfkxwztxpugakusynhpx.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma3h3enR4cHVnYWt1c3luaHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQwNTY5NiwiZXhwIjoyMDg5OTgxNjk2fQ.1JQWf7hQPwxcgtHRHCASoxeVXwRysMIYXvnhAF5MpHg"

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

agency_id = "88888888-8888-4888-a888-888888888888"

print("=== START SEEDING TEST DATA ===")

# 1. Insert Planners
planners = [
    {
        "id": str(uuid.uuid4()),
        "agency_id": agency_id,
        "planner_code": "planner_test_2",
        "name": "임꺽정",
        "phone": "010-1111-2222",
        "is_admin": False,
        "subscription_status": "active",
        "registration_number": "dist_weight:10",
        "password": "1234",
        "monthly_credit_quota": 10,
        "monthly_credit_used": 0,
        "email": "planner_test_2@test.com"
    },
    {
        "id": str(uuid.uuid4()),
        "agency_id": agency_id,
        "planner_code": "planner_test_3",
        "name": "장길산",
        "phone": "010-3333-4444",
        "is_admin": False,
        "subscription_status": "active",
        "registration_number": "dist_weight:5",
        "password": "1234",
        "monthly_credit_quota": 10,
        "monthly_credit_used": 0,
        "email": "planner_test_3@test.com"
    },
    {
        "id": str(uuid.uuid4()),
        "agency_id": agency_id,
        "planner_code": "planner_test_4",
        "name": "이순신",
        "phone": "010-5555-6666",
        "is_admin": False,
        "subscription_status": "active",
        "registration_number": "dist_disabled",
        "password": "1234",
        "monthly_credit_quota": 10,
        "monthly_credit_used": 0,
        "email": "planner_test_4@test.com"
    }
]

for p in planners:
    r = requests.post(f"{url}/rest/v1/planners", headers=headers, json=p)
    if r.status_code in [200, 201]:
        print(f"[OK] Planner {p['name']} created successfully.")
    else:
        print(f"[ERROR] Failed to create Planner {p['name']}: {r.status_code} - {r.text}")

# 2. Insert Leads
leads = [
    {
        "agency_id": agency_id,
        "planner_id": None,
        "name": "김철수",
        "phone": "010-1234-5678",
        "age": 35,
        "insurance_type": "remodeling",
        "status": "new",
        "lead_source": "organic",
        "monthly_premium": 80000,
        "raw_payload": {
            "gender": "M",
            "category": "remodeling",
            "analysisInputs": {
                "age": 35,
                "name": "김철수",
                "gender": "M",
                "mobile": "010-1234-5678"
            }
        }
    },
    {
        "agency_id": agency_id,
        "planner_id": None,
        "name": "박영희",
        "phone": "010-9876-5432",
        "age": 28,
        "insurance_type": "car",
        "status": "new",
        "lead_source": "organic",
        "monthly_premium": 45000,
        "raw_payload": {
            "gender": "F",
            "category": "car",
            "analysisInputs": {
                "age": 28,
                "name": "박영희",
                "gender": "F",
                "mobile": "010-9876-5432"
            }
        }
    },
    {
        "agency_id": agency_id,
        "planner_id": None,
        "name": "이영민",
        "phone": "010-4444-5555",
        "age": 42,
        "insurance_type": "remodeling_underwriting",
        "status": "new",
        "lead_source": "organic",
        "monthly_premium": 120000,
        "raw_payload": {
            "gender": "M",
            "category": "remodeling_underwriting",
            "analysisInputs": {
                "age": 42,
                "name": "이영민",
                "gender": "M",
                "mobile": "010-4444-5555"
            }
        }
    }
]

for l in leads:
    r = requests.post(f"{url}/rest/v1/customer_leads", headers=headers, json=l)
    if r.status_code in [200, 201]:
        print(f"[OK] Lead {l['name']} created successfully.")
    else:
        print(f"[ERROR] Failed to create Lead {l['name']}: {r.status_code} - {r.text}")

print("=== SEEDING COMPLETED ===")
