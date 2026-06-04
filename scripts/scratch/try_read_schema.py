import os
from supabase import create_client
from dotenv import load_dotenv

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    supabase = create_client(url, key)
    
    # Try querying list of RPCs or tables
    try:
        res = supabase.table("pg_proc").select("*").limit(5).execute()
        print("[+] pg_proc exists!")
        print(res.data)
    except Exception as e:
        print(f"[-] pg_proc query failed: {e}")

if __name__ == "__main__":
    main()
