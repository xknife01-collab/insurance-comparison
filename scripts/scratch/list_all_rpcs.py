import os
import requests
from dotenv import load_dotenv

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}"
    }
    
    rest_url = f"{url}/rest/v1/"
    print(f"Fetching OpenAPI schema from {rest_url}...")
    try:
        r = requests.get(rest_url, headers=headers)
        spec = r.json()
        
        paths = spec.get("paths", {})
        print(f"[+] Found {len(paths)} paths in spec.")
        rpcs = [path for path in paths.keys() if "/rpc/" in path]
        
        print(f"[+] Found {len(rpcs)} RPC paths:")
        for rpc in sorted(rpcs):
            print(f"  {rpc}")
            
    except Exception as e:
        print(f"[-] Failed: {e}")

if __name__ == "__main__":
    main()
