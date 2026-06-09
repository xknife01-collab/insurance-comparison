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

print("--- Querying insurance_rates table ---")
res = supabase.table('insurance_rates').select('*').limit(30).execute()

if res.data:
    print(f"Sample rows count: {len(res.data)}")
    for idx, row in enumerate(res.data):
        print(f"Row {idx+1}: Company: {row.get('company_name')} | Gender: {row.get('gender')} | Cancer: {row.get('cancer_rate_10m')} | Brain: {row.get('brain_rate_10m')} | Heart: {row.get('heart_rate_10m')}")
else:
    print("No data in insurance_rates or error:", res)
