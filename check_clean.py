import requests, os
from dotenv import load_dotenv
load_dotenv('.env.local')
u = os.getenv('VITE_SUPABASE_URL')
k = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
h = {'apikey': k, 'Authorization': f'Bearer {k}'}
resp = requests.get(f'{u}/rest/v1/brain_insurance_products?select=company_name,product_name', headers=h).json()
with open('clean_output.txt', 'w', encoding='utf-8') as f:
    for i in resp:
        f.write(f"[{i['company_name']}] {i['product_name']}\n")
