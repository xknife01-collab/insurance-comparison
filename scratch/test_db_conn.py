import psycopg2
import urllib.parse
import os
from dotenv import load_dotenv

load_dotenv(".env")
DATABASE_URL = os.getenv("DATABASE_URL")

print("DATABASE_URL:", DATABASE_URL)

# Option 1: Direct DATABASE_URL from .env (port 5432)
try:
    print("\nOption 1: Connecting with raw DATABASE_URL (port 5432)")
    conn = psycopg2.connect(DATABASE_URL)
    print("Success!")
    conn.close()
except Exception as e:
    print("Failed:", e)

# Option 2: Connecting with DATABASE_URL on port 6543
try:
    print("\nOption 2: Connecting with DATABASE_URL replacing port 5432 with 6543")
    url_6543 = DATABASE_URL.replace(":5432/", ":6543/")
    conn = psycopg2.connect(url_6543)
    print("Success!")
    conn.close()
except Exception as e:
    print("Failed:", e)

# Option 3: Connecting to direct host with correct DNS
try:
    print("\nOption 3: Connecting to direct host: aws-0-ap-southeast-1.pooler.supabase.com with port 6543")
    conn = psycopg2.connect(
        host="aws-0-ap-southeast-1.pooler.supabase.com",
        user="postgres.wfkxwztxpugakusynhpx",
        password="rlaghddlf0411*",
        port=6543,
        database="postgres"
    )
    print("Success!")
    conn.close()
except Exception as e:
    print("Failed:", e)
