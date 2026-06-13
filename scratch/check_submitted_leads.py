import os
import sys
import json
from supabase import create_client, Client

sys.stdout.reconfigure(encoding='utf-8')

# Let's read the environment variables or find supabase key/url in the workspace.
# Typically, they are in .env or config files. Let's search for SUPABASE_URL in the workspace.
with open(".env.local", "r") as f:
    env_vars = f.readlines()

url = ""
key = ""
for line in env_vars:
    if "VITE_SUPABASE_URL" in line:
        url = line.split("=")[1].strip()
    if "VITE_SUPABASE_ANON_KEY" in line:
        key = line.split("=")[1].strip()

if not url or not key:
    print("Supabase credentials not found in .env")
    sys.exit(1)

supabase: Client = create_client(url, key)
response = supabase.table("customer_leads").select("*").order("created_at", desc=True).limit(5).execute()

for lead in response.data:
    print(f"ID: {lead['id']}, Name: {lead['name']}, Phone: {lead['phone']}, Type: {lead['insurance_type']}, Created: {lead['created_at']}")
