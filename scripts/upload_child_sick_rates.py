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

def extract_screening_code(desc):
    """
    Extract the '3.N.5' from strings like: 
    '어린이 간편고지 심사 (5년간 입원/수술 무사고 (안정형))' => we look for N=5, so '3.5.5'
    Or we can just parse it from the '상품명' (e.g., '간편한 3.5.5 건강보험(어린이형)')
    """
    if not isinstance(desc, str): return '3.5.5'
    match = re.search(r'3\.(\d+)\.5', desc)
    if match:
        return f"3.{match.group(1)}.5"
    return '3.5.5' # default fallback

def upload_child_sick_data():
    load_dotenv('.env')
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("Error: Missing SUPABASE credentials.")
        return
        
    supabase = create_client(url, key)
    
    csv_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\3_family\pre_existing\extracted_data.csv"
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        return
        
    df = pd.read_csv(csv_path, encoding='utf-8-sig')
    
    print(f"Loaded {len(df)} rows from CSV.")
    
    try:
        supabase.table("insurance_child_sick_rates").delete().neq('id', -1).execute()
        print("Cleared existing table data.")
    except Exception as e:
        print(f"Clear skipped or failed (might be empty): {e}")
        
    records = []
    for _, row in df.iterrows():
        pm = clean_premium(row.get('남성보험료', row.get('기준보험료', '')))
        pf = clean_premium(row.get('여성보험료', row.get('가입보험료', '')))
        
        # 적용이율이 없으면 기본 2.75% 할당
        rate_str = str(row.get('적용이율', '')) if pd.notna(row.get('적용이율')) else ""
        if not rate_str or rate_str == 'nan':
            rate_str = "2.75%"
            
        product_name = str(row['상품명'])
        screening_code = extract_screening_code(product_name)
        
        records.append({
            "company_name": str(row['보험회사']),
            "product_name": product_name,
            "screening_code": screening_code,
            "division": str(row['구분']) if pd.notna(row['구분']) else "",
            "benefit_name": str(row['담보명(급부명)']) if pd.notna(row['담보명(급부명)']) else "",
            "benefit_reason": str(row['지급사유']) if pd.notna(row['지급사유']) else "",
            "benefit_amount": str(row['지급금액']) if pd.notna(row['지급금액']) else "",
            "insured_amount": str(row['가입금액']) if pd.notna(row['가입금액']) else "",
            "premium_male": pm,
            "premium_female": pf,
            "applied_rate": rate_str,
            "payment_type": str(row['갱신구분']) if pd.notna(row['갱신구분']) else "갱신형",
            "source_file": str(row['source_file']) if pd.notna(row['source_file']) else ""
        })
        
    if records:
        chunk_size = 50
        for i in range(0, len(records), chunk_size):
            chunk = records[i:i + chunk_size]
            res = supabase.table("insurance_child_sick_rates").insert(chunk).execute()
            print(f"Uploaded chunk {i//chunk_size + 1}, {len(chunk)} records. (Inserted: {len(res.data)})")
    else:
        print("No valid records to upload.")
        
if __name__ == "__main__":
    upload_child_sick_data()
