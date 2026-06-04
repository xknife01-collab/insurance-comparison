import socket
import urllib.parse
import psycopg2

def main():
    host = "wfkxwztxpugakusynhpx.supabase.co"
    try:
        ip = socket.gethostbyname(host)
        print(f"[+] resolved {host} to {ip}")
    except Exception as e:
        print(f"[-] failed to resolve {host}: {e}")
        
    # Let's try ap-northeast-2 pooler host
    regions = ["ap-northeast-2", "ap-southeast-1", "ap-northeast-1"]
    for reg in regions:
        pooler_host = f"aws-0-{reg}.pooler.supabase.com"
        print(f"\n[*] Trying pooler host: {pooler_host}...")
        try:
            conn = psycopg2.connect(
                host=pooler_host,
                user="postgres.wfkxwztxpugakusynhpx",
                password="rlaghddlf0411*",
                port=6543,
                database="postgres"
            )
            print(f"[+] SUCCESS with region {reg}!")
            conn.close()
            break
        except Exception as e:
            print(f"[-] Failed for region {reg}: {e}")

if __name__ == "__main__":
    main()
