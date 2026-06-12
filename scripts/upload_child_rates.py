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

def upload_child_data():
    load_dotenv('.env')
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Service Role Key missing in env files")
        return
        
    supabase = create_client(url, key)
    
    csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\3_family\child\extracted_data.csv"
    if not os.path.exists(csv_path):
        print(f"[-] File not found: {csv_path}")
        return
        
    df = pd.read_csv(csv_path)
    print(f"[*] Loaded CSV: {len(df)} rows")
    
    records = []
    for idx, row in df.iterrows():
        pm = clean_premium(row.get('기준보험료', ''))
        pf = clean_premium(row.get('가입보험료', ''))
        
        rate_val = row.get('적용이율', '')
        if pd.isna(rate_val) or str(rate_val).strip() == '':
            for col in df.columns:
                if '원본_열' in col:
                    val = str(row[col])
                    if '%' in val and len(val.strip()) < 10 and re.match(r'^\s*\d+(\.\d+)?\s*%\s*$', val):
                        rate_val = val.strip()
                        break
        
        rate_str = str(rate_val) if pd.notna(rate_val) else ""
        
        prod_name = str(row['상품명'])
        if len(prod_name) > 50:
            prod_name = prod_name[:50]
            
        benefit_amt = str(row['지급금액']) if pd.notna(row['지급금액']) else ""
        if len(benefit_amt) > 100:
            benefit_amt = benefit_amt[:100]
            
        ins_amt = str(row['가입금액']) if pd.notna(row['가입금액']) else ""
        if len(ins_amt) > 50:
            ins_amt = ins_amt[:50]
            
        records.append({
            "company_name": str(row['보험회사']),
            "product_name": prod_name,
            "division": str(row['구분']) if pd.notna(row['구분']) else "",
            "benefit_name": str(row['담보명(급부명)']) if pd.notna(row['담보명(급부명)']) else "",
            "benefit_reason": str(row['지급사유']) if pd.notna(row['지급사유']) else "",
            "benefit_amount": benefit_amt,
            "insured_amount": ins_amt,
            "premium_male": pm,
            "premium_female": pf,
            "applied_rate": rate_str,
            "payment_type": "월납(주계약+특약종합)",
            "source_file": str(row['source_file']) if pd.notna(row['source_file']) else "",
            "category": str(row.get('category_target')) if pd.notna(row.get('category_target')) else "child"
        })
        
    print(f"[*] Clearing insurance_child_rates table...")
    try:
        supabase.table('insurance_child_rates').delete().neq('company_name', 'DELETE_NONE').execute()
        print("[+] Table cleared.")
    except Exception as e:
        print(f"[-] Error clearing table: {e}")
        return
        
    if records:
        print(f"[*] Uploading {len(records)} child insurance records...")
        try:
            supabase.table('insurance_child_rates').insert(records).execute()
            print("[+] SUCCESS! Supabase insurance_child_rates table is now updated.")
        except Exception as e:
            print(f"[-] Upload failed: {e}")

if __name__ == "__main__":
    upload_child_data()
