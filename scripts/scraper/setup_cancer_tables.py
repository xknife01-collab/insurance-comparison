import psycopg2
import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

# Handle special characters in password
DB_URL_RAW = os.getenv("DATABASE_URL")
try:
    prefix, rest = DB_URL_RAW.split("://", 1)
    user_pass, host_db = rest.split("@", 1)
    user, password = user_pass.split(":", 1)
    encoded_password = urllib.parse.quote(password)
    DB_URL = f"{prefix}://{user}:{encoded_password}@{host_db}"
except Exception as e:
    print(f"URL Parsing warning: {e}")
    DB_URL = DB_URL_RAW

def create_cancer_tables():
    print("[*] Creating Cancer Insurance tables in Supabase...")
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # 1. Cancer Products Table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS cancer_insurance_products (
            id SERIAL PRIMARY KEY,
            company_name VARCHAR(100),
            product_name VARCHAR(255) UNIQUE,
            category VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        # 2. Cancer Rates Table
        # We'll use product_name as a key for now
        cur.execute("""
        CREATE TABLE IF NOT EXISTS cancer_insurance_rates (
            id SERIAL PRIMARY KEY,
            product_name VARCHAR(255),
            gender CHAR(1),
            age INT,
            premium INT,
            benefit_name VARCHAR(255),
            benefit_amount VARCHAR(255),
            raw_data JSONB,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        print("  [+] Cancer tables created successfully!")
        return True
    except Exception as e:
        print(f"  [!] Failed to create cancer tables: {e}")
        return False

if __name__ == "__main__":
    create_cancer_tables()
