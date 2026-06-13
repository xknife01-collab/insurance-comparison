import requests
import json

url = "https://wfkxwztxpugakusynhpx.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma3h3enR4cHVnYWt1c3luaHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQwNTY5NiwiZXhwIjoyMDg5OTgxNjk2fQ.1JQWf7hQPwxcgtHRHCASoxeVXwRysMIYXvnhAF5MpHg"

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}"
}

r = requests.get(f"{url}/rest/v1/", headers=headers)
if r.status_code == 200:
    spec = r.json()
    paths = spec.get("paths", {})
    for path in paths.keys():
        if "/rpc/" in path:
            print(f"RPC: {path}")
else:
    print("Failed to get OpenAPI spec:", r.status_code, r.text)
