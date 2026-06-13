import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')
url = os.environ.get('VITE_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

res = supabase.table('insurance_dementia_rates').select('*').eq('product_name', '(무)백년친구 안심보험(2602)(치매보장형)').execute()
print(f"Found {len(res.data)} rows:")
for r in res.data:
    print(f"Rider: {r['benefit_name']}, Male Premium: {r['premium_male']}, Female Premium: {r['premium_female']}, Applied Rate: {r['applied_rate']}")
