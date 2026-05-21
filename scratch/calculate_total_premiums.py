import os
import glob
import re
import csv
from bs4 import BeautifulSoup

input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'

include_keywords = ['수술', '입원', '일당']
# Keep everything for calculation, but identify if it's a surgery product
exclude_keywords = ['연금', 'CEO', '경영인', 'VVIP', '변액', '유병자', '간편']

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

results = []

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

    soup = BeautifulSoup(content, 'html.parser')
    
    # --- DIVISOR DETECTION ---
    divisor = 1
    term_text = ""
    for tr in soup.find_all('tr'):
        cells = [clean_text(c.get_text()) for c in tr.find_all(['td', 'th'])]
        for i, c in enumerate(cells):
            if '납입기간' in c and i + 1 < len(cells):
                term_text = cells[i+1]
                break
        if term_text: break
    
    if term_text:
        if '일시납' in term_text: divisor = 12
        else:
            m = re.search(r'(\d+)\s*년', term_text)
            if m:
                yrs = int(m.group(1))
                if yrs <= 10: divisor = yrs * 12 # Normalize short/medium terms

    table = soup.find('table')
    if not table: continue

    rows = table.find_all('tr')
    current_product = ""
    current_company = ""
    
    product_data = {} # Key: (Comp, Prod) -> {m_total, f_total, has_surgery}

    for tr in rows:
        cells = tr.find_all(['td', 'th'])
        cell_texts = [clean_text(c.get_text()) for c in cells]
        if len(cell_texts) < 10: continue
        
        if cell_texts[0] and len(cell_texts[0]) > 1 and '보험사' not in cell_texts[0]: current_company = cell_texts[0]
        if cell_texts[1] and len(cell_texts[1]) > 2 and '상품명' not in cell_texts[1]: current_product = cell_texts[1]

        if not current_product: continue
        
        key = (current_company, current_product)
        if key not in product_data:
            product_data[key] = {'m': 0, 'f': 0, 'surgery': False}

        # Check if this row is a surgery rider
        rider_name = ""
        for idx in [3, 4, 2, 5]:
            if idx < len(cell_texts):
                if any(k in cell_texts[idx] for k in include_keywords):
                    product_data[key]['surgery'] = True
                    break

        # Always add premium regardless of rider name if product matches
        m_val = get_premium_val(cell_texts[7]) if len(cell_texts) > 7 else 0
        f_val = get_premium_val(cell_texts[8]) if len(cell_texts) > 8 else 0
        
        product_data[key]['m'] += m_val
        product_data[key]['f'] += f_val

    for (comp, prod), data in product_data.items():
        if not data['surgery']: continue
        if any(k in (comp + prod) for k in exclude_keywords): continue
        if data['m'] == 0: continue
        
        m_norm = int(data['m'] / divisor)
        f_norm = int(data['f'] / divisor)
        
        results.append({
            'comp': comp,
            'prod': prod,
            'male': m_norm,
            'female': f_norm,
            'file': file_name
        })

# Sort and print
results.sort(key=lambda x: x['male'], reverse=True)

print(f"{'Company':<15} | {'Product':<40} | {'Male (Won)':<15} | {'Female (Won)':<15}")
print("-" * 90)
for r in results:
    print(f"{r['comp']:<15} | {r['prod'][:40]:<40} | {r['male']:,} 원 | {r['female']:,} 원")
