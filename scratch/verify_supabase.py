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

def verify():
    print(f"[*] Checking Supabase tables...")
    
    # Check rates
    r1 = requests.get(f"{SUPABASE_URL}/rest/v1/brain_insurance_rates?select=count", headers=headers)
    print(f"  [Rates Count] {r1.text}")
    
    # Check products
    r2 = requests.get(f"{SUPABASE_URL}/rest/v1/brain_insurance_products?select=count", headers=headers)
    print(f"  [Products Count] {r2.text}")
    
    # Check sample row
    r3 = requests.get(f"{SUPABASE_URL}/rest/v1/brain_insurance_rates?limit=1", headers=headers)
    print(f"  [Sample Rate] {r3.json()}")

if __name__ == "__main__":
    verify()
