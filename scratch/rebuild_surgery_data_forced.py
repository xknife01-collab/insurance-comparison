import os
import glob
import warnings
import re
import csv
from bs4 import BeautifulSoup

# Suppress warnings
warnings.filtervectors = [] # Ignore
warnings.filterwarnings('ignore')

input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
output_file = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv'

# Keywords
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
    for enc in ['cp949', 'utf-8-sig', 'utf-8', 'euc-kr']:
        try:
            with open(file, 'r', encoding=enc) as f:
                temp = f.read()
                if '보험' in temp or '상품' in temp:
                    content = temp.strip()
                    break
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
        
        if cell_texts[0] and len(cell_texts[0]) > 1 and '보험사' not in cell_texts[0]: current_company = cell_texts[0]
        if cell_texts[1] and len(cell_texts[1]) > 2 and '상품명' not in cell_texts[1]: current_product = cell_texts[1]
            
        cov_idx, male_idx, female_idx = -1, -1, -1
        for idx, txt in enumerate(cell_texts):
            if any(k in txt for k in include_keywords) and cov_idx == -1: cov_idx = idx
            if '원' in txt and any(d.isdigit() for d in txt):
                if male_idx == -1: male_idx = idx
                elif female_idx == -1: female_idx = idx

        if cov_idx == -1 or male_idx == -1: continue

        product_name = current_product
        coverage_name = cell_texts[cov_idx]
        full_text = (current_company + " " + product_name + " " + coverage_name).replace(" ", "")
        
        if any(k in full_text for k in exclude_keywords): continue
        if not any(k in coverage_name for k in include_keywords): continue
        
        m_raw = get_premium_val(cell_texts[male_idx])
        f_raw = get_premium_val(cell_texts[female_idx]) if female_idx != -1 else 0
        
        # --- FORCED NORMALIZATION (BRUTE FORCE) ---
        divisor = 1
        if m_raw >= 1000000:
            divisor = 36 # Forced 3-year pay normalization
        elif m_raw >= 300000:
            divisor = 12 # Forced 1-year/Single pay normalization
            
        m_norm = int(m_raw / divisor)
        f_norm = int(f_raw / divisor)
        
        if m_norm == 0 and f_norm == 0: continue

        out_row = [None] * 31
        for i in range(min(len(cell_texts), 26)):
            out_row[i] = cell_texts[i]
        
        out_row[7] = f"{m_norm:,} 원"
        out_row[8] = f"{f_norm:,} 원"
        out_row[0] = current_company
        out_row[1] = current_product
        out_row[26] = file_name
        final_rows.append(out_row)

# Merge
products_processed = {}
for row in final_rows:
    pname = row[1]
    if pname not in products_processed:
        products_processed[pname] = row
    else:
        base = products_processed[pname]
        m1 = get_premium_val(base[7]); m2 = get_premium_val(row[7])
        f1 = get_premium_val(base[8]); f2 = get_premium_val(row[8])
        base[7] = f"{m1 + m2:,} 원"; base[8] = f"{f1 + f2:,} 원"
        base[3] = f"{base[3]} + {row[3]}"[:100]

final_combined = list(products_processed.values())
final_combined = [r for r in final_combined if get_premium_val(r[7]) > 0 or get_premium_val(r[8]) > 0]

print(f"\nSUCCESS: {len(final_combined)} products FORCE NORMALIZED (1M+ -> /36).")

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([f"Col_{i}" for i in range(26)] + ["source_file"] + [f"Col_{i}" for i in range(26, 30)])
    writer.writerows(final_combined)
