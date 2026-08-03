import psycopg2
import urllib.parse

def test_conn():
    # Try Seoul region pooler
    host = "aws-0-ap-northeast-2.pooler.supabase.com"
    user = "postgres.wfkxwztxpugakusynhpx"
    password = "rlaghddlf0411*"
    
    encoded_password = urllib.parse.quote(password)
    DB_URL = f"postgresql://{user}:{encoded_password}@{host}:5432/postgres"
    
    print(f"Testing with: {host}")
    try:
        conn = psycopg2.connect(DB_URL)
        print("Connection Success!")
        conn.close()
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    test_conn()
