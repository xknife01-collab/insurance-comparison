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
        high_rows = [row for row in reader if int(row['Col_7'].replace(',', '').split()[0]) >= 1000000]
        
        for target in high_rows[:5]: # Check first 5 high premium ones
            src_file = target['source_file']
            full_src_path = os.path.join(input_dir, src_file)
            
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
                    print(f"\n[Analysis for Product: {target['Col_1']} ({target['Col_7']})]")
                    
                    # Find the data row for this product/coverage
                    for tr in rows:
                        cells = tr.find_all(['td', 'th'])
                        cell_texts = [clean_text(c.get_text()) for c in cells]
                        if len(cell_texts) > 5 and target['Col_1'] in cell_texts[1]:
                            # This is a candidate row. Let's look at all its values.
                            # We suspect columns 7-10 are Period/Term
                            for idx, val in enumerate(cell_texts):
                                # If the value is '1년', '1회', '일시납', etc.
                                if '년' in val or '회' in val or '일시' in val:
                                    print(f"  Column {idx}: '{val}'")
                    print("-" * 50)

except Exception as e:
    print(f"Error: {e}")
