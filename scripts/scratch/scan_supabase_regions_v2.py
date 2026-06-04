import psycopg2

regions = [
    "ap-northeast-2", "ap-southeast-1", "ap-northeast-1", "ap-southeast-2", "ap-south-1",
    "us-east-1", "us-east-2", "us-west-1", "us-west-2",
    "eu-west-1", "eu-west-2", "eu-west-3", "eu-central-1", "eu-central-2"
]

def main():
    username = "postgres.wfkxwztxpugakusynhpx"
    password = "rlaghddlf0411*"
    
    for reg in regions:
        # Format 1: aws-0-[region]
        # Format 2: aws-[region]
        hosts = [f"aws-0-{reg}.pooler.supabase.com", f"aws-{reg}.pooler.supabase.com"]
        for host in hosts:
            print(f"[*] Trying: {host}...")
            try:
                conn = psycopg2.connect(
                    host=host,
                    user=username,
                    password=password,
                    port=6543,
                    database="postgres",
                    connect_timeout=3
                )
                print(f"\n[+] SUCCESS! Host is {host}!")
                conn.close()
                return
            except Exception as e:
                err_msg = str(e).strip()
                if "tenant/user" in err_msg and "not found" in err_msg:
                    continue
                else:
                    print(f"    [-] Host {host} error: {err_msg}")

if __name__ == "__main__":
    main()
