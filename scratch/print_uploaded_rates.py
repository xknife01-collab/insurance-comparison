import os
import pandas as pd
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')
load_dotenv('.env')

url = os.environ.get('VITE_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

res = supabase.table('insurance_dementia_rates').select('*').eq('company_name', 'DB생명').execute()
df = pd.DataFrame(res.data)
print("=== DB생명 UPLOADED RATES ===")
for idx, r in df.iterrows():
    print(f"Product: {r['product_name']}")
    print(f"Division: {r['division']}")
    print(f"Benefit: {r['benefit_name']}")
    print(f"Amt Str: {r['benefit_amount']}")
    print(f"Insured Str: {r['insured_amount']}")
    print(f"Male Premium: {r['premium_male']}")
    print(f"Female Premium: {r['premium_female']}")
    print(f"Rate: {r['applied_rate']}")
    print("-" * 50)
