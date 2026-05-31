import os
import json
from dotenv import load_dotenv
import requests

# 환경변수 로드
env_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local"
load_dotenv(env_path)

supabase_url = os.getenv("VITE_SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json"
}

# 모든 남성 요율 조회
rates_url = f"{supabase_url}/rest/v1/driver_insurance_rates?gender=eq.M"
r_rates = requests.get(rates_url, headers=headers)
rates = r_rates.json()

# plan_level 별로 그룹화해서 최저 요율 가격 출력
by_plan = {}
for r in rates:
    pl = r["plan_level"]
    if pl not in by_plan:
        by_plan[pl] = []
    by_plan[pl].append(r)

print("=== DB PLAN LEVEL PREMIUM ANALYSIS ===")
for pl, items in by_plan.items():
    items.sort(key=lambda x: x["premium"])
    print(f"\nPlan Level: {pl} (Total items: {len(items)})")
    for idx, item in enumerate(items[:5], 1):
        print(f"  {idx:02d} | Premium: {item['premium']:,}원 | Product: {item['product_name']}")
