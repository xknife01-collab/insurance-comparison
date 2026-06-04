import os
from supabase import create_client
from dotenv import load_dotenv

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    supabase = create_client(url, key)
    
    # Query pension_products that are pension products (contains '연금')
    res = supabase.table("pension_products")\
        .select("company, product_name")\
        .ilike("product_name", "%연금%")\
        .execute()
        
    pensions = res.data
    print(f"Total pension products remaining in pension_products table: {len(pensions)}")
    
    # Show first 5
    unique_pensions = sorted(list(set([p['product_name'] for p in pensions])))
    print("Example remaining pension products:")
    for p in unique_pensions[:5]:
        print(f"  - {p}")

if __name__ == "__main__":
    main()
