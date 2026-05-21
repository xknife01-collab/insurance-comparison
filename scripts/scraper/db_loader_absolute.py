import json
import requests
import os
import uuid
import re
from dotenv import load_dotenv

load_dotenv(os.path.join(os.getcwd(), ".env.local"))
load_dotenv(os.path.join(os.getcwd(), ".env"))
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def upsert_data(table, data_list):
    if not data_list: return 0
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    endpoint = f"{URL}/rest/v1/{table}"
    
    batch_size = 50
    success = 0
    for i in range(0, len(data_list), batch_size):
        batch = data_list[i : i + batch_size]
        try:
            resp = requests.post(endpoint, headers=headers, json=batch)
            if resp.status_code in [200, 201, 204]:
                success += len(batch)
                print(f"  [+] {table} {success}/{len(data_list)} sync'd")
            else:
                print(f"  [!] {table} error {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"  [!] Exception: {e}")
    return success

def clean_p_code(name):
    # Remove all non-alphanumeric/korean, replace with underscore
    clean = re.sub(r'[^a-zA-Z0-9ㄱ-힣]', '_', name)
    return clean[:100]

def main():
    json_path = "scripts/scraper/unified_products_final.json"
    if not os.path.exists(json_path):
        print("JSON not found")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    print(f"[*] Total items in JSON: {len(raw_data)}")
    
    products = []
    rates = []
    
    p_seen = set()

    for item in raw_data:
        p_name = item.get('product_name', 'Unnamed_Product')
        if not p_name or str(p_name) == 'nan': p_name = f"Unknown_{item['company']}"
        
        # Truly unique code using company prefix
        p_code = f"{clean_p_code(item['company'])}_{clean_p_code(p_name)}"[:50]
        
        # If duplicated code, append a short random string to ensure it's loaded as a separate product
        if p_code in p_seen:
            p_code = f"{p_code[:40]}_{str(uuid.uuid4())[:8]}"
            
        products.append({
            "product_code": p_code[:50],
            "company_name": item['company'][:100],
            "display_name": p_name[:200], # Truncated to 200 to meet DB limit
            "standard_code": p_code[:50], 
            "category": item['category'][:50]
        })
        p_seen.add(p_code)

        for key, val in item['rates'].items():
            if val >= 0: # Load everything, even 0 for baseline
                try:
                    parts = key.split("_")
                    if len(parts) >= 3:
                        gender = parts[1]
                        age = int(parts[2])
                        
                        rates.append({
                            "product_code": p_code[:50], # Ensure matches product_code
                            "gender": gender,
                            "age": age,
                            "job_class": 1,
                            "rate_data": {
                                "premium": val,
                                "coverages": item['coverages'],
                                "extras": item['extras']
                            }
                        })
                except Exception as ex:
                    print(f"Rate parsing error for {p_code}: {ex}")

    print(f"[*] Prepared {len(products)} products and {len(rates)} rates.")
    
    # 2. Upload
    print(f"[*] Starting upload to {URL}...")
    p_cnt = upsert_data("insurance_products", products)
    r_cnt = upsert_data("insurance_rates", rates)
    
    print(f"\n[*] UPLOAD FINISHED: {p_cnt} products, {r_cnt} rates.")

if __name__ == "__main__":
    main()
