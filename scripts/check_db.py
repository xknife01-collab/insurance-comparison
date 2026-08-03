import mysql.connector

def check_db():
    try:
        conn = mysql.connector.connect(
            host="127.0.0.1",
            user="root",
            password="",
            database="insurance_db"
        )
        cur = conn.cursor(dictionary=True)

        # 1. 보험 상품 개수 확인
        cur.execute("SELECT COUNT(*) as cnt FROM insurance_products")
        prod_cnt = cur.fetchone()['cnt']
        print(f"[*] Total Products: {prod_cnt}")

        # 2. 보험료 데이터 개수 확인
        cur.execute("SELECT COUNT(*) as cnt FROM insurance_rates")
        rate_cnt = cur.fetchone()['cnt']
        print(f"[*] Total Rate Entries: {rate_cnt}")

        # 3. 샘플 데이터 조회 (최신 5개)
        print("\n[*] Sample Data (insurance_rates):")
        cur.execute("""
            SELECT r.product_code, p.company_name, r.gender, r.age, r.rate_data 
            FROM insurance_rates r
            JOIN insurance_products p ON r.product_code = p.product_code
            ORDER BY r.created_at DESC 
            LIMIT 5
        """)
        samples = cur.fetchall()
        for s in samples:
            print(f"- {s['company_name']} ({s['product_code']}): {s['gender']}, {s['age']}세, Data: {s['rate_data']}")

        conn.close()
    except Exception as e:
        print(f"[-] DB Connection/Query Error: {e}")

if __name__ == "__main__":
    check_db()
