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

req = urllib.request.Request(f"{url}/rest/v1/", headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        spec = json.loads(response.read().decode())
        paths = spec.get("paths", {})
        print("[+] RPC paths found:")
        for path in paths:
            if path.startswith("/rpc/"):
                print(f"  {path}")
except Exception as e:
    print(f"[-] Failed: {e}")
