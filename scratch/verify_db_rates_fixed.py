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
print(f"Total records: {len(records)}")

companies = ['DB생명', 'KB라이프생명', '동양생명', '흥국생명', '한화생명', '하나생명', 'iM라이프']

print("\n=== SELECTED COMPANY RATES IN DATABASE ===")
for co in companies:
    co_records = [r for r in records if co in r.get('company_name', '')]
    print(f"\n★ Company: {co} ({len(co_records)} rows)")
    for r in co_records[:5]:
        print(f"  Prod: {r.get('product_name')}")
        print(f"  Div: {r.get('division')} | Benefit: {r.get('benefit_name')}")
        print(f"  Insured Amt: {r.get('insured_amount')} | Rate: {r.get('applied_rate')}")
        print(f"  Male Premium: {r.get('premium_male'):,} 원 | Female Premium: {r.get('premium_female'):,} 원")
        print("-" * 50)
