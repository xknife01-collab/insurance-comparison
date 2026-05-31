import pandas as pd
import re
import os
from supabase import create_client
from dotenv import load_dotenv

def clean_premium(val):
    if pd.isna(val) or val == '':
        return 0
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    match = re.search(r'(\d+)', s)
    return int(match.group(1)) if match else 0

def parse_payment_period(row):
    text = " ".join([str(v) for v in row.values if pd.notna(v)])
    criteria_match = re.search(r'(?:예시|기준|공시).*?(일시납)', text)
    if criteria_match:
        return "일시납"
    criteria_match_years = re.search(r'(?:예시|기준|공시).*?(\d+)\s*년\s*납', text)
    if criteria_match_years:
        return f"{criteria_match_years.group(1)}년납"
    if '일시납' in text:
        return "일시납"
    match = re.search(r'(\d+)\s*년\s*납', text)
    if match:
        return f"{match.group(1)}년납"
    for years in [20, 10, 30, 15, 5, 7]:
        if f"{years}년" in text:
            return f"{years}년납"
    return "20년납"

def upload_home_facility_data():
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Service Role Key missing in .env.local")
        return
        
    supabase = create_client(url, key)
    
    csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv"
    if not os.path.exists(csv_path):
        print(f"[-] File not found: {csv_path}")
        return
        
    df = pd.read_csv(csv_path)
    print(f"[*] Loaded CSV: {len(df)} rows")
    
    records = []
    for idx, row in df.iterrows():
        # Clean premiums
        pm = clean_premium(row.get('기준보험료', ''))
        pf = clean_premium(row.get('가입보험료', ''))
        
        # 적용이율 검출 (Index 9 또는 원본 열 탐색)
        rate_val = row.get('적용이율', '')
        if pd.isna(rate_val) or str(rate_val).strip() == '':
            # Try searching in raw columns
            for col in df.columns:
                if '원본_열' in col:
                    val = str(row[col])
                    if '%' in val and re.search(r'\d+\.?\d*\s*%', val):
                        rate_val = val.strip()
                        break
        
        rate_str = str(rate_val) if pd.notna(rate_val) else ""
        pay_period = parse_payment_period(row)
        
        records.append({
            "company_name": str(row['보험회사']),
            "product_name": str(row['상품명']),
            "division": str(row['구분']) if pd.notna(row['구분']) else "",
            "benefit_name": str(row['담보명(급부명)']),
            "benefit_reason": str(row['지급사유']) if pd.notna(row['지급사유']) else "",
            "benefit_amount": str(row['지급금액']) if pd.notna(row['지급금액']) else "",
            "insured_amount": str(row['가입금액']) if pd.notna(row['가입금액']) else "",
            "premium_male": pm,
            "premium_female": pf,
            "applied_rate": rate_str,
            "payment_type": f"월납({pay_period})",
            "source_file": str(row['source_file']) if pd.notna(row['source_file']) else ""
        })
        
    print(f"[*] Clearing insurance_home_facility_rates table...")
    try:
        supabase.table('insurance_home_facility_rates').delete().neq('id', -1).execute()
        print("[+] Table cleared.")
    except Exception as e:
        print(f"[-] Error clearing table: {e}")
        return
        
    if records:
        print(f"[*] Uploading {len(records)} home/facility care records...")
        try:
            supabase.table('insurance_home_facility_rates').insert(records).execute()
            print("[+] SUCCESS! Supabase insurance_home_facility_rates table is now updated.")
        except Exception as e:
            print(f"[-] Upload failed: {e}")

if __name__ == "__main__":
    upload_home_facility_data()
