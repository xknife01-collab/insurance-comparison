import os
from supabase import create_client
from dotenv import load_dotenv

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Service Role Key missing in env files")
        return
        
    supabase = create_client(url, key)
    
    # Query pension_products that match general savings
    res = supabase.table("pension_products")\
        .select("company, product_name")\
        .ilike("product_name", "%저축%")\
        .not_.ilike("product_name", "%연금%")\
        .execute()
        
    products = res.data
    print(f"Total rows fetched matching general savings: {len(products)}")
    
    unique_products = set()
    for p in products:
        unique_products.add((p['company'], p['product_name']))
        
    print(f"Unique products count: {len(unique_products)}")
    print("List of unique general savings products in database:")
    for co, prod in sorted(list(unique_products)):
        print(f"  - {co} | {prod}")

if __name__ == "__main__":
    main()
