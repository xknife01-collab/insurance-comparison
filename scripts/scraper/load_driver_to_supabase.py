import os
import pandas as pd
import json
import psycopg2
import urllib.parse
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env.local")
load_dotenv(".env")

DB_HOST = "db.wfkxwztxpugakusynhpx.supabase.co"
DB_USER = "postgres"
DB_PASSWORD = "rlaghddlf0411*"
DB_PORT = 5432
DB_NAME = "postgres"

def get_connection():
    return psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT,
        database=DB_NAME
    )

def setup_supabase_tables():
    print("[*] Creating Driver's Insurance tables and setting up RLS in Supabase...")
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # 1. Create Tables
        cur.execute("""
        CREATE TABLE IF NOT EXISTS driver_insurance_products (
            id SERIAL PRIMARY KEY,
            company_name VARCHAR(100) NOT NULL,
            product_name VARCHAR(255) UNIQUE NOT NULL,
            category VARCHAR(50) DEFAULT 'driver',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        cur.execute("""
        CREATE TABLE IF NOT EXISTS driver_insurance_rates (
            id SERIAL PRIMARY KEY,
            product_name VARCHAR(255) NOT NULL,
            plan_level VARCHAR(50) NOT NULL,
            gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
            age INT NOT NULL,
            premium INT NOT NULL,
            coverage_limit_traffic_accident VARCHAR(100),
            coverage_limit_lawyer VARCHAR(100),
            coverage_limit_fine VARCHAR(100),
            details JSONB,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_driver_rates_query 
        ON driver_insurance_rates (plan_level, gender, age);
        """)
        
        # 2. Enable RLS
        cur.execute("ALTER TABLE driver_insurance_products ENABLE ROW LEVEL SECURITY;")
        cur.execute("ALTER TABLE driver_insurance_rates ENABLE ROW LEVEL SECURITY;")
        
        # 3. Create SELECT policies (drop first to prevent duplicate errors)
        cur.execute("DROP POLICY IF EXISTS \"Allow public read access on products\" ON driver_insurance_products;")
        cur.execute("""
        CREATE POLICY "Allow public read access on products" 
        ON driver_insurance_products 
        FOR SELECT 
        TO public 
        USING (true);
        """)
        
        cur.execute("DROP POLICY IF EXISTS \"Allow public read access on rates\" ON driver_insurance_rates;")
        cur.execute("""
        CREATE POLICY "Allow public read access on rates" 
        ON driver_insurance_rates 
        FOR SELECT 
        TO public 
        USING (true);
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        print("  [+] Supabase tables and RLS policy setup completed successfully!")
        return True
    except Exception as e:
        print(f"  [!] Failed to setup Supabase tables: {e}")
        return False

def load_driver_data():
    csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.csv'
    df = pd.read_csv(csv_path, encoding='utf-8-sig')
    
    # Filter for rows that have at least one premium
    df['기준보험료_num'] = pd.to_numeric(df['기준보험료'], errors='coerce')
    df['가입보험료_num'] = pd.to_numeric(df['가입보험료'], errors='coerce')
    df = df[df['기준보험료_num'].notna() | df['가입보험료_num'].notna()].copy()
    
    # Unique product quotes
    products_map = {}
    for idx, row in df.iterrows():
        comp = str(row.get('보험회사', '')).strip()
        prod = str(row.get('상품명', '')).strip()
        
        if not comp or comp == 'nan':
            continue
        if not prod or prod == 'nan':
            continue
            
        key = (comp, prod)
        
        raw_m = row.get('기준보험료_num')
        raw_f = row.get('가입보험료_num')
        
        m_val = int(raw_m) if pd.notna(raw_m) else None
        f_val = int(raw_f) if pd.notna(raw_f) else None
        
        if m_val is None and f_val is not None:
            m_val = f_val
        if f_val is None and m_val is not None:
            f_val = m_val
        if m_val is None and f_val is None:
            continue
            
        # Keep the minimum premium if there are multiple rows for the same product
        if key not in products_map:
            products_map[key] = {'male': m_val, 'female': f_val}
        else:
            products_map[key]['male'] = min(products_map[key]['male'], m_val)
            products_map[key]['female'] = min(products_map[key]['female'], f_val)
            
    print(f"[*] Found {len(products_map)} unique driver insurance products to load.")
    
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Clear existing data first to ensure clean state
        cur.execute("TRUNCATE TABLE driver_insurance_rates RESTART IDENTITY;")
        cur.execute("TRUNCATE TABLE driver_insurance_products CASCADE;")
        
        success_products = 0
        success_rates = 0
        
        for (comp, prod), prems in products_map.items():
            # 1. Insert into driver_insurance_products
            try:
                cur.execute("""
                    INSERT INTO driver_insurance_products (company_name, product_name, category)
                    VALUES (%s, %s, 'driver')
                    ON CONFLICT (product_name) DO NOTHING;
                """, (comp, prod))
                success_products += 1
            except Exception as e:
                print(f"    [!] Error inserting product {prod}: {e}")
                conn.rollback()
                continue
                
            # 2. Insert rates for Male & Female across three Plan Levels
            # Base premiums
            base_m = prems['male']
            base_f = prems['female']
            
            plans = [
                {
                    'level': '실속형',
                    'add_prem': 6000,
                    'min_prem': 9900,
                    'traffic': '1억 원',
                    'lawyer': '3,000만 원',
                    'fine': '대인 2,000만 원',
                    'details': {'자부상': '미탑재', '교통사고처리지원금': '1억 원 한도', '변호사선임비용': '3,000만 원 한도', '벌금': '대인 2,000만 원 한도'}
                },
                {
                    'level': '표준형',
                    'add_prem': 11000,
                    'min_prem': 15000,
                    'traffic': '1.5억 원',
                    'lawyer': '5,000만 원',
                    'fine': '대인 3,000만 원',
                    'details': {'자부상': '14급 기준 10만 원', '교통사고처리지원금': '1.5억 원 한도', '변호사선임비용': '5,000만 원 한도', '벌금': '대인 3,000만 원 한도'}
                },
                {
                    'level': 'VIP안심형',
                    'add_prem': 21000,
                    'min_prem': 25000,
                    'traffic': '2억 원',
                    'lawyer': '5,000만 원 (경찰조사 선지원 포함)',
                    'fine': '대인 3,000만 / 대물 500만 원',
                    'details': {'자부상': '14급 기준 30만 원', '교통사고처리지원금': '2억 원 한도', '변호사선임비용': '5,000만 원 한도 (경찰조사 선지원 포함)', '벌금': '대인 3,000만 / 대물 500만 원 한도'}
                }
            ]
            
            # Default age is 40 (since raw comparative standard is 40 years old)
            for plan in plans:
                # Calculate premiums
                prem_m = max(base_m + plan['add_prem'], plan['min_prem'])
                prem_f = max(base_f + plan['add_prem'], plan['min_prem'])
                
                # Insert Male
                try:
                    cur.execute("""
                        INSERT INTO driver_insurance_rates 
                        (product_name, plan_level, gender, age, premium, coverage_limit_traffic_accident, coverage_limit_lawyer, coverage_limit_fine, details)
                        VALUES (%s, %s, 'M', 40, %s, %s, %s, %s, %s);
                    """, (prod, plan['level'], prem_m, plan['traffic'], plan['lawyer'], plan['fine'], json.dumps(plan['details'])))
                    success_rates += 1
                except Exception as e:
                    print(f"    [!] Error inserting Male rate for {prod} ({plan['level']}): {e}")
                    conn.rollback()
                    continue
                    
                # Insert Female
                try:
                    cur.execute("""
                        INSERT INTO driver_insurance_rates 
                        (product_name, plan_level, gender, age, premium, coverage_limit_traffic_accident, coverage_limit_lawyer, coverage_limit_fine, details)
                        VALUES (%s, %s, 'F', 40, %s, %s, %s, %s, %s);
                    """, (prod, plan['level'], prem_f, plan['traffic'], plan['lawyer'], plan['fine'], json.dumps(plan['details'])))
                    success_rates += 1
                except Exception as e:
                    print(f"    [!] Error inserting Female rate for {prod} ({plan['level']}): {e}")
                    conn.rollback()
                    continue
                    
        conn.commit()
        cur.close()
        conn.close()
        print(f"\n[+] SUCCESS: Loaded {success_products} products and {success_rates} rates into Supabase!")
    except Exception as e:
        print(f"  [!] Database load failed: {e}")

if __name__ == "__main__":
    if setup_supabase_tables():
        load_driver_data()
