import os
from supabase import create_client
from dotenv import load_dotenv
import sys

sys.stdout.reconfigure(encoding='utf-8')

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Supabase configuration not found.")
        return
        
    supabase = create_client(url, key)
    
    try:
        res = supabase.table('insurance_property_rates').select('*', count='exact').execute()
        count = res.count
        print(f"[+] Total records in insurance_property_rates: {count}")
        
        # print first record
        if len(res.data) > 0:
            print("\n[+] Sample Record:")
            rec = res.data[0]
            for k, v in rec.items():
                print(f"  {k}: {v}")
    except Exception as e:
        print(f"[-] Verification failed: {e}")

if __name__ == "__main__":
    main()
