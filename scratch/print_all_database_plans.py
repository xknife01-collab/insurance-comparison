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
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    supabase = create_client(url, key)
    res = supabase.table('caregiving_insurance_plans').select('*').order('company_name').execute()
    
    print(f"Total rows: {len(res.data)}")
    for idx, r in enumerate(res.data):
        print(f"[{idx+1}] {r['company_name']} | {r['product_name']} | Type: {r['care_type']} | M: {r['premium_male_40']} | F: {r['premium_female_40']} | Inc: {r['is_increasing']} | Ren: {r['is_renewable']}")

if __name__ == "__main__":
    run()
