import mysql.connector
import json

db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '',
    'database': 'insurance_db'
}

def verify():
    try:
        conn = mysql.connector.connect(**db_config)
        cur = conn.cursor(dictionary=True)
        
        print("\n--- [Products Table] ---")
        cur.execute("SELECT * FROM insurance_products")
        for row in cur.fetchall():
            print(row)
            
        print("\n--- [Rates Table] ---")
        cur.execute("SELECT * FROM insurance_rates")
        for row in cur.fetchall():
            print(row)
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify()
