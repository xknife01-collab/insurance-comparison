# -*- coding: utf-8 -*-
import os
import requests
from dotenv import load_dotenv

load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
TABLE = "insurance_yu_byung_ja"

headers = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json"
}

# Supabase에서 유병자 테이블 데이터를 요율 최저가 기준으로 조회
res = requests.get(f"{URL}/rest/v1/{TABLE}?select=company_name,product_name,rates", headers=headers)
if res.status_code == 200:
    data = res.json()
    print(f"[*] Total loaded products in DB: {len(data)}")
    
    # 40세 남성 요율 기준으로 정렬
    sorted_data = sorted(data, key=lambda x: x.get('rates', {}).get('premium_M_40', 999999))
    
    print("\n--- Cheaper Top 20 ---")
    for idx, item in enumerate(sorted_data[:20]):
        rates = item.get('rates', {})
        print(f"{idx+1:02d}. [{item['company_name']}] {item['product_name'][:40]} | 40남: {rates.get('premium_M_40', 0):,}원 | 30남: {rates.get('premium_M_30', 0):,}원 | 50남: {rates.get('premium_M_50', 0):,}원")
        
    print("\n--- Most Expensive Top 5 ---")
    for idx, item in enumerate(sorted_data[-5:]):
        rates = item.get('rates', {})
        print(f"[{item['company_name']}] {item['product_name'][:40]} | 40남: {rates.get('premium_M_40', 0):,}원")
else:
    print(f"[!] Error fetching DB: {res.text}")
