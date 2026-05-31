import os
import pandas as pd
from bs4 import BeautifulSoup
import re

root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

files = sorted([f for f in os.listdir(root_dir) if f.lower().endswith('.xls') or f.lower().endswith('.xlsx')])

def check_value(val_str):
    val_str = str(val_str).strip().replace(' ', '')
    if not val_str or val_str.lower() in ('nan', 'none'):
        return None
    
    # purely digits
    if val_str.isdigit():
        return int(val_str)
    
    # digits with commas
    if re.match(r'^\d{1,3}(,\d{3})+$', val_str):
        return int(val_str.replace(',', ''))
        
    # digits with 원
    m = re.match(r'^([\d,]+)원$', val_str)
    if m:
        num_str = m.group(1).replace(',', '')
        if num_str.isdigit():
            return int(num_str)
            
    # float representing int
    try:
        # e.g., 17456.0
        fval = float(val_str.replace(',', ''))
        if fval.is_integer():
            return int(fval)
    except ValueError:
        pass
        
    return None

results = []

for filename in files:
    filepath = os.path.join(root_dir, filename)
    is_html = False
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            head = f.read(500)
            if "<html" in head.lower() or "<table" in head.lower():
                is_html = True
    except:
        pass
        
    if is_html:
        try:
            for enc in ['cp949', 'utf-8', 'euc-kr']:
                try:
                    with open(filepath, 'r', encoding=enc, errors='ignore') as f:
                        content = f.read()
                    if '<table' in content.lower():
                        break
                except:
                    continue
            soup = BeautifulSoup(content, 'html.parser')
            table = soup.find('table')
            if table:
                for tr in table.find_all('tr'):
                    tds = tr.find_all(['td', 'th'])
                    row_list = [" ".join(td.get_text().split()) for td in tds]
                    for col_idx, v in enumerate(row_list):
                        num = check_value(v)
                        if num is not None and 1000 <= num <= 200000:
                            results.append((filename, "HTML", col_idx, v, num))
        except Exception as e:
            pass
    else:
        try:
            xl = pd.ExcelFile(filepath)
            for sheet in xl.sheet_names:
                df = xl.parse(sheet, header=None)
                for idx, row in df.iterrows():
                    for col_idx, val in enumerate(row):
                        if pd.notna(val):
                            num = check_value(val)
                            if num is not None and 1000 <= num <= 200000:
                                results.append((filename, f"Excel({sheet})", col_idx, str(val), num))
        except Exception as e:
            pass

print(f"Total potential premium cells found: {len(results)}")
# print a sample of 30
import random
sample = random.sample(results, min(len(results), 50))
for res in sample:
    print(f"File: {res[0]} | Type: {res[1]} | Col: {res[2]} | Raw: {res[3]} -> Parsed: {res[4]}")
