import os
import requests
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

def check_specific_product():
    p_name = "New간편암건강보험2501"
    print(f"[*] '{p_name}' 상품 정보 확인 중...")
    url = f"{SUPABASE_URL}/rest/v1/insurance_cancer_products?product_name=eq.{p_name}"
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code == 200:
        data = response.json()
        if data:
            item = data[0]
            print(f"상품명: {item['product_name']} | 카테고리: '{item['category']}'")
        else:
            print("결과 없음")
    else:
        print(f"에러: {response.status_code}")

if __name__ == "__main__":
    check_specific_product()
