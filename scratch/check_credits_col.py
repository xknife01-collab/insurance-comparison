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

def check_column(col):
    req = urllib.request.Request(f"{url}/rest/v1/agencies?select={col}&limit=1", headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(f"[+] Column '{col}' exists! Data: {data}")
            return True
    except Exception as e:
        print(f"[-] Column '{col}' check failed: {e}")
        return False

check_column("current_credits")
