import requests
import json

url = "https://wfkxwztxpugakusynhpx.supabase.co"
# Using the VITE_SUPABASE_ANON_KEY to simulate an anonymous customer submitting the form!
anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma3h3enR4cHVnYWt1c3luaHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDU2OTYsImV4cCI6MjA4OTk4MTY5Nn0.B_udlQS12H5hXock5AZK_t6ikqoTvpAb2-ovOH995mg"

headers = {
    "apikey": anon_key,
    "Authorization": f"Bearer {anon_key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# Payload mapped exactly to what submitLead inside App.tsx sends:
payload = {
    "planner_id": "99999999-9999-4999-b999-999999999999", # 홍길동 planner ID
    "agency_id": "88888888-8888-4888-a888-888888888888",  # 스마트보험파트너스 agency ID
    "name": "홍길동테스트",
    "phone": "010-9999-8888",
    "age": 30,
    "insurance_type": "cancer",
    "analysis_result": {
        "scores": {"total": 85},
        "deficiencies": []
    },
    "monthly_premium": 45000,
    "raw_payload": {
        "gender": "M",
        "jobClass": 1,
        "category": "cancer"
    },
    "lead_source": "direct",
    "status": "new"
}

r = requests.post(f"{url}/rest/v1/customer_leads", headers=headers, json=payload)
print("Lead Submission Status Code:", r.status_code)
print("Response text:", r.text)
