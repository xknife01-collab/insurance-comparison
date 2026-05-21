import os, requests
from dotenv import load_dotenv

load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
headers = {"apikey": KEY, "Authorization": f"Bearer {KEY}"}

# 테이블 완전 비우기
res = requests.delete(f"{URL}/rest/v1/insurance_yu_byung_ja?id=neq.-1", headers=headers, timeout=30)
print(f"DELETE status: {res.status_code}")

# 잔여 행 확인
check = requests.get(f"{URL}/rest/v1/insurance_yu_byung_ja?select=id", headers={**headers, "Prefer": "count=exact"})
print(f"Remaining rows: {check.headers.get('Content-Range', 'unknown')}")
