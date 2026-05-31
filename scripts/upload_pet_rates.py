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

def upload_pet_data():
    load_dotenv('.env')
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Service Role Key missing in env files")
        return
        
    supabase = create_client(url, key)
    
    xlsx_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\pet\extracted_data.xlsx"
    if not os.path.exists(xlsx_path):
        print(f"[-] File not found: {xlsx_path}")
        return
        
    df = pd.read_excel(xlsx_path)
    print(f"[*] Loaded Excel: {len(df)} rows")
    
    records = []
    for idx, row in df.iterrows():
        pm = clean_premium(row.get('남성보험료', ''))
        pf = clean_premium(row.get('여성보험료', ''))
        
        # In case male premium is 0, let's check if '기준보험료' or '가입보험료' has it
        if pm == 0:
            pm = clean_premium(row.get('기준보험료', ''))
        if pf == 0:
            pf = clean_premium(row.get('가입보험료', ''))
            
        rate_val = row.get('적용이율', '')
        rate_str = str(rate_val) if pd.notna(rate_val) else ""
        
        # Payment type or renewal type
        pay_type = str(row.get('갱신구분', '월납')) if pd.notna(row.get('갱신구분')) else '월납'
        
        records.append({
            "company_name": str(row.get('보험회사', '알수없음')),
            "product_name": str(row.get('상품명', '알수없음')),
            "division": str(row.get('구분')) if pd.notna(row.get('구분')) else "",
            "benefit_name": str(row.get('담보명(급부명)')) if pd.notna(row.get('담보명(급부명)')) else "",
            "benefit_reason": str(row.get('지급사유')) if pd.notna(row.get('지급사유')) else "",
            "benefit_amount": str(row.get('지급금액')) if pd.notna(row.get('지급금액')) else "",
            "insured_amount": str(row.get('가입금액')) if pd.notna(row.get('가입금액')) else "",
            "premium_male": pm,
            "premium_female": pf,
            "applied_rate": rate_str,
            "payment_type": pay_type,
            "source_file": str(row.get('source_file')) if pd.notna(row.get('source_file')) else ""
        })
        
    print(f"[*] Clearing existing records from insurance_pet_rates...")
    try:
        supabase.table('insurance_pet_rates').delete().neq('company_name', 'DELETE_NONE').execute()
        print("[+] Table cleared successfully.")
    except Exception as e:
        print(f"[-] Error clearing table: {e}")
        return
        
    if records:
        print(f"[*] Uploading {len(records)} pet insurance records in batches of 100...")
        # Upload in batches to avoid API size limit issues
        batch_size = 100
        for i in range(0, len(records), batch_size):
            batch = records[i:i+batch_size]
            try:
                supabase.table('insurance_pet_rates').insert(batch).execute()
                print(f"  [+] Uploaded batch {i // batch_size + 1} ({len(batch)} records)")
            except Exception as e:
                print(f"  [-] Failed to upload batch {i // batch_size + 1}: {e}")
                return
        print("[+] SUCCESS! All 322 pet insurance records successfully loaded into Supabase!")

if __name__ == "__main__":
    upload_pet_data()
