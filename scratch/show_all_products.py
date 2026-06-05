from supabase import create_client
import os

supabase_url = None
supabase_key = None

# Read from .env.local
env_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local"
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if "=" in line:
                key, val = line.strip().split("=", 1)
                if key.strip() == "VITE_SUPABASE_URL":
                    supabase_url = val.strip().strip('"').strip("'")
                elif key.strip() == "VITE_SUPABASE_ANON_KEY":
                    supabase_key = val.strip().strip('"').strip("'")

print("Supabase URL:", supabase_url)
if supabase_url and supabase_key:
    client = create_client(supabase_url, supabase_key)
    res = client.table("variable_products").select("*").execute()
    data = res.data
    print(f"Total products in variable_products: {len(data)}")
    for i, item in enumerate(data):
        print(f"{i+1}: Company: {item.get('company')}, Product: {item.get('product_name')}, Subtype: {item.get('sub_type')}")
else:
    print("Credentials not found")
