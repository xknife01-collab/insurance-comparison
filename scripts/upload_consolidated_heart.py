import pandas as pd
import requests
import os
import re
from dotenv import load_dotenv

load_dotenv(".env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

CONSOLIDATED_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_final_consolidated.xlsx"
TABLE_NAME = "heart_insurance_plans"

def clean_money_int(v):
    if pd.isna(v) or v == "": return 0
    if isinstance(v, (int, float)): return int(v)
    v_str = str(v).replace(',', '').replace('원', '').strip()
    nums = re.findall(r'\d+', v_str)
    return int(nums[0]) if nums else 0

def upload_consolidated():
    if not os.path.exists(CONSOLIDATED_FILE):
        print("Consolidated file not found.")
        return

    # 1. 통합 데이터 읽기
    print(f"[*] Reading consolidated data...")
    df = pd.read_excel(CONSOLIDATED_FILE)
    
    # 2. 기존 데이터 삭제 (Clear Table)
    print(f"[*] Clearing existing data in {TABLE_NAME}...")
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json"
    }
    requests.delete(f"{URL}/rest/v1/{TABLE_NAME}?id=neq.-1", headers=headers)
    print("  [+] Table cleared.")

    # 3. 데이터 매핑
    upload_list = []
    for idx, row in df.iterrows():
        item = {
            "company": str(row.get('보험회사', '')),
            "product_name": str(row.get('상품명', '')),
            "male_premium": clean_money_int(row.get('남성총보험료', 0)),
            "female_premium": clean_money_int(row.get('여성총보험료', 0)),
            "coverage_name": str(row.get('주요담보리스트', '')),
            "details": str(row.get('상세안내', '')),
            "channel": str(row.get('판매채널', '')),
            "contact": str(row.get('연락처', '')),
            "base_date": str(row.get('기준일자', '')) if pd.notna(row.get('기준일자')) else None
        }
        upload_list.append(item)

    # 4. 업로드
    resp = requests.post(f"{URL}/rest/v1/{TABLE_NAME}", headers=headers, json=upload_list)
    if resp.status_code in [200, 201, 204]:
        print(f"\n[*] SUCCESS! {len(upload_list)} consolidated heart insurance plans uploaded to Supabase.")
    else:
        print(f"  [!] Upload error: {resp.text}")

if __name__ == "__main__":
    upload_consolidated()
