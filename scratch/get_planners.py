import urllib.request
import json
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
url = os.environ.get("VITE_SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

headers = {
    "apikey": service_key,
    "Authorization": f"Bearer {service_key}"
}

req = urllib.request.Request(f"{url}/rest/v1/planners?select=*", headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print("[+] Planners:")
        print(json.dumps(data, indent=2, ensure_ascii=False))
except Exception as e:
    print(f"[-] Failed: {e}")
