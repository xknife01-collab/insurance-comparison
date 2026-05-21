import os
from supabase import create_client, Client

url, key = "", ""
env_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local'
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            if 'VITE_SUPABASE_URL' in line: url = line.split('=')[1].strip()
            if 'SUPABASE_SERVICE_ROLE_KEY' in line: key = line.split('=')[1].strip()

supabase: Client = create_client(url, key)

res = supabase.table('insurance_surgery_hospital_rates').select("*").order('premium_male', desc=True).limit(10).execute()
for r in res.data:
    print(f"Company: {r['company_name']}, Product: {r['product_name']}, Male Premium: {r['premium_male']}")
