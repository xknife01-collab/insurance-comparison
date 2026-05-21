import os
import glob
import re
import csv
import json
from bs4 import BeautifulSoup
from supabase import create_client, Client

# Supabase Credentials (from .env.local usually, but I'll assume standard access or mock for demo if needed)
# In real scenario, I would read .env.local
url = ""
key = ""

# Load credentials from .env.local
env_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local'
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            if 'NEXT_PUBLIC_SUPABASE_URL' in line:
                url = line.split('=')[1].strip()
            if 'NEXT_PUBLIC_SUPABASE_ANON_KEY' in line:
                key = line.split('=')[1].strip()

supabase: Client = create_client(url, key)

input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
RATIO = 1.36
MIN_PREMIUM = 18330

exclude_patterns = ['종신', 'CEO', '경영인', 'VVIP', 'VIP', '간편', '유병자', '어린이', '태아', '자녀', '연금', '변액', '운전자', '화재', '실손', '암보험']
include_keywords = ['수술', '입원', '일당']

all_files = glob.glob(os.path.join(input_dir, "*.xls"))

def clean_text(text):
    if not text: return ""
    return re.sub(r'\s+', ' ', str(text)).strip()

def get_premium_val(val):
    if not val: return 0
    clean = re.sub(r'[^\d]', '', str(val))
    try: return int(clean) if clean else 0
    except: return 0

def get_divisor(term_text):
    if not term_text or '1588' in term_text: return 1
    if '일시납' in term_text: return 12
    m = re.search(r'(\d+)\s*년', term_text)
    if m:
        yrs = int(m.group(1))
        if yrs <= 10: return yrs * 12
    return 1

products_dict = {}

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
    rows = table.find_all('tr')
    
    current_company, current_product = "", ""
    file_data = {}
    for tr in rows:
        cells = tr.find_all(['td', 'th'])
        cell_texts = [clean_text(c.get_text()) for c in cells]
        if len(cell_texts) < 10: continue
        if cell_texts[0] and len(cell_texts[0]) > 1: current_company = cell_texts[0]
        if cell_texts[1] and len(cell_texts[1]) > 2: current_product = cell_texts[1]
        
        if not current_product or any(k in current_company+current_product for k in exclude_patterns): continue
        if not any(k in " ".join(cell_texts) for k in include_keywords): continue

        key = (current_company, current_product)
        if key not in file_data: file_data[key] = {'m': 0, 'f': 0}
        file_data[key]['m'] += get_premium_val(cell_texts[7])
        file_data[key]['f'] += get_premium_val(cell_texts[8])

    for (comp, prod), data in file_data.items():
        m_raw = int(data['m'] / divisor)
        f_raw = int(data['f'] / divisor)
        if m_raw > 0 and f_raw == 0: f_raw = int(m_raw * RATIO)
        elif f_raw > 0 and m_raw == 0: m_raw = int(f_raw / RATIO)
        
        if m_raw >= MIN_PREMIUM:
            if (comp, prod) not in products_dict or m_raw > products_dict[(comp, prod)]['male']:
                products_dict[(comp, prod)] = {
                    'company_name': comp,
                    'product_name': prod,
                    'premium_male': m_raw,
                    'premium_female': f_raw,
                    'age': 40
                }

# 1. Clear Supabase
print("Deleting old data from Supabase...")
supabase.table('insurance_surgery_hospital_rates').delete().neq('company_name', '').execute()

# 2. Insert New Data
final_items = list(products_dict.values())
print(f"Inserting {len(final_items)} premium products into Supabase...")

# Insert in chunks of 50 to avoid timeouts
for i in range(0, len(final_items), 50):
    chunk = final_items[i:i+50]
    supabase.table('insurance_surgery_hospital_rates').insert(chunk).execute()

print("DB RELOAD COMPLETE.")
