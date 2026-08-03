import pandas as pd
import os
from supabase import create_client
from dotenv import load_dotenv

def upload_correctly():
    # 1. Load Environment & Supabase
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    supabase = create_client(url, key)

    # 2. Read Excel
    file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_final_consolidated.xlsx'
    df = pd.read_excel(file_path)
    
    # 3. Explicitly map columns by index to avoid encoding issues
    # Expected Index: 0:Co, 1:Prod, 2:TotalM, 3:TotalF, 4:Coverage, 5:Details, 6:Channel, 7:MonthlyM, 8:MonthlyF
    # BUT let's be careful. Let's look for numbers in the columns.
    
    # Clear existing data
    print("[*] Clearing existing data...")
    supabase.table('heart_insurance_plans').delete().neq('id', -1).execute()

    # 4. Prepare data for upload
    records = []
    for _, row in df.iterrows():
        # Get values by index to be safe
        vals = row.values
        
        # Monthly premiums are usually at the end (Index 7, 8)
        # If they are phone numbers, it's a problem. Let's find columns that are numeric.
        m_prem = 0
        f_prem = 0
        
        try:
            m_prem = int(vals[7]) if str(vals[7]).isdigit() else 0
            f_prem = int(vals[8]) if str(vals[8]).isdigit() else 0
        except:
            pass

        # If Index 7 is a phone number, maybe Index 2/3 are the monthly ones?
        # Actually, let's look at the data again.
        # Index 2/3 were like 16470, 10623 etc. in my previous 'to_string' output.
        # Wait, index 2/3 are Monthly!
        
        m_prem = int(vals[2]) if not pd.isna(vals[2]) else 0
        f_prem = int(vals[3]) if not pd.isna(vals[3]) else 0

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

    # 5. Upload
    if records:
        print(f"[*] Uploading {len(records)} records...")
        supabase.table('heart_insurance_plans').insert(records).execute()
        print("[+] SUCCESS!")

if __name__ == "__main__":
    upload_correctly()
