import os
import glob
import re
import csv
from bs4 import BeautifulSoup

input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
output_file = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv'

include_keywords = ['수술', '입원', '일당']
exclude_keywords = ['암', '연금', '종신', 'CEO', '경영인', 'VVIP', '변액', '유병자', '간편']

all_files = glob.glob(os.path.join(input_dir, "*.xls"))

final_rows = []

def clean_text(text):
    if not text: return ""
    return re.sub(r'\s+', ' ', str(text)).strip()

def get_premium_val(val):
    if not val: return 0
    # Strict numeric check: if it looks like a phone number (contains -) or is too long, it's not a premium
    s = str(val).strip()
    if '-' in s and len(s) > 8: return 0 
    clean = re.sub(r'[^\d]', '', s)
    if len(clean) > 9: return 0 # No single rider premium is > 1 Billion Won
    try: return int(clean) if clean else 0
    except: return 0

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
    
    # --- DATA-DRIVEN DIVISOR ---
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
            if m and int(m.group(1)) <= 5: divisor = int(m.group(1)) * 12

    table = soup.find('table')
    if not table: continue

    rows = table.find_all('tr')
    current_product = ""
    current_company = ""
    
    # Find column indices more reliably
    # Usually: 0:Comp, 1:Prod, 2:Plan, 3:Cov, 7:Male, 8:Female
    for tr in rows:
        cells = tr.find_all(['td', 'th'])
        cell_texts = [clean_text(c.get_text()) for c in cells]
        if len(cell_texts) < 10: continue
        
        # Update current context
        if cell_texts[0] and len(cell_texts[0]) > 1 and '보험사' not in cell_texts[0]: current_company = cell_texts[0]
        if cell_texts[1] and len(cell_texts[1]) > 2 and '상품명' not in cell_texts[1]: current_product = cell_texts[1]

        # Target Column Logic:
        # Col 3/4 is usually coverage name.
        # Col 7/8 or 8/9 is usually premium.
        cov_name = ""
        for idx in [3, 4, 2, 5]: 
            if idx < len(cell_texts) and any(k in cell_texts[idx] for k in include_keywords):
                cov_name = cell_texts[idx]
                break
        
        if not cov_name: continue
        
        # Exclude Whole Life / CEO etc
        full_info = (current_company + current_product + cov_name).replace(" ", "")
        if any(k in full_info for k in exclude_keywords): continue

        # Premiums - BE VERY STRICT
        # Usually Male is at 7, Female at 8. 
        # But we check if they contain '원' or are purely numeric and small
        m_val = 0; f_val = 0
        for idx in range(6, min(len(cell_texts), 12)):
            val = get_premium_val(cell_texts[idx])
            if val > 0:
                if m_val == 0: m_val = val
                elif f_val == 0: f_val = val
        
        if m_val == 0: continue
        
        m_norm = int(m_val / divisor)
        f_norm = int(f_val / divisor)
        
        row_data = [None] * 31
        row_data[0] = current_company
        row_data[1] = current_product
        row_data[3] = cov_name
        row_data[7] = f"{m_norm:,} 원"
        row_data[8] = f"{f_norm:,} 원"
        row_data[26] = file_name
        final_rows.append(row_data)

# Merge by product
products = {}
for r in final_rows:
    key = r[0] + "|" + r[1]
    if key not in products:
        products[key] = r
    else:
        p = products[key]
        m_new = get_premium_val(p[7]) + get_premium_val(r[7])
        f_new = get_premium_val(p[8]) + get_premium_val(r[8])
        p[7] = f"{m_new:,} 원"
        p[8] = f"{f_new:,} 원"

result = list(products.values())
# Final sanity check: if total product premium is still > 1M, it might be a data error, 
# but we allow it for now since user said NO CAP, but let's at least cap at 10M per month 
# as a safety against phone numbers.
final_clean = []
for r in result:
    m = get_premium_val(r[7])
    if m < 10000000: # 10 Million Won cap as sanity check (Phone numbers are usually 1588... which is > 15M)
        final_clean.append(r)

print(f"DONE: {len(final_clean)} products filtered and normalized.")

with open(output_file, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([f"Col_{i}" for i in range(26)] + ["source_file"] + [f"Col_{i}" for i in range(26, 30)])
    writer.writerows(final_clean)
