import socket
import psycopg2

def main():
    host = "db.wfkxwztxpugakusynhpx.supabase.co"
    print(f"[*] Resolving IPv6 for {host}...")
    try:
        addrinfo = socket.getaddrinfo(host, 5432, socket.AF_INET6)
        print(f"[+] Found address info:")
        for res in addrinfo:
            print(f"  - {res[4]}")
            
        print("[*] Connecting to database using IPv6 host...")
        conn = psycopg2.connect(
            host=host,
            user="postgres",
            password="rlaghddlf0411*",
            port=5432,
            database="postgres"
        )
        print("[+] SUCCESS! Connected to database!")
        conn.close()
    except Exception as e:
        print(f"[-] Failed: {e}")

if __name__ == "__main__":
    main()
