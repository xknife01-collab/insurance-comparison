import psycopg2

def main():
    ipv6_addr = "2406:da18:e5c:b700:7f66:6c70:579f:ae2c"
    print(f"[*] Connecting directly to IPv6 address: {ipv6_addr}...")
    try:
        conn = psycopg2.connect(
            host=ipv6_addr,
            user="postgres",
            password="rlaghddlf0411*",
            port=5432,
            database="postgres"
        )
        print("[+] SUCCESS! Connected directly via IPv6!")
        conn.close()
    except Exception as e:
        print(f"[-] Failed: {e}")

if __name__ == "__main__":
    main()
