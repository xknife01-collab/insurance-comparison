import os
import requests
import json

url = "https://wfkxwztxpugakusynhpx.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma3h3enR4cHVnYWt1c3luaHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQwNTY5NiwiZXhwIjoyMDg5OTgxNjk2fQ.1JQWf7hQPwxcgtHRHCASoxeVXwRysMIYXvnhAF5MpHg"

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}"
}

print("=== AGENCIES ===")
r = requests.get(f"{url}/rest/v1/agencies", headers=headers)
print(json.dumps(r.json(), indent=2, ensure_ascii=False))

print("\n=== PLANNERS ===")
r = requests.get(f"{url}/rest/v1/planners", headers=headers)
print(json.dumps(r.json(), indent=2, ensure_ascii=False))

print("\n=== LEADS ===")
r = requests.get(f"{url}/rest/v1/customer_leads?limit=5", headers=headers)
print(json.dumps(r.json(), indent=2, ensure_ascii=False))
