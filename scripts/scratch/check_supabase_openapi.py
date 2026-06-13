# -*- coding: utf-8 -*-
import urllib.request
import json
import os
import sys
import ssl
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')

def main():
    load_dotenv('.env.local')
    load_dotenv('.env')
    
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not url or not key:
        print("[-] VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.")
        return
        
    print(f"[*] Fetching OpenAPI spec from {url}/rest/v1/...")
    req = urllib.request.Request(
        f"{url}/rest/v1/",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}"
        }
    )
    
    try:
        context = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=context) as response:
            spec = json.loads(response.read().decode('utf-8'))
            paths = spec.get("paths", {})
            tables = sorted([p.replace("/", "") for p in paths.keys() if p != "/"])
            print("[+] Tables found in public schema:")
            for t in tables:
                print(f"  - {t}")
    except Exception as e:
        print("[-] Failed to fetch OpenAPI spec:", e)

if __name__ == '__main__':
    main()
