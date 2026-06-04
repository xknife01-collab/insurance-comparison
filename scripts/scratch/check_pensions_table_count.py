import os
from supabase import create_client
from dotenv import load_dotenv

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    supabase = create_client(url, key)
    
    try:
        # Check total count of pension_products
        res = supabase.table("pension_products").select("company", count="exact").execute()
        print(f"[+] Total rows in pension_products: {res.count}")
        
        # Check if there are any general savings products (containing '저축' but NOT containing '연금')
        res_savings = supabase.table("pension_products")\
            .select("product_name", count="exact")\
            .ilike("product_name", "%저축%")\
            .not_.ilike("product_name", "%연금%")\
            .execute()
        print(f"[+] General savings products remaining in pension_products: {res_savings.count}")
        
        if res_savings.count > 0:
            print("[*] Sample remaining:")
            for row in res_savings.data[:5]:
                print(f"  - {row['product_name']}")
    except Exception as e:
        print(f"[-] Error querying pension_products: {e}")

if __name__ == "__main__":
    main()
