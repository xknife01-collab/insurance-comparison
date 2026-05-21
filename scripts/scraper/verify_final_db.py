import os
from supabase import create_client, Client
from dotenv import load_dotenv

# .env.local 파일 로드
load_dotenv(".env.local")

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY")

def verify_db():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("[-] Supabase URL or Key not found in .env.local")
        return

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # 50세 남성 실손 보험료 확인
    print("[*] Checking Rates for Age 50 Male (Silson)...")
    res = supabase.table("insurance_rates") \
        .select("product_code, gender, age, rate_data") \
        .eq("gender", "M") \
        .eq("age", 50) \
        .limit(10) \
        .execute()
    
    if res.data:
        print("\n--- DB CONTENT REPORT (AGE 50 MALE) ---")
        for idx, row in enumerate(res.data):
            pcode = row['product_code']
            rate = row['rate_data']
            # product_code에서 실손 여부 확인 (대략적으로)
            print(f"[{idx+1}] Product: {pcode} | Value: {rate.get('premium') or list(rate.values())[0]}")
    else:
        print("[-] No data found for specified criteria.")

if __name__ == "__main__":
    verify_db()
