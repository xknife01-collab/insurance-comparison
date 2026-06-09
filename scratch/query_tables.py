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

print("\n--- insurance_cancer_products Sample (10 rows) ---")
res = supabase.table('insurance_cancer_products').select('company_name, product_name, category').limit(10).execute()
for r in res.data or []:
    print(r)

print("\n--- health_general_products Sample (10 rows) ---")
res = supabase.table('health_general_products').select('company_name, product_name').limit(10).execute()
for r in res.data or []:
    print(r)

print("\n--- insurance_yu_byung_ja Sample (10 rows) ---")
res = supabase.table('insurance_yu_byung_ja').select('company_name, product_name, category').limit(10).execute()
for r in res.data or []:
    print(r)
