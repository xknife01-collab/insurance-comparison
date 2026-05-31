import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env')
load_dotenv('.env.local')

url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')

supabase = create_client(url, key)
res = supabase.table('insurance_fire_rates').select('company_name').execute()

companies = set(row['company_name'] for row in res.data)
with open("companies_output.txt", "w", encoding="utf-8") as f:
    for c in sorted(companies):
        f.write(f"{c}\n")
print("[+] Done. Output written to companies_output.txt")
