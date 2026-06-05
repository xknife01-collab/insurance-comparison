import os
import json
from supabase import create_client
from dotenv import load_dotenv

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    supabase = create_client(url, key)
    
    # Query all products from pension_products
    # pension_products table has company, product_name, interest_rate, channel, features etc.
    try:
        res = supabase.table("pension_products").select("company, product_name, interest_rate, channel, features").execute()
        data = res.data
        print(f"Total rows retrieved: {len(data)}")
        
        # Group by company and product_name
        unique_products = {}
        for row in data:
            key = (row['company'], row['product_name'])
            if key not in unique_products:
                unique_products[key] = {
                    'interest_rate': row.get('interest_rate'),
                    'channel': row.get('channel'),
                    'features': row.get('features'),
                    'count': 1
                }
            else:
                unique_products[key]['count'] += 1
                
        # Write to a file with UTF-8 encoding
        with open("scratch/pension_db_dump.txt", "w", encoding="utf-8") as f:
            f.write(f"Total unique products: {len(unique_products)}\n\n")
            for (company, p_name), info in sorted(unique_products.items()):
                f.write(f"Company: {company} | Product: {p_name} | Rate: {info['interest_rate']} | Channel: {info['channel']} | Features: {info['features']} | Count: {info['count']}\n")
                
        print("Successfully wrote pension_db_dump.txt")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    main()
