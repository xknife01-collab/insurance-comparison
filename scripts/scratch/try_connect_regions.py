# -*- coding: utf-8 -*-
import psycopg2

def try_connect():
    regions = [
        "ap-northeast-2", # Seoul
        "ap-southeast-1", # Singapore
        "ap-northeast-1", # Tokyo
        "us-east-1",      # N. Virginia
        "us-west-1",      # N. California
        "eu-west-1"       # Ireland
    ]
    for reg in regions:
        host = f"aws-0-{reg}.pooler.supabase.com"
        print(f"[*] Trying region {reg} ({host})...")
        try:
            conn = psycopg2.connect(
                host=host,
                port=6543,
                database="postgres",
                user="postgres.wfkxwztxpugakusynhpx",
                password="rlaghddlf0411*",
                sslmode="require",
                connect_timeout=3
            )
            print(f"[+] SUCCESS connected to {reg}!")
            conn.close()
            return host
        except Exception as e:
            print(f"[-] Failed for {reg}: {e}")
    return None

if __name__ == "__main__":
    try_connect()
