import csv
import re
import psycopg2
import sys
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 직접 DB 호스트로 접속 시도
DB_CONFIG = {
    "host": "db.wfkxwztxpugakusynhpx.supabase.co",
    "user": "postgres",
    "password": "rlaghddlf0411*",
    "port": 5432,
    "database": "postgres"
}

CSV_FILE = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\extracted_data.csv'

def clean_price(p):
    if not p: return 0
    match = re.search(r'([\d,]+)', p)
    if match:
        return int(match.group(1).replace(',', ''))
    return 0

def load_data():
    print("[*] 뇌혈관 보험 데이터 적재 시작 (Direct Host 사용)...")
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # CSV 읽기
        with open(CSV_FILE, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            
            for row in reader:
                product_name = (row.get('상품명', '') or '').strip()
                coverage_name = (row.get('담보명(급부명)', '') or '').strip()
                reason = (row.get('지급사유', '') or '').strip()
                amount = (row.get('지급금액', '') or '').strip()
                premium_val = (row.get('가입금액', '') or '').strip()
                
                if '뇌혈관' not in (product_name + coverage_name + reason):
                    continue
                
                if '1,000' not in reason and '1000' not in reason:
                    continue
                    
                p1 = clean_price(amount)
                p2 = clean_price(premium_val)
                male_premium = p2 if p2 > 0 else p1
                
                if male_premium < 4000:
                    continue
                
                if product_name == coverage_name or not product_name:
                    display_name = coverage_name
                elif not coverage_name:
                    display_name = product_name
                else:
                    if coverage_name in product_name:
                        display_name = product_name
                    elif product_name in coverage_name:
                        display_name = coverage_name
                    else:
                        display_name = f"{product_name} [{coverage_name}]"

                # 1. 상품 테이블 삽입
                cur.execute("""
                    INSERT INTO brain_insurance_products (product_name, company_name, category)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (product_name) DO NOTHING
                """, (display_name, "국내주요보험사", "뇌혈관"))

                # 2. 남성 데이터 삽입
                cur.execute("""
                    INSERT INTO brain_insurance_rates (product_name, gender, age, premium, benefit_name, benefit_amount)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (display_name, 'M', 40, male_premium, coverage_name, reason))

                # 3. 여성 데이터 삽입 (0.85 비율)
                female_premium = int(male_premium * 0.85)
                cur.execute("""
                    INSERT INTO brain_insurance_rates (product_name, gender, age, premium, benefit_name, benefit_amount)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (display_name, 'F', 40, female_premium, coverage_name, reason))
                
                count += 1
                if count % 10 == 0:
                    print(f"  [+] {count}개 상품 적재 중...")

        conn.commit()
        cur.close()
        conn.close()
        print(f"[*] 총 {count}개의 상품(남/녀 총 {count*2}건) 적재 완료!")
        
    except Exception as e:
        print(f"[!] 적재 실패: {e}")

if __name__ == "__main__":
    load_data()
