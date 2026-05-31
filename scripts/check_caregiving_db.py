import os
import psycopg2
from dotenv import load_dotenv

# Try to load .env.local first, then .env
load_dotenv(".env.local")
load_dotenv(".env")

def run():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("[-] DATABASE_URL not found in environment variables.")
        return

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Check if table caregiving_insurance_plans exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'caregiving_insurance_plans'
            );
        """)
        table_exists = cur.fetchone()[0]
        print(f"[*] Table 'caregiving_insurance_plans' exists: {table_exists}")

        if table_exists:
            cur.execute("SELECT COUNT(*) FROM public.caregiving_insurance_plans")
            cnt = cur.fetchone()[0]
            print(f"[*] Total rows in 'caregiving_insurance_plans': {cnt}")
            
            if cnt > 0:
                cur.execute("SELECT * FROM public.caregiving_insurance_plans LIMIT 3")
                # Get column names
                colnames = [desc[0] for desc in cur.description]
                rows = cur.fetchall()
                print("[*] Sample data:")
                for r in rows:
                    print(dict(zip(colnames, r)))
            else:
                print("[-] The table is EMPTY.")
        else:
            # Let's list all tables in public schema
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public';
            """)
            tables = cur.fetchall()
            print("[*] Available tables in public schema:")
            for t in tables:
                print(f"- {t[0]}")
                
        conn.close()
    except Exception as e:
        print(f"[-] Supabase Connection/Query Error: {e}")

if __name__ == "__main__":
    run()
