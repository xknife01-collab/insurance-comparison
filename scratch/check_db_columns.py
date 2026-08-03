import os
from supabase import create_client, Client

url, key = "", ""
env_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local'
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            if 'VITE_SUPABASE_URL' in line: url = line.split('=')[1].strip()
            if 'SUPABASE_SERVICE_ROLE_KEY' in line: key = line.split('=')[1].strip()

supabase: Client = create_client(url, key)

try:
    # Get a single row to inspect columns
    res = supabase.table('insurance_surgery_hospital_rates').select("*").limit(1).execute()
    if res.data:
        print("Existing Columns:", list(res.data[0].keys()))
    else:
        print("Table is empty. Cannot determine columns via select.")
        # Try a dummy insert or another way if possible
except Exception as e:
    print(f"Error checking columns: {e}")
