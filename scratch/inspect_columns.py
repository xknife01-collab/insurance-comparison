import requests
import json

url = "https://wfkxwztxpugakusynhpx.supabase.co/rest/v1/planners?select=*&limit=1"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma3h3enR4cHVnYWt1c3luaHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQwNTY5NiwiZXhwIjoyMDg5OTgxNjk2fQ.1JQWf7hQPwxcgtHRHCASoxeVXwRysMIYXvnhAF5MpHg",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma3h3enR4cHVnYWt1c3luaHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQwNTY5NiwiZXhwIjoyMDg5OTgxNjk2fQ.1JQWf7hQPwxcgtHRHCASoxeVXwRysMIYXvnhAF5MpHg"
}

r = requests.get(url, headers=headers)
if r.status_code == 200:
    data = r.json()
    if data:
        print("Columns in planners table:")
        for k in data[0].keys():
            print(f"- {k}")
    else:
        print("No rows found in planners table.")
else:
    print("Failed to fetch:", r.status_code, r.text)
