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

def audit_150k_plus():
    print("[*] 보험료 15만원 이상 상품 전수 조사 중...")
    
    # 15만원 이상 데이터 조회
    query_url = f"{SUPABASE_URL}/rest/v1/insurance_cancer_rates?premium=gte.150000&select=product_name,premium,gender,benefit_amount"
    response = requests.get(query_url, headers=HEADERS)
    
    if response.status_code == 200:
        data = response.json()
        if not data:
            print("[+] 현재 15만원 이상으로 적재된 상품 중 이상 징후가 있는 상품이 없습니다.")
            return
            
        print(f"[*] 총 {len(data)}건의 고가 상품 발견 (15만원 이상):")
        df = pd.DataFrame(data)
        # 보기 좋게 정렬
        df = df.sort_values(by='premium', ascending=False)
        print(df.to_string(index=False))
        
        # 분석 의견
        print("\n[!] 분석 의견:")
        for _, row in df.iterrows():
            if row['premium'] > 200000:
                print(f"- '{row['product_name']}' ({row['premium']:,}원): 연납 데이터가 월납으로 잘못 들어갔을 확률이 매우 높습니다.")
            else:
                print(f"- '{row['product_name']}' ({row['premium']:,}원): 고가 상품군에 속하나 실존 가능성이 있으니 원본 대조가 필요합니다.")
    else:
        print(f"[!] 에러 발생: {response.status_code}, {response.text}")

if __name__ == "__main__":
    audit_150k_plus()
