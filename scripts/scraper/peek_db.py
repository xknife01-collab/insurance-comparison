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

def peek_db_categories():
    print("[*] DB에 적재된 카테고리 명칭 샘플 확인 중...")
    url = f"{SUPABASE_URL}/rest/v1/insurance_cancer_products?select=product_name,category&limit=10"
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code == 200:
        data = response.json()
        for item in data:
            print(f"상품명: {item['product_name']} | 카테고리: '{item['category']}'")
    else:
        print(f"에러: {response.status_code}")

if __name__ == "__main__":
    peek_db_categories()
