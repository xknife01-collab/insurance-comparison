import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(dotenv_path=".env")
load_dotenv(dotenv_path=".env.local")

supabase_url = os.environ.get("VITE_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

supabase = create_client(supabase_url, supabase_key)

# Fetch one row from variable_products
res = supabase.table("variable_products").select("*").limit(1).execute()
if res.data:
    print("Columns:", list(res.data[0].keys()))
else:
    print("No data in table variable_products")
