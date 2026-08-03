import psycopg2

def test_conn():
    # Use IPv6 address directly in brackets
    host = "[2406:da18:243:7420:f236:cc9a:5093:5e79]"
    user = "postgres"
    password = "rlaghddlf0411*"
    
    print(f"Testing with IPv6: {host}")
    try:
        conn = psycopg2.connect(host=host, user=user, password=password, database="postgres", port=5432)
        print("Connection Success!")
        conn.close()
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    test_conn()
