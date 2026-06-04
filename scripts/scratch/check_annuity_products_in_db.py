import os
from supabase import create_client
from dotenv import load_dotenv

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    supabase = create_client(url, key)
    
    # Search for products containing 한화 e연금, 삼성화재 다이렉트, 현대해상다이렉트
    for name in ["한화", "삼성화재", "현대해상"]:
        try:
            res = supabase.table("pension_products")\
                .select("company, product_name")\
                .ilike("product_name", f"%{name}%")\
                .limit(5)\
                .execute()
            print(f"[+] Search result for '{name}':")
            for row in res.data:
                print(f"  - Company: {row['company']} | Product: {row['product_name']}")
        except Exception as e:
            print(f"[-] Error searching for '{name}': {e}")

if __name__ == "__main__":
    main()
