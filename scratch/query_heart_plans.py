import os
import sys
from supabase import create_client
from dotenv import load_dotenv

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

load_dotenv('.env')
load_dotenv('.env.local')

url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')

if not url or not key:
    print("Supabase credentials missing!")
    sys.exit(1)

supabase = create_client(url, key)

print("--- Querying heart_insurance_plans ---")
res = supabase.table('heart_insurance_plans').select('company, product_name, category, coverage_name, male_premium, female_premium').execute()
if res.data:
    print(f"Total rows: {len(res.data)}")
    for idx, r in enumerate(res.data):
        print(f"[{idx+1}] Company: {r.get('company')} | Product: {r.get('product_name')} | Male: {r.get('male_premium')} | Female: {r.get('female_premium')}")
