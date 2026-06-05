import os
from supabase import create_client
from dotenv import load_dotenv

def read_db():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Missing env variables")
        return
        
    supabase = create_client(url, key)
    try:
        res = supabase.table('insurance_fire_rates').select('company_name, product_name, base_premium').execute()
        data = res.data
        print(f"[*] Retrieved {len(data)} rows from insurance_fire_rates")
        
        # Deduplicate by product name
        unique_prods = {}
        for row in data:
            c = row['company_name']
            p = row['product_name']
            bp = row['base_premium']
            unique_prods[p] = (c, bp)
            
        for p, (c, bp) in sorted(unique_prods.items()):
            print(f"  {c.padEnd(12) if hasattr(str, 'padEnd') else c:<15} | {p:<50} | {bp} KRW")
    except Exception as e:
        print(f"[-] Error querying DB: {e}")

if __name__ == "__main__":
    read_db()
