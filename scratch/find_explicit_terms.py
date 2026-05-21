import os
import re
from bs4 import BeautifulSoup
import csv

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'
input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'

try:
    with open(file_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        # Find products with premium >= 300,000
        high_rows = [row for row in reader if int(row['Col_7'].replace(',', '').split()[0]) >= 300000]
        
        for target in high_rows:
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
                print(f"\n[File: {src_file} | Product: {target['Col_1']}]")
                
                # Search for keywords like '납입기간', '납', '년' in ALL text
                text_content = soup.get_text()
                
                # Find all numbers followed by '년납' or '년'
                matches = re.findall(r'(\d+)\s*[년]\s*[납]', text_content)
                single_pay = '일시납' in text_content
                
                if matches:
                    print(f"  >>> FOUND DATA: {matches} Year Pay")
                if single_pay:
                    print(f"  >>> FOUND DATA: Single Pay (일시납)")
                
                # If no clear match, let's look for specific labels
                labels = ["납입기간", "보험기간", "납입주기"]
                for row in soup.find_all('tr'):
                    cells = [c.get_text().strip() for c in row.find_all(['td', 'th'])]
                    for i, c in enumerate(cells):
                        if any(l in c for l in labels):
                            # Usually the value is in the next cell
                            val = cells[i+1] if i+1 < len(cells) else "N/A"
                            print(f"  >>> LABEL '{c}' VALUE: '{val}'")
                print("-" * 60)

except Exception as e:
    print(f"Error: {e}")
