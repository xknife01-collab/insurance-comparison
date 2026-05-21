import os
import glob
import re
import csv
from bs4 import BeautifulSoup

input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'

# Exclusion patterns - refine to be thorough
exclude_patterns = [
    '종신', 'CEO', '경영인', 'VVIP', 'VIP', 
    '간편', '유병자', '325', '335', '355', '심사통과',
    '어린이', '태아', '자녀', '아이', '주니어', '꿈나무',
    '연금', '변액', '저축', '운전자', '화재', '치아', '실손',
    '암보험', 'CI보험' # Added Cancer/CI to focus on surgery/hospital
]

include_keywords = ['수술', '입원', '일당']

all_files = glob.glob(os.path.join(input_dir, "*.xls"))

def clean_text(text):
    if not text: return ""
    return re.sub(r'\s+', ' ', str(text)).strip()

def get_premium_val(val):
    if not val: return 0
    s = str(val).strip()
    if '-' in s and len(s) > 8: return 0 
    clean = re.sub(r'[^\d]', '', s)
    if len(clean) > 9: return 0 
    try: return int(clean) if clean else 0
    except: return 0

products_dict = {} # Key: (Comp, Prod) -> {m, f, file, term_text, divisor}

for file in all_files:
    file_name = os.path.basename(file)
    content = ""
    for enc in ['utf-8', 'utf-8-sig', 'cp949', 'euc-kr']:
        try:
            with open(file, 'r', encoding=enc) as f:
                temp = f.read()
                if '보험' in temp:
                    content = temp
                    break
        except: continue
    if not content: continue

    # Global file exclusion check
    if any(k in content for k in exclude_patterns): continue
            
    soup = BeautifulSoup(content, 'html.parser')
    
    # --- DIVISOR DETECTION ---
    divisor = 1
    term_text = ""
    # Look for any cell containing '납입' or matching time patterns
    for tr in soup.find_all('tr'):
        cells = [clean_text(c.get_text()) for c in tr.find_all(['td', 'th'])]
        for i, c in enumerate(cells):
            if ('납입' in c and '기간' in c) or (len(c) < 10 and '납' in c and '기' in c):
                if i + 1 < len(cells):
                    term_text = cells[i+1]
                    break
        if term_text: break
    
    if term_text:
        if '일시납' in term_text: divisor = 12
        else:
            m = re.search(r'(\d+)\s*년', term_text)
            if m:
                yrs = int(m.group(1))
                if yrs <= 10: divisor = yrs * 12

    table = soup.find('table')
    if not table: continue
    rows = table.find_all('tr')
    
    current_company = ""
    current_product = ""
    
    file_data = {} # To avoid summing same product multiple times in ONE file if structured oddly

    for tr in rows:
        cells = tr.find_all(['td', 'th'])
        cell_texts = [clean_text(c.get_text()) for c in cells]
        if len(cell_texts) < 10: continue
        
        if cell_texts[0] and len(cell_texts[0]) > 1 and '보험사' not in cell_texts[0]: current_company = cell_texts[0]
        if cell_texts[1] and len(cell_texts[1]) > 2 and '상품명' not in cell_texts[1]: current_product = cell_texts[1]
        
        if not current_product: continue
        
        full_name = current_company + " " + current_product
        if any(k in full_name for k in exclude_patterns): continue
        
        # Check if product is relevant (surgery/hospitalization)
        row_text = " ".join(cell_texts)
        if not any(k in row_text for k in include_keywords): continue

        key = (current_company, current_product)
        if key not in file_data:
            file_data[key] = {'m': 0, 'f': 0}
        
        m_val = get_premium_val(cell_texts[7]) if len(cell_texts) > 7 else 0
        f_val = get_premium_val(cell_texts[8]) if len(cell_texts) > 8 else 0
        
        file_data[key]['m'] += m_val
        file_data[key]['f'] += f_val

    # Merge file_data into products_dict
    for (comp, prod), data in file_data.items():
        key = (comp, prod)
        if data['m'] == 0: continue
        
        m_norm = int(data['m'] / divisor)
        f_norm = int(data['f'] / divisor)
        
        # If we already have this product, we keep the one with higher premium 
        # (assuming it's the more complete set of riders)
        if key not in products_dict or m_norm > products_dict[key]['male']:
            products_dict[key] = {
                'comp': comp,
                'prod': prod,
                'male': m_norm,
                'female': f_norm,
                'divisor': divisor,
                'term': term_text
            }

final_list = list(products_dict.values())
final_list.sort(key=lambda x: x['male'])

print(f"{'Company':<15} | {'Product':<50} | {'Male (Won)':<15} | {'Female (Won)':<15} | {'Term'}")
print("-" * 120)
for r in final_list:
    print(f"{r['comp']:<15} | {r['prod'][:50]:<50} | {r['male']:,} 원 | {r['female']:,} 원 | {r['term']}")
