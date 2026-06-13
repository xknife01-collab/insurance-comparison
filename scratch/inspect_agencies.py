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
for a in r.json():
    print(f"Agency ID: {a['id']}, Name: {a['name']}")

print("\n=== PLANNERS ===")
r = requests.get(f"{url}/rest/v1/planners", headers=headers)
for p in r.json():
    print(f"Planner ID: {p['id']}, Name: {p['name']}, Agency ID: {p.get('agency_id')}")
