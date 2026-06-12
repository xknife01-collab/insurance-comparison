import os
from dotenv import load_dotenv
from supabase import create_client, Client

env_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local"
if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv()

import sys
# Force UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def run():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Missing Supabase credentials")
        return
        
    print(f"Connecting to Supabase at: {SUPABASE_URL}")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Let's get one row from insurance_dementia_rates
    res = supabase.table("insurance_dementia_rates").select("*").limit(5).execute()
    print(f"Rows count: {len(res.data)}")
    if len(res.data) > 0:
        print("Sample row:")
        import json
        print(json.dumps(res.data[0], ensure_ascii=False, indent=2))
        
        # Let's print columns of the table
        print("Columns:", list(res.data[0].keys()))

if __name__ == "__main__":
    run()
