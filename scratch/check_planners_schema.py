import os
from supabase import create_client
from dotenv import load_dotenv

def check_schema():
    load_dotenv('.env')
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    supabase = create_client(url, key)
    
    # Try using exec_sql to print columns
    try:
        sql = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'planners';"
        res = supabase.rpc('exec_sql', {'sql_query': sql}).execute()
        for row in res.data:
            print(f"{row['column_name']}: {row['data_type']}")
    except Exception as e:
        print(f"exec_sql failed, fetching a single record to inspect keys: {e}")
        try:
            res = supabase.table('planners').select('*').limit(1).execute()
            if res.data:
                for k, v in res.data[0].items():
                    print(f"{k}: {type(v)}")
            else:
                print("No records found in planners table.")
        except Exception as ex:
            print(f"Failed to fetch record: {ex}")

if __name__ == "__main__":
    check_schema()
