import psycopg2

def try_conn(host, user, dbname, port=6543):
    print(f"[*] Trying: user={user}, dbname={dbname}, port={port} on {host}")
    try:
        conn = psycopg2.connect(
            host=host,
            user=user,
            password="rlaghddlf0411*",
            port=port,
            database=dbname,
            connect_timeout=5
        )
        print("  [+] SUCCESS!")
        conn.close()
        return True
    except Exception as e:
        print("  [-] Failed:", str(e).strip())
        return False

def main():
    host = "aws-0-ap-southeast-1.pooler.supabase.com"
    # Try different combinations
    try_conn(host, "postgres.wfkxwztxpugakusynhpx", "postgres")
    try_conn(host, "postgres.wfkxwztxpugakusynhpx", "wfkxwztxpugakusynhpx")
    try_conn(host, "postgres", "wfkxwztxpugakusynhpx")
    try_conn(host, "postgres", "postgres")
    
    # Try port 5432
    try_conn(host, "postgres.wfkxwztxpugakusynhpx", "postgres", port=5432)
    try_conn(host, "postgres.wfkxwztxpugakusynhpx", "wfkxwztxpugakusynhpx", port=5432)
    try_conn(host, "postgres", "wfkxwztxpugakusynhpx", port=5432)
    try_conn(host, "postgres", "postgres", port=5432)

if __name__ == "__main__":
    main()
