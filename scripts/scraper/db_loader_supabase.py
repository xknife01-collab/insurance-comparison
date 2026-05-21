import json
import psycopg2
import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

# DATABASE_URL을 직접 파싱하여 특수문자(*) 이슈 해결
DB_URL_RAW = os.getenv("DATABASE_URL")

# 비밀번호에 포함된 * 등 특수문자 처리를 위해 수동으로 연결 문자열 재구성 시도
# postgresql://user:password@host:port/dbname
try:
    # URL에서 비밀번호 부분만 추출하여 인코딩
    prefix, rest = DB_URL_RAW.split("://", 1)
    user_pass, host_db = rest.split("@", 1)
    user, password = user_pass.split(":", 1)
    
    encoded_password = urllib.parse.quote(password)
    DB_URL = f"{prefix}://{user}:{encoded_password}@{host_db}"
except:
    DB_URL = DB_URL_RAW

def setup_db():
    print(f"[*] DB 접속 시도 중...")
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # 테이블 생성
        cur.execute("""
        CREATE TABLE IF NOT EXISTS insurance_products (
            id SERIAL PRIMARY KEY,
            company_name VARCHAR(100),
            product_name VARCHAR(255) UNIQUE,
            category VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        cur.execute("""
        CREATE TABLE IF NOT EXISTS insurance_rates (
            id SERIAL PRIMARY KEY,
            product_name VARCHAR(255),
            rates JSONB,
            coverages JSONB,
            extras JSONB,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(product_name)
        );
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        print("  [+] 테이블 준비 완료!")
    except Exception as e:
        print(f"  [!] DB 접속 실패: {e}")
        return False
    return True

def load_data():
    json_path = "scripts/scraper/unified_products_final.json"
    with open(json_path, "r", encoding="utf-8") as f:
        all_data = json.load(f)
        
    print(f"[*] 총 {len(all_data)}개 상품 데이터 적재 업로드 시작...")
    
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        success_count = 0
        for item in all_data:
            try:
                # 1. Products Upsert
                cur.execute("""
                    INSERT INTO insurance_products (company_name, product_name, category)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (product_name) DO UPDATE SET category = EXCLUDED.category;
                """, (item['company'], item['product_name'], item['category']))
                
                # 2. Rates Upsert
                cur.execute("""
                    INSERT INTO insurance_rates (product_name, rates, coverages, extras)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (product_name) DO UPDATE SET 
                        rates = EXCLUDED.rates, 
                        coverages = EXCLUDED.coverages,
                        extras = EXCLUDED.extras,
                        updated_at = CURRENT_TIMESTAMP;
                """, (item['product_name'], json.dumps(item['rates']), json.dumps(item['coverages']), json.dumps(item['extras'])))
                
                success_count += 1
                if success_count % 100 == 0:
                    print(f"  [+] {success_count}개 업로드 완료...")
            except:
                continue
                
        conn.commit()
        cur.close()
        conn.close()
        print(f"\n[*] 성공! 총 {success_count}개 상품이 전송되었습니다.")
    except Exception as e:
        print(f"  [!] 최종 전송 중 에러: {e}")

if __name__ == "__main__":
    if setup_db():
        load_data()
