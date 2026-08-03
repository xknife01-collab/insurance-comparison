import pandas as pd
import os
from supabase import create_client
from dotenv import load_dotenv

def upload_normalized():
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    supabase = create_client(url, key)

    file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_final_consolidated.xlsx'
    df = pd.read_excel(file_path)
    
    # Filter out any lingering Junior/Child products
    exclude_keywords = ['주니어', '어린이', '아이', '태아', '청소년']
    df = df[~df.iloc[:, 1].str.contains('|'.join(exclude_keywords), na=False)]

    print("[*] Clearing existing data...")
    supabase.table('heart_insurance_plans').delete().neq('id', -1).execute()

    records = []
    for _, row in df.iterrows():
        vals = row.values
        
        try:
            m_val = float(vals[2]) if not pd.isna(vals[2]) else 0
            f_val = float(vals[3]) if not pd.isna(vals[3]) else 0
            
            # NORMALIZATION LOGIC:
            # If premium > 40,000, it's likely a YEARLY premium. Divide by 12.
            if m_val > 40000: m_val = m_val / 12
            if f_val > 40000: f_val = f_val / 12
            
            m_prem = int(m_val)
            f_prem = int(f_val)
        except:
            m_prem = 0
            f_prem = 0

        if m_prem == 0: continue

        record = {
            "company": str(vals[0]),
            "product_name": str(vals[1]),
            "male_premium": m_prem,
            "female_premium": f_prem,
            "coverage_name": str(vals[4]),
            "details": str(vals[5]),
            "category": "heart"
        }
        records.append(record)

    if records:
        print(f"[*] Uploading {len(records)} normalized records...")
        supabase.table('heart_insurance_plans').insert(records).execute()
        print("[+] SUCCESS! All premiums are now normalized to monthly.")

if __name__ == "__main__":
    upload_normalized()
