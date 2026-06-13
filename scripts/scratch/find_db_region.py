import psycopg2

regions = [
    "ap-northeast-2", # Seoul
    "ap-southeast-1", # Singapore
    "ap-northeast-1", # Tokyo
    "ap-southeast-2", # Sydney
    "ap-south-1",     # Mumbai
    "us-east-1",      # N. Virginia
    "us-east-2",      # Ohio
    "us-west-1",      # N. California
    "us-west-2",      # Oregon
    "eu-west-1",      # Ireland
    "eu-west-2",      # London
    "eu-west-3",      # Paris
    "eu-central-1",   # Frankfurt
    "ca-central-1",   # Canada Central
    "sa-east-1"       # São Paulo
]

def main():
    username = "postgres.wfkxwztxpugakusynhpx"
    password = "rlaghddlf0411*"
    
    for reg in regions:
        host = f"aws-0-{reg}.pooler.supabase.com"
        print(f"[*] Probing {host}...")
        try:
            conn = psycopg2.connect(
                host=host,
                user=username,
                password=password,
                port=6543,
                database="postgres",
                connect_timeout=5
            )
            print(f"    [+] SUCCESS connected to {host}!")
            conn.close()
            return
        except Exception as e:
            err_msg = str(e).strip()
            print(f"    [-] Error: {err_msg}")

if __name__ == "__main__":
    main()
