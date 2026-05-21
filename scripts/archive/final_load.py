# -*- coding: utf-8 -*-
import os
import json
import psycopg2
from dotenv import load_dotenv

# .env 로드
load_dotenv()

def ultimate_db_load():
    # 데이터베이스 이름을 프로젝트 ID로 설정해보는 두 번째 변칙
    config = {
        "host": "aws-0-ap-southeast-1.pooler.supabase.com",
        "port": 5432,
        "user": "postgres.wfkxwztxpugakusynhpx", # 이 사용자 이름이 안되면 그냥 postgres
        "password": "rlaghddlf0411*", 
        "database": "postgres", # 혹은 wfkxwztxpugakusynhpx
        "sslmode": "require"
    }
    
    # 전략 A: 사용자 이름에 프로젝트 ID 포함 (이미 시도했지만 다시 정밀하게)
    # 전략 B: 사용자 이름=postgres, 데이터베이스=프로젝트 ID (새로운 시도)
    
    print(f"[*] Trying Connection with Project Ref in Username...")
    try:
        conn = psycopg2.connect(**config)
        cur = conn.cursor()
        print("[✔] CONNECTED!")
        
        # ... 이하 동일 로직 ...
        schema_path = os.path.join(os.getcwd(), "db", "schema.sql")
        with open(schema_path, "r", encoding="utf-8") as f:
            schema_content = f.read()
        cur.execute(schema_content)
        
        prod_code = "SAMSUNG_FIRE_HEALTH_01"
        cur.execute("""
            INSERT INTO public.insurance_products 
            (product_code, company_name, display_name, standard_code, category)
            VALUES (%s, '삼성화재', '삼성화재 간편건강보험', 'STD_SAMSUNG_01', '건강')
            ON CONFLICT (product_code) DO NOTHING
        """, (prod_code,))

        json_path = os.path.join(os.getcwd(), "samsung_fire_rate.json")
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            grouped = {}
            for entry in data:
                gender = 'M' if entry['gender'].lower().startswith('m') else 'F'
                key = (gender, entry['age'], entry['job_class'])
                if key not in grouped: grouped[key] = {}
                grouped[key][entry['coverage_name']] = entry['rate']
            for (gender, age, job), rates in grouped.items():
                cur.execute("""
                    INSERT INTO public.insurance_rates 
                    (product_code, gender, age, job_class, rate_data)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (product_code, gender, age, job_class) 
                    DO UPDATE SET rate_data = EXCLUDED.rate_data, updated_at = NOW()
                """, (prod_code, gender, age, job, json.dumps(rates, ensure_ascii=False)))

        conn.commit()
        print("[✔] MISSION ACCOMPLISHED!")
        cur.close()
        conn.close()

    except Exception as e:
        print(f"[-] MISSION FAILED: {e}")
        # 전략 B 시도
        print("[*] Trying Strategy B (Database Name as Project ID)...")
        try:
            config["user"] = "postgres"
            config["database"] = "wfkxwztxpugakusynhpx"
            conn = psycopg2.connect(**config)
            print("[✔] STRATEGY B CONNECTED!")
            # ... 동일하게 적재 ...
        except Exception as e2:
            print(f"[-] STRATEGY B FAILED: {e2}")

if __name__ == "__main__":
    ultimate_db_load()
