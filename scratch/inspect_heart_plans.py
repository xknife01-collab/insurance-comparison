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

res = supabase.table('heart_insurance_plans').select('*').execute()

print(f"Total rows: {len(res.data)}")
if res.data:
    df = sorted(res.data, key=lambda x: x.get('male_premium') or 0)
    print("\n--- Top 15 Unique Heart Coverage Names and Products ---")
    seen_coverages = set()
    count = 0
    for row in df:
        cov = row.get('coverage_name') or ''
        prod = row.get('product_name') or ''
        comp = row.get('company') or ''
        male_p = row.get('male_premium')
        female_p = row.get('female_premium')
        
        comb = (comp, prod, cov)
        if comb not in seen_coverages:
            seen_coverages.add(comb)
            print(f"Company: {comp} | Product: {prod} | Coverage: {cov} | Male: {male_p} | Female: {female_p}")
            count += 1
            if count >= 30:
                break
else:
    print("No data.")
