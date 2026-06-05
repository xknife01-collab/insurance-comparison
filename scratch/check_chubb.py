import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv('.env')
load_dotenv('.env.local')

url = os.getenv('VITE_SUPABASE_URL') or os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
client = create_client(url, key)

res = client.table('variable_products').select('*').eq('company', '처브라이프생명').execute()
for p in res.data:
    print(f"{p['product_name']} | sub_type: {p['sub_type']} | male: {p['male_premium_40']} | female: {p['female_premium_40']}")
