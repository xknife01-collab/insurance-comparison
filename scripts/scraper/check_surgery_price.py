import sys, os, requests
sys.stdout.reconfigure(encoding='utf-8')
from dotenv import load_dotenv
load_dotenv('.env'); load_dotenv('.env.local')
URL = os.getenv('VITE_SUPABASE_URL')
KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
h = {'apikey': KEY, 'Authorization': f'Bearer {KEY}'}

r = requests.get(f'{URL}/rest/v1/insurance_surgery_hospital_rates?gender=eq.M&age=eq.40&select=company_name,product_name,rider_name,premium&order=premium.asc', headers=h)
data = r.json()

# 상품별 합산
from collections import defaultdict
prod_map = defaultdict(lambda: {'company':'', 'riders':[], 'total':0})
for d in data:
    key = d['product_name']
    prod_map[key]['company'] = d['company_name']
    prod_map[key]['total'] += d['premium']
    prod_map[key]['riders'].append(d['rider_name'][:30])

print(f'40세 남자 수술/입원 보험 - 상품별 합산 보험료:')
print(f"{'회사':<12} {'합산보험료':>10} {'담보수':>5}  상품명")
print('-'*80)
for prod, info in sorted(prod_map.items(), key=lambda x: x[1]['total']):
    print(f"{info['company']:<12} {info['total']:>10,}원 {len(info['riders']):>5}건  {prod[:45]}")
