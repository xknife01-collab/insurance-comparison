import os
from supabase import create_client

# Read env file manually
url = ""
key = ""
with open(".env", "r") as f:
    for line in f:
        if "=" in line:
            parts = line.strip().split("=")
            if parts[0] == "VITE_SUPABASE_URL":
                url = parts[1].strip()
            elif parts[0] == "VITE_SUPABASE_ANON_KEY":
                key = parts[1].strip()

with open(".env.local", "r") as f:
    for line in f:
        if "=" in line:
            parts = line.strip().split("=")
            if parts[0] == "VITE_SUPABASE_URL":
                url = parts[1].strip()
            elif parts[0] == "VITE_SUPABASE_ANON_KEY":
                key = parts[1].strip()

# Create client
supabase = create_client(url, key)

res = supabase.table("variable_products").select("sub_type").execute()
data = res.data

print(f"Total products in variable_products: {len(data)}")

counts = {}
for item in data:
    st = item['sub_type']
    counts[st] = counts.get(st, 0) + 1

print("\nProduct Counts by sub_type:")
for k, v in counts.items():
    print(f"- {k}: {v} products")
