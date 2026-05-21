import os
import glob
import re
import csv
from bs4 import BeautifulSoup

input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
RATIO = 1.36

exclude_patterns = [
    '종신', 'CEO', '경영인', 'VVIP', 'VIP', 
    '간편', '유병자', '325', '335', '355', '심사통과',
    '어린이', '태아', '자녀', '아이', '주니어', '꿈나무',
    '연금', '변액', '저축', '운전자', '화재', '치아', '실손',
    '암보험', 'CI보험', '치매', '간병', '사망'
]

include_keywords = ['수술', '입원', '일당']

all_files = glob.glob(os.path.join(input_dir, "*.xls"))

def clean_text(text):
    if not text: return ""
    return re.sub(r'\s+', ' ', str(text)).strip()

def get_premium_val(val):
    if not val: return 0
    s = str(val).strip()
    if '-' in s or len(s) > 9: return 0 
    clean = re.sub(r'[^\d]', '', s)
    try: return int(clean) if clean else 0
    except: return 0

products_dict = {} 

for file in all_files:
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
            if ('납입' in c and '기간' in c) or (len(c) < 10 and '납' in c and '기' in c):
                if i + 1 < len(cells):
                    potential = cells[i+1]
                    if '1588' not in potential and '-' not in potential:
                        term_text = potential
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
    file_data = {} 

    for tr in rows:
        cells = tr.find_all(['td', 'th'])
        cell_texts = [clean_text(c.get_text()) for c in cells]
        if len(cell_texts) < 10: continue
        
        if cell_texts[0] and len(cell_texts[0]) > 1 and '보험사' not in cell_texts[0]: current_company = cell_texts[0]
        if cell_texts[1] and len(cell_texts[1]) > 2 and '상품명' not in cell_texts[1]: current_product = cell_texts[1]
        
        if not current_product: continue
        
        full_name = current_company + " " + current_product
        if any(k in full_name for k in exclude_patterns): continue
        
        row_text = " ".join(cell_texts)
        if not any(k in row_text for k in include_keywords): continue

        key = (current_company, current_product)
        if key not in file_data:
            file_data[key] = {'m': 0, 'f': 0}
        
        m_val = get_premium_val(cell_texts[7]) if len(cell_texts) > 7 else 0
        f_val = get_premium_val(cell_texts[8]) if len(cell_texts) > 8 else 0
        
        file_data[key]['m'] += m_val
        file_data[key]['f'] += f_val

    for (comp, prod), data in file_data.items():
        key = (comp, prod)
        if data['m'] == 0 and data['f'] == 0: continue
        
        m_raw = int(data['m'] / divisor)
        f_raw = int(data['f'] / divisor)
        
        # Apply Gender Ratio if one is missing
        is_m_estimated = False
        is_f_estimated = False
        
        if m_raw > 0 and f_raw == 0:
            f_raw = int(m_raw * RATIO)
            is_f_estimated = True
        elif f_raw > 0 and m_raw == 0:
            m_raw = int(f_raw / RATIO)
            is_m_estimated = True
            
        if key not in products_dict or m_raw > products_dict[key]['male']:
            products_dict[key] = {
                'comp': comp,
                'prod': prod,
                'male': m_raw,
                'female': f_raw,
                'is_m_est': is_m_estimated,
                'is_f_est': is_f_estimated
            }

final_list = list(products_dict.values())
final_list = [r for r in final_list if r['male'] < 200000]
final_list.sort(key=lambda x: x['male'])

print(f"{'No':<3} | {'Company':<12} | {'Product':<45} | {'Male':<12} | {'Female':<12}")
print("-" * 100)
for i, r in enumerate(final_list, 1):
    m_str = f"{r['male']:,}원" + ("*" if r['is_m_est'] else "")
    f_str = f"{r['female']:,}원" + ("*" if r['is_f_est'] else "")
    print(f"{i:<3} | {r['comp']:<12} | {r['prod'][:45]:<45} | {m_str:<12} | {f_str:<12}")
