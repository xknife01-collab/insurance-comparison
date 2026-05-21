import pandas as pd
import re
import os
from supabase import create_client
from dotenv import load_dotenv

def upload_final_heart_data():
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    supabase = create_client(url, key)

    file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_extracted_data.xlsx'
    df = pd.read_excel(file_path, header=None)
    
    def clean(val):
        if pd.isna(val): return 0
        s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
        match = re.search(r'(\d+)', s)
        return int(match.group(1)) if match else 0

    # Index 0: Company, Index 1: Product, Index 6: Male, Index 7: Female, Index 4: Coverage
    df['m'] = df[6].apply(clean)
    df['f'] = df[7].apply(clean)
    
    # Group by Product and Company
    # Sum premiums across all rows (Base + Riders)
    summary = df.groupby([0, 1]).agg({
        'm': 'sum', 
        'f': 'sum',
        4: lambda x: ' / '.join(set(str(v) for v in x if not pd.isna(v)))[:500] # Combine coverage descriptions
    }).reset_index()

    # Apply 1.36 multiplier for missing gender values
    # Male = Female * 1.36 (if male is 0)
    # Female = Male / 1.36 (if female is 0)
    RATIO = 1.36
    
    records = []
    for _, row in summary.iterrows():
        m_prem = row['m']
        f_prem = row['f']
        
        if m_prem == 0 and f_prem > 0:
            m_prem = int(f_prem * RATIO)
        elif f_prem == 0 and m_prem > 0:
            f_prem = int(m_prem / RATIO)
            
        # Ignore if both are still 0 or below a threshold
        if m_prem < 3000: continue
        
        # Cap extremely high values (outliers)
        if m_prem > 150000: continue
        if f_prem > 150000: continue
        
        # Explicitly exclude specific products requested by user
        product_name_str = str(row[1])
        if "M-케어" in product_name_str and "3.10.5" in product_name_str: continue
        if "바로담는간편건강보험" in product_name_str: continue

        records.append({
            "company": str(row[0]),
            "product_name": product_name_str,
            "male_premium": m_prem,
            "female_premium": f_prem,
            "coverage_name": str(row[4]),
            "category": "heart"
        })

    print(f"[*] Clearing heart_insurance_plans table...")
    supabase.table('heart_insurance_plans').delete().neq('id', -1).execute()

    if records:
        print(f"[*] Uploading {len(records)} cleaned and summed heart insurance records...")
        supabase.table('heart_insurance_plans').insert(records).execute()
        print("[+] SUCCESS! Database is now updated with precise premiums.")

if __name__ == "__main__":
    upload_final_heart_data()
