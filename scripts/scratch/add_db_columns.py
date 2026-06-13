import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")
load_dotenv(dotenv_path=".env.local")

db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("[-] DATABASE_URL not found in environment.")
    exit(1)

print(f"[*] Connecting to database...")
conn = psycopg2.connect(db_url)
conn.autocommit = True
cur = conn.cursor()

try:
    print("[*] Adding columns to variable_products table...")
    # Add male_rider_40 column if it doesn't exist
    cur.execute("""
        ALTER TABLE variable_products 
        ADD COLUMN IF NOT EXISTS male_rider_40 NUMERIC DEFAULT 0;
    """)
    # Add female_rider_40 column if it doesn't exist
    cur.execute("""
        ALTER TABLE variable_products 
        ADD COLUMN IF NOT EXISTS female_rider_40 NUMERIC DEFAULT 0;
    """)
    print("[+] Columns added successfully!")
except Exception as e:
    print(f"[-] Error: {e}")
finally:
    cur.close()
    conn.close()
