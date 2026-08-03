import psycopg2
import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

def test_conn():
    DB_URL_RAW = os.getenv("DATABASE_URL")
    print(f"Testing with: {DB_URL_RAW}")
    
    try:
        prefix, rest = DB_URL_RAW.split("://", 1)
        user_pass, host_db = rest.split("@", 1)
        user, password = user_pass.split(":", 1)
        encoded_password = urllib.parse.quote(password)
        DB_URL = f"{prefix}://{user}:{encoded_password}@{host_db}"
        
        conn = psycopg2.connect(DB_URL)
        print("Connection Success!")
        conn.close()
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    test_conn()
