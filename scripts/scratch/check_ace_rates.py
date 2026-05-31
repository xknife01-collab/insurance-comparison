import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env')
load_dotenv('.env.local')

url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')

supabase = create_client(url, key)

# Get Ace (Lina) products
res_ace = supabase.table('insurance_fire_rates').select('*').eq('company_name', '에이스손보(라이나)').execute()
print("=== ACE (LINA) RECORDS ===")
for row in res_ace.data[:5]:
    print(f"Product: {row['product_name']}, Benefit: {row['benefit_name']}, Base Premium: {row['base_premium']}, Male: {row['premium_male']}, Female: {row['premium_female']}")

# Get Meritz products
res_meritz = supabase.table('insurance_fire_rates').select('*').eq('company_name', '메리츠화재').execute()
print("\n=== MERITZ RECORDS ===")
for row in res_meritz.data[:5]:
    print(f"Product: {row['product_name']}, Benefit: {row['benefit_name']}, Base Premium: {row['base_premium']}, Male: {row['premium_male']}, Female: {row['premium_female']}")
