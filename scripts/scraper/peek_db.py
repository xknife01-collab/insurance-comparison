import os
import requests
from dotenv import load_dotenv

base_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main'
load_dotenv(os.path.join(base_path, '.env'))
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    load_dotenv(os.path.join(base_path, '.env.local'))
    SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

def peek_silson():
    print("[*] Checking medical_silson_products...")
    url_p = f"{SUPABASE_URL}/rest/v1/medical_silson_products?select=product_code,display_name,category"
    res_p = requests.get(url_p, headers=HEADERS).json()
    
    url_r = f"{SUPABASE_URL}/rest/v1/medical_silson_rates?select=product_code,gender,age,rate_data"
    res_r = requests.get(url_r, headers=HEADERS).json()
    
    p_map = {p['product_code']: (p['display_name'], p['category']) for p in res_p}
    
    print("\n--- Rates List ---")
    for r in res_r:
        code = r['product_code']
        gender = r['gender']
        age = r['age']
        premium = r['rate_data']['premium']
        disp_name, cat = p_map.get(code, (code, "Unknown"))
        print(f"[{cat}] {disp_name} | {gender} | Age {age} | Premium: {premium}")

if __name__ == "__main__":
    peek_silson()
