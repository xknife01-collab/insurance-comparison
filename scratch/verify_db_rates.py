import os
import sys
from dotenv import load_dotenv
from supabase import create_client

# Force UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv('.env.local')
load_dotenv('.env')

url = os.environ.get('VITE_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if not url or not key:
    print("[-] Supabase URL or Service Role Key missing in environment.")
    sys.exit(1)
    
supabase = create_client(url, key)

# Let's query the table `insurance_dementia_rates`
res = supabase.table('insurance_dementia_rates').select('*').execute()
records = res.data
print(f"Total records in DB: {len(records)}")

# Let's group and check some specific companies
companies = ['DB생명', 'KB라이프생명', '동양생명', '흥국생명', '한화생명', '하나생명', 'iM라이프']

print("\n=== VERIFYING DEMENTIA RATES IN DB ===")
for co in companies:
    co_records = [r for r in records if co in r.get('company_name', '')]
    if not co_records:
        print(f"No records found for {co}")
        continue
    print(f"\nCompany: {co} ({len(co_records)} records)")
    # Print a few samples of age 40 and 60
    samples = [r for r in co_records if r.get('age') in [40, 60]]
    samples = sorted(samples, key=lambda x: (x.get('product_name'), x.get('age'), x.get('gender')))
    for s in samples[:6]:
        print(f"  Prod: {s.get('product_name')} | Age: {s.get('age')} | Gender: {s.get('gender')} | Prev Cycle: {s.get('applied_rate_str')} | Premium: {s.get('premium'):,.0f} 원")
