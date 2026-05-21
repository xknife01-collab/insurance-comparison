"""
유병자 테이블에서 '기타보험사'만 삭제하는 전용 스크립트
"""
import os
import requests
from dotenv import load_dotenv

# 환경 변수 로드 (공백 오류 방지)
load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
TABLE = "insurance_yu_byung_ja"

def delete_others():
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json"
    }
    
    # company_name=eq.기타보험사 필터 적용
    delete_url = f"{URL}/rest/v1/{TABLE}?company_name=eq.기타보험사"
    
    print(f"[*] DELETING '기타보험사' FROM {TABLE}...")
    res = requests.delete(delete_url, headers=headers)
    
    if res.status_code in [200, 204]:
        print(f"[*] FINAL SUCCESS: '기타보험사' has been completely removed.")
    else:
        print(f"[*] FAILED: Status {res.status_code}, {res.text}")

if __name__ == "__main__":
    delete_others()
