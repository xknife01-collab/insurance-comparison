import os, requests
from dotenv import load_dotenv

load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
headers = {"apikey": KEY, "Authorization": f"Bearer {KEY}"}

res = requests.get(f"{URL}/rest/v1/agencies", headers=headers)
print("STATUS:", res.status_code)
for item in res.json():
    print(item)
