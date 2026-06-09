# -*- coding: utf-8 -*-
import os, requests, json
from dotenv import load_dotenv

base_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main'
load_dotenv(os.path.join(base_path, '.env.local'))
load_dotenv(os.path.join(base_path, '.env'))

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def check_db():
    url = f"{SUPABASE_URL}/rest/v1/insurance_yu_byung_ja?select=company_name,product_name,rates"
    res = requests.get(url, headers=HEADERS)
    if res.status_code == 200:
        data = res.json()
        print(f"Total Yu-Byung-Ja records: {len(data)}")
        # M_40 요율 기준 오름차순으로 상위 5개 출력
        valid_items = []
        for item in data:
            rates = item.get('rates', {})
            m40 = rates.get('premium_M_40', 0)
            if m40 > 0:
                valid_items.append((item['company_name'], item['product_name'], m40))
        
        valid_items.sort(key=lambda x: x[2])
        print("\nTop 10 Lowest Premiums (M_40) in DB:")
        for idx, (comp, prod, prem) in enumerate(valid_items[:10], 1):
            print(f"{idx:02d}. [{comp}] {prod} - {prem:,}원")
    else:
        print(f"Error: {res.status_code}, {res.text}")

if __name__ == "__main__":
    check_db()
