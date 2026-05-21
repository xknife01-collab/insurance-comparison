import pandas as pd
import os
from supabase import create_client
from dotenv import load_dotenv

def upload_final_fix():
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
        
        # CORRECT MAPPING BASED ON INSPECTION:
        # Index 0: Company
        # Index 1: Product Name
        # Index 2: Male Monthly Premium (Corrected!)
        # Index 3: Female Monthly Premium (Corrected!)
        # Index 4: Coverage List
        # Index 5: Details
        
        try:
            m_prem = int(vals[2]) if not pd.isna(vals[2]) else 0
            f_prem = int(vals[3]) if not pd.isna(vals[3]) else 0
        except:
            m_prem = 0
            f_prem = 0

        # Skip products with 0 premium
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
        print(f"[*] Uploading {len(records)} verified adult records...")
        supabase.table('heart_insurance_plans').insert(records).execute()
        print("[+] SUCCESS! Data is now clean and correct.")

if __name__ == "__main__":
    upload_final_fix()
