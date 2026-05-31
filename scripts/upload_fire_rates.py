import pandas as pd
import re
import os
import sys
from supabase import create_client
from dotenv import load_dotenv

# Reconfigure stdout to use utf-8 to print Korean characters properly
sys.stdout.reconfigure(encoding='utf-8')

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

def upload_fire_data():
    load_dotenv('.env')
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Service Role Key missing in env files")
        return
        
    supabase = create_client(url, key)
    
    # 1. Create table via exec_sql RPC
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS public.insurance_fire_rates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_name VARCHAR(100) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        division VARCHAR(100),
        benefit_name VARCHAR(255),
        benefit_reason TEXT,
        benefit_amount VARCHAR(255),
        insured_amount VARCHAR(255),
        premium_male INTEGER,
        premium_female INTEGER,
        base_premium INTEGER,
        applied_rate VARCHAR(50),
        payment_type VARCHAR(100),
        source_file VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_fire_rates_lookup ON public.insurance_fire_rates (company_name);
    """
    
    print("[*] Bypassing table creation SQL (already created in SQL editor)...")
    # try:
    #     supabase.rpc('exec_sql', {'sql_query': create_table_sql}).execute()
    #     print("[+] Table created or verified.")
    # except Exception as e:
    #     print(f"[-] Failed to execute table creation SQL: {e}")
    #     return
        
    csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\home_fire\extracted_data.csv"
    if not os.path.exists(csv_path):
        print(f"[-] File not found: {csv_path}")
        return
        
    df = pd.read_csv(csv_path, encoding='utf-8')
    print(f"[*] Loaded CSV: {len(df)} rows")
    
    # Find base premium for each product name
    base_premiums = {}
    for idx, row in df.iterrows():
        prod_name = str(row['상품명'])
        pm = clean_premium(row.get('기준보험료', ''))
        pf = clean_premium(row.get('가입보험료', ''))
        prem = pm if pm > 0 else pf
        if prem > 0 and prod_name not in base_premiums:
            base_premiums[prod_name] = prem
            print(f"  [Found Base] {prod_name} -> {prem} KRW")
            
    records = []
    for idx, row in df.iterrows():
        prod_name = str(row['상품명'])
        pm = clean_premium(row.get('기준보험료', ''))
        pf = clean_premium(row.get('가입보험료', ''))
        
        # Get standard base premium for this product
        bp = base_premiums.get(prod_name, pm if pm > 0 else pf)
        
        rate_val = row.get('적용이율', '')
        rate_str = str(rate_val) if pd.notna(rate_val) else ""
        pay_period = parse_payment_period(row)
        
        records.append({
            "company_name": str(row['보험회사']),
            "product_name": prod_name,
            "division": str(row['구분']) if pd.notna(row['구분']) else "",
            "benefit_name": str(row['담보명(급부명)']),
            "benefit_reason": str(row['지급사유']) if pd.notna(row['지급사유']) else "",
            "benefit_amount": str(row['지급금액']) if pd.notna(row['지급금액']) else "",
            "insured_amount": str(row['가입금액']) if pd.notna(row['가입금액']) else "",
            "premium_male": pm,
            "premium_female": pf,
            "base_premium": bp,
            "applied_rate": rate_str,
            "payment_type": f"월납({pay_period})",
            "source_file": str(row['source_file']) if pd.notna(row['source_file']) else ""
        })
        
    print(f"[*] Clearing existing records from insurance_fire_rates...")
    try:
        supabase.table('insurance_fire_rates').delete().neq('company_name', 'DELETE_NONE').execute()
        print("[+] Table cleared successfully.")
    except Exception as e:
        print(f"[-] Error clearing table: {e}")
        return
        
    if records:
        print(f"[*] Uploading {len(records)} fire insurance records in batches of 100...")
        batch_size = 100
        for i in range(0, len(records), batch_size):
            batch = records[i:i+batch_size]
            try:
                supabase.table('insurance_fire_rates').insert(batch).execute()
                print(f"  [+] Uploaded batch {i // batch_size + 1} ({len(batch)} records)")
            except Exception as e:
                print(f"  [-] Failed to upload batch {i // batch_size + 1}: {e}")
                return
        print("[+] SUCCESS! All fire insurance rates uploaded to Supabase.")

if __name__ == "__main__":
    upload_fire_data()
