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

print("--- Querying brain_insurance_rates from Supabase ---")
res = supabase.table('brain_insurance_rates').select('*').execute()

if res.data:
    df_db = sorted(res.data, key=lambda x: x['premium'], reverse=True)
    print(f"Total rows in brain_insurance_rates: {len(df_db)}")
    print(f"Max Premium in DB: {df_db[0]['premium']} ({df_db[0]['product_name']} | Gender: {df_db[0]['gender']})")
    print(f"Min Premium in DB: {df_db[-1]['premium']} ({df_db[-1]['product_name']} | Gender: {df_db[-1]['gender']})")
    
    print("\n--- Top 10 Highest Premiums currently in Supabase ---")
    for idx, row in enumerate(df_db[:10]):
        print(f"{idx+1}. Product: {row['product_name']} | Benefit: {row['benefit_name']} | Gender: {row['gender']} | Premium: {row['premium']}")
        
    print("\n--- Top 10 Lowest Premiums currently in Supabase ---")
    for idx, row in enumerate(reversed(df_db[-10:])):
        print(f"{idx+1}. Product: {row['product_name']} | Benefit: {row['benefit_name']} | Gender: {row['gender']} | Premium: {row['premium']}")
else:
    print("No data or error querying brain_insurance_rates")
