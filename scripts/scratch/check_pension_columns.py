import os
from supabase import create_client
from dotenv import load_dotenv

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    supabase = create_client(url, key)
    
    try:
        res = supabase.table("pension_products").select("*").limit(1).execute()
        if res.data:
            print("[+] Sample row keys from pension_products:")
            for k, v in res.data[0].items():
                print(f"  - {k}: {type(v).__name__} = {repr(v)[:100]}")
    except Exception as e:
        print(f"[-] Error: {e}")

if __name__ == "__main__":
    main()
