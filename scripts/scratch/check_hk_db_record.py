import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment files
load_dotenv(dotenv_path=".env")
load_dotenv(dotenv_path=".env.local")

supabase_url = os.environ.get("VITE_SUPABASE_URL") or os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase = create_client(supabase_url, supabase_key)

res = supabase.table("variable_products").select("*").ilike("product_name", "%흥국생명 온라인정기보험%").execute()

print("=== Supabase 흥국생명 온라인정기보험 Records ===")
for row in res.data:
    print(f"ID: {row.get('id')} | Company: {row.get('company')} | Product: {row.get('product_name')}")
    print(f"  Male 40: {row.get('male_premium_40')} | Female 40: {row.get('female_premium_40')}")
    print(f"  Sub Type: {row.get('sub_type')}")
