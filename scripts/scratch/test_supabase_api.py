import os
from supabase import create_client
from dotenv import load_dotenv

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('VITE_SUPABASE_ANON_KEY')
    
    print(f"URL: {url}")
    print(f"Key preview: {key[:20]}...")
    
    try:
        supabase = create_client(url, key)
        # Try fetching from planners table
        res = supabase.table('planners').select('*').limit(1).execute()
        print("[+] Success!")
        print(res.data)
    except Exception as e:
        print(f"[-] Failed: {e}")

if __name__ == "__main__":
    main()
