import psycopg2

URL_5432 = "postgresql://postgres.wfkxwztxpugakusynhpx:rlaghddlf0411%2A@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
URL_6543 = "postgresql://postgres.wfkxwztxpugakusynhpx:rlaghddlf0411%2A@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"

def main():
    for name, url in [("5432", URL_5432), ("6543", URL_6543)]:
        print(f"[*] Trying: {name}...")
        try:
            conn = psycopg2.connect(url, connect_timeout=5)
            print(f"[+] SUCCESS with {name}!")
            conn.close()
        except Exception as e:
            print(f"[-] Failed with {name}: {e}")

if __name__ == "__main__":
    main()
