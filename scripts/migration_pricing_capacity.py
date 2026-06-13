import psycopg2
import urllib.parse

password = urllib.parse.quote("rlaghddlf0411*")
# Try ap-northeast-2 (Seoul) pooler host
DB_URL = f"postgresql://postgres.wfkxwztxpugakusynhpx:{password}@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"

def test_connection():
    print(f"[*] Trying ap-northeast-2 connection...")
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        print("  - Connection successful! Running migrations...")
        
        cur.execute("ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'basic';")
        cur.execute("ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS max_planner_limit INTEGER DEFAULT 13; ")
        cur.execute("UPDATE public.agencies SET subscription_tier = 'pro', max_planner_limit = 28 WHERE subscription_tier IS NULL;")
        
        conn.commit()
        cur.close()
        conn.close()
        print("[+] Migration completed successfully!")
    except Exception as e:
        print(f"[!] Connection failed: {e}")

if __name__ == "__main__":
    test_connection()
