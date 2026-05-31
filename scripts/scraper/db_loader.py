# -*- coding: utf-8 -*-
import os
import json
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv

# .env 로드 (GOOGLE_API_KEY, DB_URL 등)
load_dotenv()

class InsuranceDBLoader:
    def __init__(self, db_url=None):
        # Supabase의 Connection String을 환경변수에서 가져옵니다.
        self.db_url = db_url or os.environ.get("DATABASE_URL")
        self.conn = None
        
    def connect(self):
        if not self.db_url:
            print("[-] Error: DATABASE_URL is not set in .env")
            return False
        try:
            self.conn = psycopg2.connect(self.db_url)
            return True
        except Exception as e:
            print(f"[-] DB Connection Error: {e}")
            return False

    def load_samsung_fire_rates(self, json_path, product_code="SAMSUNG_FIRE_HEALTH_01"):
        """
        삼성화재 수집 결과(JSON)를 DB에 적재합니다.
        데이터를 [나이, 성별, 직급]별로 묶어서 JSONB에 넣습니다.
        """
        if not os.path.exists(json_path):
            print(f"[-] Error: {json_path} not found.")
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if not self.connect():
            return

        try:
            with self.conn.cursor() as cur:
                # 1. 상품 마스터 정보 먼저 보장 (Upsert)
                # (현장 실무: 삼성화재 간편건강보험 예시)
                cur.execute("""
                    INSERT INTO public.insurance_products 
                    (product_code, company_name, display_name, standard_code, category)
                    VALUES (%s, '삼성화재', '삼성화재 간편건강보험', 'STD_SAMSUNG_01', '건강')
                    ON CONFLICT (product_code) DO UPDATE 
                    SET updated_at = NOW()
                """, (product_code,))

                # 2. 데이터를 [성별, 나이, 직급] 기준으로 그룹화
                # { (male, 40, 1): { "상해": 5000, "질병": 1200 }, ... }
                grouped_rates = {}
                for entry in data:
                    gender_code = 'M' if entry['gender'].lower() in ['male', 'm'] else 'F'
                    key = (gender_code, entry['age'], entry['job_class'])
                    
                    if key not in grouped_rates:
                        grouped_rates[key] = {}
                    
                    # 담보명과 요율 매핑
                    grouped_rates[key][entry['coverage_name']] = entry['rate']

                # 3. DB 적재 (insurance_rates 테이블)
                print(f"[*] Processing {len(grouped_rates)} rate entries for {product_code}...")
                
                for (gender, age, job_class), rate_json in grouped_rates.items():
                    # 동일한 조건이 있으면 rate_data를 업데이트, 없으면 삽입
                    # JSONB 데이터를 다룰 때는 Json() 어댑터 사용
                    cur.execute("""
                        INSERT INTO public.insurance_rates 
                        (product_code, gender, age, job_class, rate_data)
                        VALUES (%s, %s, %s, %s, %s)
                        ON CONFLICT (product_code, gender, age, job_class) 
                        DO UPDATE SET 
                            rate_data = EXCLUDED.rate_data,
                            updated_at = NOW()
                    """, (product_code, gender, age, job_class, Json(rate_json)))

            self.conn.commit()
            print(f"[+] Successfully loaded data into DB for {product_code}!")

        except Exception as e:
            print(f"[-] Data Loading Error: {e}")
            if self.conn:
                self.conn.rollback()
        finally:
            if self.conn:
                self.conn.close()

if __name__ == "__main__":
    # 로컬 테스트용
    loader = InsuranceDBLoader()
    # loader.load_samsung_fire_rates("samsung_fire_rate.json")
    print("DB Loader engine initialized. Waiting for execution command.")
