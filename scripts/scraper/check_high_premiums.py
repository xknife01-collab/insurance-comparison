import os
import requests
import pandas as pd
from dotenv import load_dotenv

# 설정
env_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env'
load_dotenv(env_path)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    load_dotenv(r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local')
    SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

def check_high_premium_products():
    print("[*] 보험료 20만원 이상 상품 조회 중...")
    
    # 20만원 이상 데이터 필터링하여 가져오기
    query_url = f"{SUPABASE_URL}/rest/v1/insurance_cancer_rates?premium=gte.200000&select=product_name,premium,gender,benefit_amount"
    response = requests.get(query_url, headers=HEADERS)
    
    if response.status_code == 200:
        data = response.json()
        if not data:
            print("[!] 현재 20만원 이상으로 적재된 상품이 없습니다.")
            return
            
        print(f"[*] 총 {len(data)}건의 고가 상품 발견:")
        df = pd.DataFrame(data)
        print(df.to_string())
    else:
        print(f"[!] 에러 발생: {response.status_code}, {response.text}")

if __name__ == "__main__":
    check_high_premium_products()
