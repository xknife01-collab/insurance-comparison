import psycopg2
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

def peek_table():
    # 직접 접속 정보 사용
    host = "db.wfkxwztxpugakusynhpx.supabase.co"
    user = "postgres"
    password = "rlaghddlf0411*"
    port = 5432
    dbname = "postgres"

    try:
        conn = psycopg2.connect(
            host=host, 
            user=user, 
            password=password, 
            port=port, 
            database=dbname
        )
        cur = conn.cursor()
        
        # 컬럼 정보 조회
        cur.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'heart_insurance_plans'
            ORDER BY ordinal_position;
        """)
        
        columns = cur.fetchall()
        print("\n=== [heart_insurance_plans 테이블 구조] ===")
        for col in columns:
            print(f"- {col[0]} ({col[1]})")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    peek_table()
