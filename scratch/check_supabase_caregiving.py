import os
import sys
from supabase import create_client
from dotenv import load_dotenv

# Force UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv(".env.local")
load_dotenv(".env")

def run():
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Key missing in env")
        return
        
    supabase = create_client(url, key)
    res = supabase.table('caregiving_insurance_plans').select('*').execute()
    print(f"Total rows: {len(res.data)}")
    for r in res.data[:10]:
        print(f"ID: {r['id']} | Company: {r['company_name']} | Product: {r['product_name']} | Type: {r['care_type']} | Male 40: {r['premium_male_40']} | Female 40: {r['premium_female_40']} | Increasing: {r['is_increasing']}")

if __name__ == "__main__":
    run()
