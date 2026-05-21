import os
import re
import requests
import glob
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv('.env.local')
load_dotenv('.env')

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def extract_number(val):
    if not val: return 0
    s = str(val).strip()
    if '%' in s or s == '-': return 0
    match = re.search(r'\d+', s.replace(',', ''))
    if not match: return 0
    return int(match.group())

def ingest_html_file(path):
    try:
        raw = open(path, 'rb').read()
    except: return []
    
    content = None
    for enc in ['cp949', 'utf-8', 'euc-kr', 'utf-16']:
        try:
            decoded = raw.decode(enc)
            if '보험' in decoded or '암' in decoded:
                content = decoded
                break
        except: continue
    
    if not content: content = raw.decode('cp949', errors='ignore')
    try: soup = BeautifulSoup(content, 'html.parser')
    except: return []
    
    data = []
    last_company = ""
    last_product = ""
    
    # EVEN STRONGER Exclusion List
    EXCLUDE_KEYWORDS = [
        '어린이', '아이', '자녀', '태아', '꿈나무', '신생아', '키즈', '건강보험', '질병보험', 
        '상해보험', '종합보험', '든든한', '수술비보험', '간병보험', '민사', '화재',
        '종신', '연금', '저축', '유니버설', '변액', '정기보험', '치아'
    ]

    rows = soup.find_all('tr')
    seen_rows = set()
    
    for row in rows:
        cells = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
        if len(cells) < 8: continue
        
        row_str = "|".join(cells)
        if row_str in seen_rows: continue
        seen_rows.add(row_str)

        c_idx, p_idx, b_idx, a_idx, m_idx, f_idx = 0, 1, 3, 5, 7, 8
        if not cells[0] and len(cells) > 2:
            c_idx, p_idx, b_idx, a_idx, m_idx, f_idx = 1, 2, 4, 6, 8, 9

        comp = cells[c_idx].strip()
        prod = cells[p_idx].strip()
        benefit = cells[b_idx].strip()
        
        if comp and len(comp) > 1 and '남' not in comp: last_company = comp
        if prod and len(prod) > 2 and '선택' not in prod and '보험' in prod: last_product = prod
        
        if not (last_product and last_company): continue
        
        # STRICT CANCER-ONLY FILTER: '암' MUST be in the product name
        if '암' not in last_product: continue
        
        # EXCLUDE Life/Pension/Children/General Health
        if any(word in last_product for word in EXCLUDE_KEYWORDS): continue

        try:
            m_val = extract_number(cells[m_idx])
            f_val = extract_number(cells[f_idx])
            if m_val > 0 or f_val > 0:
                data.append({
                    "company_name": last_company,
                    "product_name": last_product,
                    "benefit_name": benefit,
                    "male": m_val,
                    "female": f_val,
                    "benefit_amount": cells[a_idx].strip()
                })
        except: pass
    return data

def save_to_supabase(all_raw_data):
    if not all_raw_data: return
    
    packages = {}
    for r in all_raw_data:
        key = r['product_name']
        if key not in packages:
            packages[key] = {
                "company_name": r['company_name'],
                "product_name": key,
                "male_total": 0,
                "female_total": 0,
                "benefits": set()
            }
        packages[key]["male_total"] += r['male']
        packages[key]["female_total"] += r['female']
        packages[key]["benefits"].add(r['benefit_name'])

    products_batch = []
    rates_batch = []
    
    for key, pkg in packages.items():
        m_total = pkg['male_total']
        f_total = pkg['female_total']
        
        if m_total > 150000: m_total = round(m_total / 12)
        if f_total > 150000: f_total = round(f_total / 12)
        
        if m_total < 8000 or m_total > 400000: continue 

        p_name = pkg['product_name'][:250]
        products_batch.append({
            "company_name": pkg['company_name'][:95],
            "product_name": p_name,
            "category": "종합암보험"
        })
        
        rates_batch.append({
            "product_name": p_name, "gender": "M", "age": 40, "premium": m_total,
            "benefit_name": "종합 보장 패키지", "benefit_amount": f"{len(pkg['benefits'])}개 담보 합산"
        })
        rates_batch.append({
            "product_name": p_name, "gender": "F", "age": 40, "premium": f_total,
            "benefit_name": "종합 보장 패키지", "benefit_amount": f"{len(pkg['benefits'])}개 담보 합산"
        })

    print(f"[*] Posting {len(products_batch)} Pure Cancer Products (No Life/Pension)...")
    requests.post(f"{SUPABASE_URL}/rest/v1/insurance_cancer_products", headers=HEADERS, json=products_batch)
    
    for i in range(0, len(rates_batch), 100):
        requests.post(f"{SUPABASE_URL}/rest/v1/insurance_cancer_rates", headers=HEADERS, json=rates_batch[i : i + 100])

if __name__ == "__main__":
    url = f"{SUPABASE_URL}/rest/v1"
    requests.delete(f"{url}/insurance_cancer_rates?age=gt.0", headers=HEADERS)
    requests.delete(f"{url}/insurance_cancer_products?company_name=neq.null", headers=HEADERS)
    
    files = glob.glob('scripts/scraper/raw_data/*.xls')
    all_raw = []
    for path in sorted(files):
        all_raw.extend(ingest_html_file(path))
    save_to_supabase(all_raw)
