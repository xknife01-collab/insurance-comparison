import os
import requests
from dotenv import load_dotenv

load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def audit_final_load():
    headers = {"apikey": KEY, "Authorization": f"Bearer {KEY}"}
    TABLE = "insurance_yu_byung_ja"
    
    # 상위 5개 샘플만 딱 실측
    res = requests.get(f"{URL}/rest/v1/{TABLE}?select=company_name,product_name,rates&limit=10", headers=headers)
    data = res.json()
    
    print("\n" + "="*60)
    print("--- [ULTIMATE DB DATA AUDIT REPORT] ---")
    if not data:
        print("[FAIL] DB is EMPTY or Query Failed.")
        return
        
    for i, d in enumerate(data):
        comp = d.get('company_name', 'UNKNOWN')
        prod = d.get('product_name', 'UNKNOWN')
        rates = d.get('rates', {})
        p40 = rates.get('premium_M_40', 'N/A')
        
        # 한글 보정을 위해 repr 제거 후 직접 출력
        print(f"  {i+1}. [{comp}] {prod[:35]:<35} | 40M: {p40}원")
    
    print("-" * 60)
    # 총 카운트 한 번 더 확인
    count_res = requests.get(f"{URL}/rest/v1/{TABLE}?select=id", headers={**headers, "Prefer": "count=exact", "Range-Unit": "items", "Range": "0-0"})
    total = count_res.headers.get('Content-Range', '0').split('/')[-1]
    print(f"[*] TOTAL VERIFIED ROWS IN DB: {total}")
    print("="*60 + "\n")

if __name__ == "__main__":
    audit_final_load()
