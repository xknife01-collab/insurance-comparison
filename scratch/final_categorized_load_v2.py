import os
import glob
import re
from bs4 import BeautifulSoup
from supabase import create_client, Client

# Supabase Credentials
url, key = "", ""
env_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local'
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            if 'VITE_SUPABASE_URL' in line: url = line.split('=')[1].strip()
            if 'SUPABASE_SERVICE_ROLE_KEY' in line: key = line.split('=')[1].strip()
            elif 'VITE_SUPABASE_ANON_KEY' in line and not key: key = line.split('=')[1].strip()

supabase: Client = create_client(url, key)

input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
RATIO = 1.36
MIN_PREMIUM = 18330

CATEGORIES = {
    'cat_1_5': ['1-5종', '종수술', '1~5종'],
    'cat_n_disease': ['N대', '대질병', '71대', '144대', '112대', '특정질병', '질병수술'],
    'cat_injury': ['상해', '재해'],
    'cat_hospital': ['입원', '일당'],
    'cat_caregiver': ['간병인', '지원', '사용']
}

exclude_patterns = ['종신', 'CEO', '경영인', '어린이', '태아', '자녀', '유병자', '간편', '325', '335', '355', '암보험', 'CI보험']

def clean_text(text):
    return re.sub(r'\s+', ' ', str(text)).strip() if text else ""

def get_premium_val(val):
    clean = re.sub(r'[^\d]', '', str(val))
    return int(clean) if clean else 0

def get_divisor(term_text):
    if not term_text or '1588' in term_text: return 1
    if '일시납' in term_text: return 12
    m = re.search(r'(\d+)\s*년', term_text)
    if m:
        yrs = int(m.group(1))
        if yrs <= 10: return yrs * 12
    return 1

products_dict = {}
all_files = glob.glob(os.path.join(input_dir, "*.xls"))

for file in all_files:
    content = ""
    for enc in ['utf-8', 'utf-8-sig', 'cp949', 'euc-kr']:
        try:
            with open(file, 'r', encoding=enc) as f:
                temp = f.read(); content = temp; break
        except: continue
    if not content: continue
    
    soup = BeautifulSoup(content, 'html.parser')
    term_text = ""
    for tr in soup.find_all('tr'):
        cells = [clean_text(c.get_text()) for c in tr.find_all(['td', 'th'])]
        for i, c in enumerate(cells):
            if '납입' in c and '기간' in c and i+1 < len(cells):
                term_text = cells[i+1]; break
        if term_text: break
    
    divisor = get_divisor(term_text)
    table = soup.find('table')
    if not table: continue
    
    current_company, current_product = "", ""
    file_data = {} 
    
    for tr in table.find_all('tr'):
        cells = tr.find_all(['td', 'th'])
        cell_texts = [clean_text(c.get_text()) for c in cells]
        if len(cell_texts) < 10: continue
        
        if cell_texts[0] and len(cell_texts[0]) > 1: current_company = cell_texts[0]
        if cell_texts[1] and len(cell_texts[1]) > 2: current_product = cell_texts[1]
        
        if not current_product or any(k in current_company+current_product for k in exclude_patterns): continue
        
        rider_name = " ".join(cell_texts[2:6])
        target_cat = 'cat_other'
        for cat, keys in CATEGORIES.items():
            if any(k in rider_name for k in keys):
                target_cat = cat
                break
        
        if target_cat == 'cat_other' and not any(k in rider_name for k in ['수술', '입원', '일당']): continue

        key = (current_company, current_product)
        if key not in file_data:
            file_data[key] = {c: {'m': 0, 'f': 0} for c in list(CATEGORIES.keys()) + ['cat_other']}
        
        file_data[key][target_cat]['m'] += get_premium_val(cell_texts[7])
        file_data[key][target_cat]['f'] += get_premium_val(cell_texts[8])

    for (comp, prod), cats in file_data.items():
        total_m_val = sum(c['m'] for c in cats.values()) / divisor
        if total_m_val < MIN_PREMIUM: continue
        
        processed_data = {
            'company_name': comp,
            'product_name': prod,
            'premium_male': int(total_m_val),
            'premium_female': int(total_m_val * RATIO),
            'age': 40
        }
        
        for c_name, c_data in cats.items():
            if c_name == 'cat_other': continue
            m_norm = int(c_data['m'] / divisor)
            f_norm = int(c_data['f'] / divisor)
            if m_norm > 0 and f_norm == 0: f_norm = int(m_norm * RATIO)
            elif f_norm > 0 and m_norm == 0: m_norm = int(f_norm / RATIO)
            
            processed_data[c_name + '_m'] = m_norm
            processed_data[c_name + '_f'] = f_norm

        final_key = (comp, prod)
        if final_key not in products_dict or total_m_val > products_dict[final_key]['premium_male']:
            products_dict[final_key] = processed_data

final_items = list(products_dict.values())
print(f"Uploading {len(final_items)} products with 5-category premiums to Supabase...")
supabase.table('insurance_surgery_hospital_rates').delete().neq('company_name', '').execute()

for i in range(0, len(final_items), 50):
    supabase.table('insurance_surgery_hospital_rates').insert(final_items[i:i+50]).execute()

print("FINAL SUCCESS: CATEGORIZED DB RELOAD COMPLETE.")
