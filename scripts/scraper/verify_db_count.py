import requests
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def check_count():
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Range": "0-0"  # 개수만 가져오기 위한 트릭
    }
    
    p_resp = requests.get(f"{URL}/rest/v1/insurance_products?select=count", headers=headers)
    r_resp = requests.get(f"{URL}/rest/v1/insurance_rates?select=count", headers=headers)
    
    print(f"[*] 현재 DB 상태:")
    print(f"  - 마스터 상품: {p_resp.json()}")
    print(f"  - 상세 요율 데이터: {r_resp.json()}")

if __name__ == "__main__":
    check_count()
