import os
import glob
import warnings
import re
import csv
from bs4 import BeautifulSoup

# Suppress warnings
warnings.filterwarnings('ignore')

input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
output_file = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv'

# Exclusion keywords
include_keywords = ['수술', '입원', '일당']
exclude_keywords = [
    '암', '연금', '종신', '유병자', '간편', '어린이', '아이', '자녀', '주니어', '태아', 
    '변액', '치아', '운전자', '화재', '실손', '실비', '저축', '사망', '치매', '간병',
    'CEO', 'VIP', 'VVIP', '경영인', '정기', '유니버설', '유니버셜'
]

all_files = glob.glob(os.path.join(input_dir, "*.xls"))
print(f"Found {len(all_files)} .xls files.")

final_rows = []

def clean_text(text):
    if not text: return ""
    return re.sub(r'\s+', ' ', str(text)).strip()

def get_premium_val(val):
    if not val: return 0
    clean = re.sub(r'[^\d]', '', str(val))
    try: return int(clean) if clean else 0
    except: return 0

for file in all_files:
    file_name = os.path.basename(file)
    content = ""
    try:
        for enc in ['utf-8-sig', 'cp949', 'utf-8']:
            try:
                with open(file, 'r', encoding=enc, errors='ignore') as f:
                    content = f.read().strip()
                    if '<table' in content.lower(): break
            except: continue
    except: continue

    if not content or '<table' not in content.lower(): continue

    soup = BeautifulSoup(content, 'html.parser')
    table = soup.find('table')
    if not table: continue

    rows = table.find_all('tr')
    current_product = ""
    current_company = ""
    
    for tr in rows:
        cells = tr.find_all(['td', 'th'])
        if not cells: continue
        
        cell_texts = [clean_text(c.get_text()) for c in cells]
        if len(cell_texts) < 5: continue
        if '보험사' in cell_texts[0] or '상품명' in cell_texts[1]: continue

        if cell_texts[0] and len(cell_texts[0]) > 1: current_company = cell_texts[0]
        if cell_texts[1] and len(cell_texts[1]) > 2: current_product = cell_texts[1]
            
        cov_idx = -1
        male_idx = -1
        female_idx = -1
        for idx, txt in enumerate(cell_texts):
            if any(k in txt for k in include_keywords) and cov_idx == -1: cov_idx = idx
            if '원' in txt and any(d.isdigit() for d in txt):
                if male_idx == -1: male_idx = idx
                elif female_idx == -1: female_idx = idx

        if cov_idx == -1 or male_idx == -1: continue

        product_name = current_product
        coverage_name = cell_texts[cov_idx]
        
        # --- STRICT FILTERING ---
        full_text = (current_company + " " + product_name + " " + coverage_name).replace(" ", "")
        if any(k in full_text for k in exclude_keywords): continue
        if not any(k in coverage_name for k in include_keywords): continue
        
        m_prem = get_premium_val(cell_texts[male_idx])
        f_prem = get_premium_val(cell_texts[female_idx]) if female_idx != -1 else 0
        
        # FINAL CAP: 300,000 KRW (User requested to remove anything over this)
        if m_prem > 300000 or f_prem > 300000: continue
        if m_prem == 0 and f_prem == 0: continue

        out_row = [None] * 31
        for i in range(min(len(cell_texts), 26)):
            out_row[i] = cell_texts[i]
        out_row[0] = current_company
        out_row[1] = current_product
        out_row[26] = file_name
        
        if len(cell_texts) > 26:
            for i in range(26, min(len(cell_texts), 30)):
                out_row[i+1] = cell_texts[i]
        
        final_rows.append(out_row)

# Combine Main + Riders
products_processed = {}
for row in final_rows:
    pname = row[1]
    if pname not in products_processed:
        products_processed[pname] = row
    else:
        base = products_processed[pname]
        m1 = get_premium_val(base[7]) if base[7] else 0
        f1 = get_premium_val(base[8]) if base[8] else 0
        m2 = get_premium_val(row[7]) if row[7] else 0
        f2 = get_premium_val(row[8]) if row[8] else 0
        
        # Keep within 300k even after combining
        if m1 + m2 <= 300000 and f1 + f2 <= 300000:
            base[7] = f"{m1 + m2:,} 원"
            base[8] = f"{f1 + f2:,} 원"
            base[3] = f"{base[3]} + {row[3]}"[:100]

final_combined = list(products_processed.values())

print(f"\nFINAL CLEAN Surgery Extraction: {len(final_combined)} products.")

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([f"Col_{i}" for i in range(26)] + ["source_file"] + [f"Col_{i}" for i in range(26, 30)])
    writer.writerows(final_combined)

print(f"Saved to {output_file}")
