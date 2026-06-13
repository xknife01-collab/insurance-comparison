import urllib.request
import json
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
url = os.environ.get("VITE_SUPABASE_URL")
anon_key = os.environ.get("VITE_SUPABASE_ANON_KEY")

headers = {
    "apikey": anon_key,
    "Authorization": f"Bearer {anon_key}"
}

req = urllib.request.Request(f"{url}/rest/v1/agencies?select=*", headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print("[+] REST API Success! Agencies:")
        print(json.dumps(data[:2], indent=2, ensure_ascii=False))
except Exception as e:
    print(f"[-] REST API Failed: {e}")
