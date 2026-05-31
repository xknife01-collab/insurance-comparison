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

# 1. 운전자 보험 요율 정보 가져오기 (남성 M 기준)
rates_url = f"{supabase_url}/rest/v1/driver_insurance_rates?gender=eq.M"
r_rates = requests.get(rates_url, headers=headers)
rates = r_rates.json()

# 2. 운전자 보험 상품 정보 가져오기
products_url = f"{supabase_url}/rest/v1/driver_insurance_products"
r_prods = requests.get(products_url, headers=headers)
prods = r_prods.json()

prod_map = {p["product_name"]: p["company_name"] for p in prods}

bike_keywords = ["이륜", "오토바이", "바이크"]

# 분류 작업
bike_list = []
private_list = []

for r in rates:
    prod_name = r["product_name"]
    comp = prod_map.get(prod_name, "국내보험사")
    is_bike = any(kw in prod_name for kw in bike_keywords)
    
    item = {
        "company": comp,
        "product": prod_name,
        "plan": r["plan_level"],
        "premium": r["premium"]
    }
    
    if is_bike:
        bike_list.append(item)
    else:
        private_list.append(item)

# 가격 순 정렬
bike_list.sort(key=lambda x: x["premium"])
private_list.sort(key=lambda x: x["premium"])

output = {
    "private_car_top10": private_list[:10],
    "motorcycle_all": bike_list
}

output_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\bike_vs_private.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Successfully wrote bike vs private car list to JSON!")
