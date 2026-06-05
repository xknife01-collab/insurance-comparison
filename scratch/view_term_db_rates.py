import os
from supabase import create_client

env_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local"
supabase_url = None
supabase_key = None

if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if "=" in line:
                key, val = line.strip().split("=", 1)
                if key.strip() == "VITE_SUPABASE_URL":
                    supabase_url = val.strip().strip('"').strip("'")
                elif key.strip() == "VITE_SUPABASE_ANON_KEY":
                    supabase_key = val.strip().strip('"').strip("'")

if supabase_url and supabase_key:
    client = create_client(supabase_url, supabase_key)
    res = client.table("variable_products").select("company, product_name, sub_type, male_premium_40, female_premium_40").execute()
    data = res.data
    # Filter for term products
    term_products = [x for x in data if "term" in x.get("sub_type", "")]
    # Print with utf-8 override or raw print
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    print(f"Total term products: {len(term_products)}")
    for p in sorted(term_products, key=lambda x: x.get('male_premium_40', 0)):
        print(f"{p['company']} | {p['product_name']} | male: {p['male_premium_40']} | female: {p['female_premium_40']}")
else:
    print("Credentials not found")
