import os
import dotenv
from supabase import create_client

# Load env variables from .env.local
env = dotenv.dotenv_values(".env.local")
url = env.get("VITE_SUPABASE_URL")
key = env.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Env missing URL or key!")
    exit(1)

supabase = create_client(url, key)
response = supabase.table("planners").select("*").execute()
for planner in response.data:
    print(f"ID: {planner.get('id')} | Code: {planner.get('planner_code')} | Name: {planner.get('name')}")
