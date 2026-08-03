import requests
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

def simulate_frontend():
    print(f"[*] Simulating frontend query...")
    
    # 1. Fetch Rates for Gender M
    r_rates = requests.get(f"{SUPABASE_URL}/rest/v1/brain_insurance_rates?gender=eq.M", headers=headers)
    rates = r_rates.json()
    print(f"  [Rates Found] {len(rates)}")
    
    # 2. Fetch Products
    r_prods = requests.get(f"{SUPABASE_URL}/rest/v1/brain_insurance_products?select=product_name,company_name,category", headers=headers)
    products = r_prods.json()
    print(f"  [Products Found] {len(products)}")
    
    # 3. Try to join
    prod_map = {p['product_name']: p for p in products}
    
    joined = []
    for r in rates:
        p_info = prod_map.get(r['product_name'])
        if p_info:
            joined.append({
                "product": r['product_name'],
                "company": p_info['company_name'],
                "category": p_info['category'],
                "premium": r['premium']
            })
            
    print(f"  [Joined Results] {len(joined)}")
    if joined:
        print(f"  [Sample Joined] {joined[0]}")

if __name__ == "__main__":
    simulate_frontend()
