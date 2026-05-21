
import mysql.connector
import os

try:
    conn = mysql.connector.connect(
        host='127.0.0.1',
        user='root',
        password='',
        database='insurance_db'
    )
    cur = conn.cursor()
    
    # 외래 키 제약 조건 잠시 해제 후 TRUNCATE (데이터 완전히 비우기)
    cur.execute("SET FOREIGN_KEY_CHECKS = 0")
    cur.execute("TRUNCATE TABLE insurance_rates")
    cur.execute("TRUNCATE TABLE insurance_products")
    cur.execute("SET FOREIGN_KEY_CHECKS = 1")
    
    conn.commit()
    print("[OK] All tables in 'insurance_db' have been truncated.")
    cur.close()
    conn.close()
except Exception as e:
    print(f"[-] Database Error: {e}")
