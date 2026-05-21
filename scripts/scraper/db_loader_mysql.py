# -*- coding: utf-8 -*-
import os
import json
import uuid
import mysql.connector
from dotenv import load_dotenv

# .env 로드
load_dotenv()

class MySQLLoader:
    def __init__(self):
        self.host = "127.0.0.1"
        self.user = "root"
        self.password = "" # 공란으로 시도 (비밀번호 있을 시 수정)
        self.db_name = "insurance_db"
        self.conn = None

    def setup_db(self):
        """
        데이터베이스 및 테이블을 자동으로 생성합니다.
        """
        try:
            # 1. 초기 연결 (DB 생성용)
            self.conn = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password
            )
            cur = self.conn.cursor()
            print(f"[*] Creating Database: {self.db_name}")
            cur.execute(f"CREATE DATABASE IF NOT EXISTS {self.db_name}")
            cur.execute(f"USE {self.db_name}")

            # 2. 테이블 생성 (schema_mysql.sql 기반)
            print("[*] Creating Tables: insurance_products, insurance_rates")
            cur.execute("""
                CREATE TABLE IF NOT EXISTS insurance_products (
                    id VARCHAR(36) PRIMARY KEY,
                    product_code VARCHAR(50) UNIQUE NOT NULL,
                    company_name VARCHAR(100) NOT NULL,
                    display_name VARCHAR(200),
                    standard_code VARCHAR(50) NOT NULL,
                    category VARCHAR(50),
                    is_renewable BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS insurance_rates (
                    id VARCHAR(36) PRIMARY KEY,
                    product_code VARCHAR(50) NOT NULL,
                    gender CHAR(1) NOT NULL,
                    age INTEGER NOT NULL,
                    job_class INTEGER DEFAULT 1,
                    rate_data JSON NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (product_code) REFERENCES insurance_products (product_code) ON DELETE CASCADE,
                    UNIQUE KEY (product_code, gender, age, job_class)
                )
            """)
            self.conn.commit()
            print("[+] DB Setup Completed!")
            return True
        except Exception as e:
            print(f"[-] DB Setup Error: {e}")
            return False

    def load_rates(self, json_path, product_code="SAMSUNG_FIRE_01"):
        """
        JSON 데이터를 MySQL/MariaDB에 적재합니다.
        """
        if not os.path.exists(json_path):
            print(f"[-] Error: {json_path} not found.")
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        try:
            cur = self.conn.cursor()
            # 1. 상품 등록
            cur.execute("""
                INSERT IGNORE INTO insurance_products 
                (id, product_code, company_name, display_name, standard_code, category)
                VALUES (%s, %s, '삼성화재', '삼성화재 간편건강보험', 'STD_SAMSUNG_01', '건강')
            """, (str(uuid.uuid4()), product_code))

            # 2. 그룹화 (나이/성별/직급별)
            grouped = {}
            for entry in data:
                gender = 'M' if entry['gender'].lower().startswith('m') else 'F'
                key = (gender, entry['age'], entry['job_class'])
                if key not in grouped: grouped[key] = {}
                grouped[key][entry['coverage_name']] = entry['rate']

            # 3. 데이터 적재 (UPSERT)
            print(f"[*] Loading {len(grouped)} rate entries into MariaDB...")
            for (gender, age, job), rates in grouped.items():
                rate_json = json.dumps(rates, ensure_ascii=False)
                cur.execute("""
                    INSERT INTO insurance_rates (id, product_code, gender, age, job_class, rate_data)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE 
                        rate_data = VALUES(rate_data), 
                        updated_at = NOW()
                """, (str(uuid.uuid4()), product_code, gender, age, job, rate_json))

            self.conn.commit()
            print(f"[OK] Successfully Data Loaded! Check your HeidiSQL (insurance_db).")

        except Exception as e:
            print(f"[-] Data Loading Error: {e}")
            self.conn.rollback()

if __name__ == "__main__":
    loader = MySQLLoader()
    if loader.setup_db():
        loader.load_rates("samsung_fire_rate.json")
