import os
import sys
from dotenv import load_dotenv
from supabase import create_client

sys.stdout.reconfigure(encoding='utf-8')

load_dotenv('.env.local')
load_dotenv('.env')

url = os.environ.get('VITE_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

res = supabase.table('insurance_dementia_rates').select('*').execute()
records = res.data

co_records = [r for r in records if 'DB생명' in r.get('company_name', '')]
print(f"=== DB생명 RECORDS ({len(co_records)} rows) ===")
for r in co_records:
    print(f"Prod: {r.get('product_name')}")
    print(f"Div: {r.get('division')} | Benefit: {r.get('benefit_name')}")
    print(f"Insured Amt: {r.get('insured_amount')} | Rate: {r.get('applied_rate')}")
    print(f"Male: {r.get('premium_male'):,} 원 | Female: {r.get('premium_female'):,} 원")
    print("-" * 50)
