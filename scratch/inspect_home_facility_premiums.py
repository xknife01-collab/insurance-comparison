import os
from supabase import create_client
from dotenv import load_dotenv

def run():
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Key missing")
        return
        
    supabase = create_client(url, key)
    res = supabase.table('insurance_home_facility_rates').select('*').execute()
    data = res.data
    
    out_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\db_rates_output.txt'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(f"Total rows in insurance_home_facility_rates: {len(data)}\n")
        
        companies = {}
        for row in data:
            co = row['company_name']
            prod = row['product_name']
            div = row['division']
            cov = row['benefit_name']
            pm = row['premium_male']
            pf = row['premium_female']
            pay_type = row['payment_type']
            
            if co not in companies:
                companies[co] = []
            companies[co].append((prod, div, cov, pm, pf, pay_type))
            
        for co, rows in companies.items():
            f.write(f"\n★ Company: {co} ({len(rows)} rows)\n")
            rows_sorted = sorted(rows, key=lambda x: max(x[3], x[4]), reverse=True)
            for r in rows_sorted[:10]:
                f.write(f"  Prod: {r[0]} | Div: {r[1]} | Cov: {r[2]} | Male: {r[3]:,}원 | Female: {r[4]:,}원 | PayType: {r[5]}\n")

if __name__ == '__main__':
    run()
