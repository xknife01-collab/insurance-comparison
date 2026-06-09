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

print(f"Total Heart Plans in DB: {len(res.data)}")

basic_count = 0
standard_count = 0
vip_count = 0

for row in res.data:
    cov = row.get('coverage_name') or ''
    prod = row.get('product_name') or ''
    text = (cov + " " + prod).lower()
    
    # VIP check
    is_vip = any(k in text for k in ['특정', '부정맥', '심부전', '심혈관'])
    # Standard check
    is_standard = '수술' in text
    
    if is_vip:
        vip_count += 1
    elif is_standard:
        standard_count += 1
    else:
        basic_count += 1

print("\n--- Statistics for each Plan ---")
print(f"1. Basic Plan (Pure Diagnosis) candidate rows: {basic_count}")
print(f"2. Standard Plan (Includes Surgery) candidate rows: {standard_count}")
print(f"3. VIP Plan (Arrhythmia/Heart Failure/Specific Cardiovascular) candidate rows: {vip_count}")
