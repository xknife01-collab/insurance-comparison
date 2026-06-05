import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv('.env')
load_dotenv('.env.local')

url = os.getenv('VITE_SUPABASE_URL') or os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
client = create_client(url, key)

res = client.table('variable_products').select('*').eq('sub_type', 'term_pure').execute()
print(f"Total term_pure products: {len(res.data)}")
# Sort by male premium ascending
sorted_data = sorted(res.data, key=lambda x: x.get('male_premium_40', 0))
for i, p in enumerate(sorted_data):
    print(f"{i+1:02d} | {p['company']} | {p['product_name']} | male: {p['male_premium_40']} | female: {p['female_premium_40']}")
