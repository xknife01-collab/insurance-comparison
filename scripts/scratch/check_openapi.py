import os
import requests
from dotenv import load_dotenv

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('VITE_SUPABASE_ANON_KEY')
    
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}"
    }
    
    print(f"Fetching OpenAPI schema from {url}...")
    try:
        r = requests.get(url, headers=headers)
        spec = r.json()
        
        paths = spec.get("paths", {})
        rpcs = [path for path in paths if path.startswith("/rpc/")]
        
        print(f"[+] Found {len(rpcs)} RPC functions:")
        for rpc in sorted(rpcs):
            print(f"  {rpc}")
            
    except Exception as e:
        print(f"[-] Failed to fetch or parse schema: {e}")

if __name__ == "__main__":
    main()
