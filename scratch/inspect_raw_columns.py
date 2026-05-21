import csv
import os
import re
from bs4 import BeautifulSoup

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'
input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'

def clean_text(text):
    if not text: return ""
    return re.sub(r'\s+', ' ', str(text)).strip()

try:
    with open(file_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        # Find high premium rows
        high_rows = [row for row in reader if int(row['Col_7'].replace(',', '').split()[0]) >= 1000000]
        
        if not high_rows:
            print("No high premium products found to check.")
        else:
            # Pick the top one (KDB usually)
            target = high_rows[0]
            src_file = target['source_file']
            full_src_path = os.path.join(input_dir, src_file)
            
            print(f"--- Checking Original File: {src_file} ---")
            
            content = ""
            for enc in ['cp949', 'utf-8-sig', 'utf-8']:
                try:
                    with open(full_src_path, 'r', encoding=enc) as f_src:
                        content = f_src.read()
                        if '보험' in content: break
                except: continue
            
            if content:
                soup = BeautifulSoup(content, 'html.parser')
                table = soup.find('table')
                if table:
                    rows = table.find_all('tr')
                    # Print first 5 rows to see headers and structure
                    print("\n[Raw Columns Detected in File]")
                    for i, tr in enumerate(rows[:10]):
                        cells = tr.find_all(['td', 'th'])
                        cell_texts = [clean_text(c.get_text()) for c in cells]
                        print(f"Row {i}: {cell_texts}")
                        
                        # Look for '납' or '기간' keywords in any cell
                        for txt in cell_texts:
                            if '납' in txt or '기간' in txt or '1년' in txt or '일시' in txt:
                                print(f"  >>> POTENTIAL MATCH FOUND: '{txt}'")

except Exception as e:
    print(f"Error: {e}")
