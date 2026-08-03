import os
import requests
import pandas as pd
from dotenv import load_dotenv

# 설정
base_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main'
load_dotenv(os.path.join(base_path, '.env'))
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    load_dotenv(os.path.join(base_path, '.env.local'))
    SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

def show_top_premiums():
    print("[*] 현재 적재된 상품 중 보험료 상위 10개 추출 중...")
    
    # 보험료 높은 순으로 10개 가져오기
    query_url = f"{SUPABASE_URL}/rest/v1/insurance_cancer_rates?order=premium.desc&limit=10&select=product_name,premium,gender,benefit_amount"
    response = requests.get(query_url, headers=HEADERS)
    
    if response.status_code == 200:
        data = response.json()
        print(f"[*] 상위 10개 리스트:")
        df = pd.DataFrame(data)
        print(df.to_string(index=False))
    else:
        print(f"[!] 에러 발생: {response.status_code}")

if __name__ == "__main__":
    show_top_premiums()
