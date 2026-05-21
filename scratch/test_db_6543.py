import psycopg2
import urllib.parse

def test_conn():
    # Try Singapore region pooler with port 6543
    host = "aws-0-ap-southeast-1.pooler.supabase.com"
    user = "postgres.wfkxwztxpugakusynhpx"
    password = "rlaghddlf0411*"
    
    encoded_password = urllib.parse.quote(password)
    # Port 6543 for transaction pooling
    DB_URL = f"postgresql://{user}:{encoded_password}@{host}:6543/postgres"
    
    print(f"Testing with: {host}:6543")
    try:
        conn = psycopg2.connect(DB_URL)
        print("Connection Success!")
        conn.close()
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    test_conn()
