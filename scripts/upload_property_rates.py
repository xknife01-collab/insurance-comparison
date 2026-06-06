import pandas as pd
import re
import os
import sys
from supabase import create_client
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')

def clean_premium(val):
    if pd.isna(val) or val == '':
        return 0
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    match = re.search(r'(\d+)', s)
    return int(match.group(1)) if match else 0

def upload_property_data():
    # Load environment variables
    load_dotenv('.env')
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Service Role Key missing in env files")
        return
        
    supabase = create_client(url, key)
    
    csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\property\extracted_data.csv"
    if not os.path.exists(csv_path):
        print(f"[-] File not found: {csv_path}")
        return
        
    df = pd.read_csv(csv_path, encoding='utf-8')
    print(f"[*] Loaded CSV: {len(df)} rows")
    
    records = []
    for idx, row in df.iterrows():
        pm = clean_premium(row.get('기준보험료', ''))
        pf = clean_premium(row.get('가입보험료', ''))
        
        # Apply standard mappings
        records.append({
            "company_name": str(row['보험회사']),
            "product_name": str(row['상품명']),
            "division": str(row['구분']) if pd.notna(row['구분']) else "",
            "benefit_name": str(row['담보명(급부명)']) if pd.notna(row['담보명(급부명)']) else "",
            "benefit_reason": str(row['지급사유']) if pd.notna(row['지급사유']) else "",
            "benefit_amount": str(row['지급금액']) if pd.notna(row['지급금액']) else "",
            "insured_amount": str(row['가입금액']) if pd.notna(row['가입금액']) else "",
            "premium_male": pm,
            "premium_female": pf,
            "applied_rate": str(row['적용이율']) if pd.notna(row['적용이율']) else "",
            "renewal_type": str(row['갱신구분']) if pd.notna(row['갱신구분']) else "",
            "sales_channel": str(row['판매채널']) if pd.notna(row['판매채널']) else "",
            "base_date": str(row['기준일자']) if pd.notna(row['기준일자']) else "",
            "description": str(row['상세안내']) if pd.notna(row['상세안내']) else "",
            "contact": str(row['연락처']) if pd.notna(row['연락처']) else "",
            "source_file": str(row['source_file']) if pd.notna(row['source_file']) else ""
        })
        
    print(f"[*] Clearing existing records from insurance_property_rates...")
    try:
        supabase.table('insurance_property_rates').delete().neq('company_name', 'DELETE_NONE').execute()
        print("[+] Table cleared successfully.")
    except Exception as e:
        print(f"[-] Error clearing table: {e}")
        return
        
    if records:
        print(f"[*] Uploading {len(records)} property insurance records in batches of 100...")
        batch_size = 100
        for i in range(0, len(records), batch_size):
            batch = records[i:i+batch_size]
            try:
                supabase.table('insurance_property_rates').insert(batch).execute()
                print(f"  [+] Uploaded batch {i // batch_size + 1} ({len(batch)} records)")
            except Exception as e:
                print(f"  [-] Failed to upload batch {i // batch_size + 1}: {e}")
                return
        print("[+] SUCCESS! All property insurance rates uploaded to Supabase.")

if __name__ == "__main__":
    upload_property_data()
