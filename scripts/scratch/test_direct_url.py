import psycopg2

def main():
    host = "wfkxwztxpugakusynhpx.supabase.co"
    username = "postgres"
    password = "rlaghddlf0411*"
    
    for port in [5432, 6543]:
        print(f"[*] Trying direct host {host} on port {port}...")
        try:
            conn = psycopg2.connect(
                host=host,
                user=username,
                password=password,
                port=port,
                database="postgres",
                connect_timeout=5
            )
            print(f"    [+] SUCCESS connected on port {port}!")
            conn.close()
            return
        except Exception as e:
            print(f"    [-] Error: {e}")

if __name__ == "__main__":
    main()
