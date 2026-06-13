import psycopg2

regions = [
    "ap-east-1",      # Hong Kong
    "ap-southeast-3", # Jakarta
    "ap-southeast-4", # Melbourne
    "eu-south-1",      # Milan
    "eu-south-2",      # Spain
    "me-south-1",      # Bahrain
    "me-central-1",    # Dubai
    "af-south-1",      # Cape Town
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
                connect_timeout=4
            )
            print(f"    [+] SUCCESS connected to {host}!")
            conn.close()
            return
        except Exception as e:
            err_msg = str(e).strip()
            print(f"    [-] Error: {err_msg}")

if __name__ == "__main__":
    main()
