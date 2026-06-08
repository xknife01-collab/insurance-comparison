import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
load_dotenv('.env.local')

db_url = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {db_url}")

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = cur.fetchall()
    print("Tables in public schema:")
    for t in tables:
        print(f"- {t[0]}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
