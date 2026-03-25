# -*- coding: utf-8 -*-
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def setup_supabase_db():
    db_url = os.environ.get("DATABASE_URL")
    print(f"[*] Connecting to Supabase...")
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # schema.sql의 내용을 로드하여 실행
        schema_path = os.path.join(os.getcwd(), "db", "schema.sql")
        with open(schema_path, "r", encoding="utf-8") as f:
            schema_content = f.read()
            
        print("[*] Creating Tables in Supabase...")
        cur.execute(schema_content)
        conn.commit()
        print("[✔] Supabase DB Setup Completed!")
        
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"[-] DB Setup Error: {e}")
        return False

if __name__ == "__main__":
    setup_supabase_db()
