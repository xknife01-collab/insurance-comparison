import os
from supabase import create_client
from dotenv import load_dotenv

FIRE_PRODUCTS = [
  { 'company': '메리츠화재', 'productName': '(무) 메리츠 우리집보험 M-House2601', 'basePremium': 733 },
  { 'company': '한화손보', 'productName': '한화 다이렉트 119주택화재보험 (무)2601', 'basePremium': 581 },
  { 'company': '삼성화재', 'productName': '무배당 삼성화재 다이렉트 주택화재종합보험(2601.15)', 'basePremium': 3701 },
  { 'company': '현대해상', 'productName': '(무)현대해상다이렉트H주택화재상해보험(Hi2601)', 'basePremium': 299 },
  { 'company': 'KB손보', 'productName': 'KB 다이렉트 주택화재보험(무배당)(26.01)', 'basePremium': 640 },
  { 'company': '하나손보', 'productName': '무배당 하나더퍼스트 화재보험(2601)', 'basePremium': 762 },
  { 'company': '에이스손보(라이나)', 'productName': '(무)우리집 무사고 할인보험2404 1종(순수보장형)', 'basePremium': 13280 },
  { 'company': '신한EZ손보', 'productName': '신한 이지로운 주택화재보험(무배당)', 'basePremium': 1255 },
  { 'company': '농협손보', 'productName': '(무) My리치하우스가정종합보험2601', 'basePremium': 1109 },
]

def simulate():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    supabase = create_client(url, key)
    res = supabase.table('insurance_fire_rates').select('company_name, product_name, base_premium').execute()
    db_rates = res.data
    
    dbBasePremiums = {}
    for row in db_rates:
        prod_name = row.get('product_name')
        comp_name = row.get('company_name')
        bp = row.get('base_premium')
        if prod_name and bp:
            dbBasePremiums[prod_name.strip()] = int(bp)
        if comp_name and bp:
            dbBasePremiums[comp_name.strip()] = int(bp)
            
    print("=== Matching simulation ===")
    for p in FIRE_PRODUCTS:
        prod_name_clean = p['productName'].strip()
        comp_name_clean = p['company'].strip()
        
        match_by_prod = dbBasePremiums.get(prod_name_clean)
        match_by_comp = dbBasePremiums.get(comp_name_clean)
        fallback = p['basePremium']
        
        resolved = match_by_prod or match_by_comp or fallback
        source = "productName" if match_by_prod else ("company" if match_by_comp else "fallback")
        
        print(f"Company: {comp_name_clean:<12} | Prod: {prod_name_clean:<35} | Resolved: {resolved:<6} | Source: {source}")

if __name__ == "__main__":
    simulate()
