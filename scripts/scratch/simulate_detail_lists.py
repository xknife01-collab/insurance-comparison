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

# 1. 운전자 보험 요율 정보 가져오기
rates_url = f"{supabase_url}/rest/v1/driver_insurance_rates?gender=eq.M"
r_rates = requests.get(rates_url, headers=headers)
rates = r_rates.json()

# 2. 운전자 보험 상품 정보 가져오기
products_url = f"{supabase_url}/rest/v1/driver_insurance_products"
r_prods = requests.get(products_url, headers=headers)
prods = r_prods.json()

prod_map = {p["product_name"]: p["company_name"] for p in prods}

results = []
for r in rates:
    comp = prod_map.get(r["product_name"], "국내보험사")
    results.append({
        "company": comp,
        "product": r["product_name"],
        "plan": r["plan_level"],
        "premium": r["premium"]
    })

# 1) 교통사고처리 집중형 (합의금 1.5억~2억을 보장하는 표준형/VIP안심형 필터링)
accident_filtered = [item for item in results if item["plan"] in ["표준형", "VIP안심형"]]
accident_filtered.sort(key=lambda x: x["premium"])

# 2) 변호사 비용 집중형 (경찰조사 선지원 및 한도 5천만을 완벽 지원하는 VIP안심형 필터링)
lawyer_filtered = [item for item in results if item["plan"] == "VIP안심형"]
lawyer_filtered.sort(key=lambda x: x["premium"])

output_data = {
    "accident_top10": accident_filtered[:10],
    "lawyer_top10": lawyer_filtered[:10]
}

# 결과를 UTF-8 텍스트 파일로 저장하여 인코딩 깨짐을 예방
output_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\simulated_rankings.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print("Successfully wrote simulated rankings to JSON!")
