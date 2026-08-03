import pandas as pd
import requests
import os
import json
import re
from dotenv import load_dotenv

load_dotenv(".env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

TARGET_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_extracted_data.xlsx"
TABLE_NAME = "heart_insurance_plans"

def clean_money_int(v):
    if pd.isna(v) or v == "": return 0
    v = str(v).replace(',', '').replace('원', '').strip()
    nums = re.findall(r'\d+', v)
    return int(nums[0]) if nums else 0

def clean_date(v):
    if pd.isna(v) or str(v).lower() == 'nan' or str(v).strip() == '':
        return None
    # 날짜 형식이 yyyy-mm-dd 인지 확인 (간단한 체크)
    v_str = str(v).split(' ')[0] # 시간 정보 제거
    if re.match(r'\d{4}-\d{2}-\d{2}', v_str):
        return v_str
    return None

def upload_to_supabase_fixed():
    if not os.path.exists(TARGET_FILE):
        print("Excel file not found.")
        return

    # 1. 엑셀 데이터 읽기
    df = pd.read_excel(TARGET_FILE)
    
    # 2. 기존 데이터 삭제
    print(f"[*] Clearing existing data in {TABLE_NAME}...")
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json"
    }
    requests.delete(f"{URL}/rest/v1/{TABLE_NAME}?id=neq.-1", headers=headers)

    # 3. 데이터 매핑
    upload_list = []
    for idx, row in df.iterrows():
        item = {
            "company": str(row.get('보험회사', '')) if pd.notna(row.get('보험회사')) else "",
            "product_name": str(row.get('상품명', '')) if pd.notna(row.get('상품명')) else "",
            "category": str(row.get('구분', '')) if pd.notna(row.get('구분')) else "",
            "coverage_name": str(row.get('담보명(급부명)', '')) if pd.notna(row.get('담보명(급부명)')) else "",
            "payout_reason": str(row.get('지급사유', '')) if pd.notna(row.get('지급사유')) else "",
            "payout_amount": str(row.get('지급금액', '')) if pd.notna(row.get('지급금액')) else "",
            "subscription_amount": str(row.get('가입금액', '')) if pd.notna(row.get('가입금액')) else "",
            "male_premium": clean_money_int(row.get('남성보험료', 0)),
            "female_premium": clean_money_int(row.get('여성보험료', 0)),
            "interest_rate": str(row.get('적용이율', '')) if pd.notna(row.get('적용이율')) else "",
            "renewal_type": str(row.get('갱신구분', '')) if pd.notna(row.get('갱신구분')) else "",
            "channel": str(row.get('판매채널', '')) if pd.notna(row.get('판매채널')) else "",
            "base_date": clean_date(row.get('기준일자')),
            "details": str(row.get('상세안내', '')) if pd.notna(row.get('상세안내')) else "",
            "contact": str(row.get('연락처', '')) if pd.notna(row.get('연락처')) else "",
            "source_file": str(row.get('source_file', '')) if pd.notna(row.get('source_file')) else ""
        }
        for i in range(30):
            item[f"raw_col_{i}"] = str(row.get(f"원본_열_{i}", "")) if pd.notna(row.get(f"원본_열_{i}")) else ""
            
        upload_list.append(item)

    # 4. 업로드
    success_count = 0
    batch_size = 50
    for i in range(0, len(upload_list), batch_size):
        batch = upload_list[i : i + batch_size]
        resp = requests.post(f"{URL}/rest/v1/{TABLE_NAME}", headers=headers, json=batch)
        if resp.status_code in [200, 201, 204]:
            success_count += len(batch)
            if success_count % 200 == 0:
                print(f"  [+] Uploaded {success_count}/{len(upload_list)} rows...")
        else:
            print(f"  [!] Error at batch {i}: {resp.text}")

    print(f"\n[*] SUCCESS! Total {success_count}/{len(upload_list)} rows uploaded to Supabase.")

if __name__ == "__main__":
    upload_to_supabase_fixed()
