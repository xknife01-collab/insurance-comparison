# -*- coding: utf-8 -*-
"""
Supabase JS SDK를 활용한 데이터 적재 (Node.js 대용 파이썬 버전)
직접 SQL 접속 대신 HTTPS API를 사용하여 IPv6 장벽을 우회합니다.
"""
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv(".env.local")

def push_data_to_supabase_api():
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        print("[-] Missing URL or Service Role Key in .env.local")
        return

    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    print(f"[*] Connecting to Supabase API: {url}")
    
    # 1. 삼성화재 상품 등록 (insurance_products)
    product = {
        "product_code": "SAMSUNG_FIRE_HEALTH_01",
        "company_name": "삼성화재",
        "display_name": "삼성화재 간편건강보험",
        "standard_code": "STD_SAMSUNG_01",
        "category": "건강"
    }
    
    try:
        resp = requests.post(f"{url}/rest/v1/insurance_products", json=product, headers=headers)
        if resp.status_code not in [200, 201, 204, 409]:
            print(f"[-] Product Insert Error: {resp.text}")
        else:
            print("[+] Product ensured.")

        # 2. 요율 데이터 (insurance_rates)
        json_path = "samsung_fire_rate.json"
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # 그룹화
            grouped = {}
            for entry in data:
                gender = 'M' if entry['gender'].lower().startswith('m') else 'F'
                key_tuple = (gender, entry['age'], entry['job_class'])
                if key_tuple not in grouped: grouped[key_tuple] = {}
                grouped[key_tuple][entry['coverage_name']] = entry['rate']

            records = []
            for (gender, age, job), rates in grouped.items():
                records.append({
                    "product_code": "SAMSUNG_FIRE_HEALTH_01",
                    "gender": gender,
                    "age": age,
                    "job_class": job,
                    "rate_data": rates
                })

            print(f"[*] Uploading {len(records)} records via Rest API...")
            # 벌크 업로드 (UPSERT)
            headers["Prefer"] = "on-conflict=product_code,gender,age,job_class"
            resp = requests.post(f"{url}/rest/v1/insurance_rates", json=records, headers=headers)
            
            if resp.status_code in [200, 201, 204]:
                print("[✔] SUCCESS: Data synced to Supabase Cloud via API!")
            else:
                print(f"[-] Rate Update Error: {resp.text}")

    except Exception as e:
        print(f"[-] API Loading Error: {e}")

if __name__ == "__main__":
    push_data_to_supabase_api()
