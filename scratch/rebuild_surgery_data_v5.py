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

# Keywords
include_keywords = ['수술', '입원', '일당']
exclude_keywords = ['암', '연금', '종신', '유병자', '간편', '어린이', '아이', '자녀', '주니어', '태아', '변액', '치아', '운전자', '화재', '실손', '실비', '저축', '사망', '치매', '간병']

all_files = glob.glob(os.path.join(input_dir, "*.xls"))
print(f"Found {len(all_files)} .xls files.")

final_rows = []

def clean_text(text):
    if not text: return ""
    # Remove all whitespace, newlines and special chars for keyword matching
    return re.sub(r'\s+', ' ', str(text)).strip()

for file in all_files:
    file_name = os.path.basename(file)
    print(f"Processing: {file_name}...")
    
    content = ""
    try:
        # Detect encoding and read
        for enc in ['utf-8-sig', 'cp949', 'utf-8']:
            try:
                with open(file, 'r', encoding=enc, errors='ignore') as f:
                    content = f.read().strip()
                    if '<table' in content.lower(): break
            except: continue
    except: continue

    if not content or '<table' not in content.lower():
        print(f"  Skipping non-HTML or empty file: {file_name}")
        continue

    soup = BeautifulSoup(content, 'html.parser')
    table = soup.find('table')
    if not table: continue

    rows = table.find_all('tr')
    current_product = ""
    current_company = ""
    
    for tr in rows:
        cells = tr.find_all(['td', 'th'])
        if not cells: continue
        
        # Extract clean text from each cell
        cell_texts = [clean_text(c.get_text()) for c in cells]
        
        # Skip header-like rows or very short rows
        if len(cell_texts) < 5: continue
        if '보험사' in cell_texts[0] or '상품명' in cell_texts[1]: continue

        # Logic to handle rowspans (if company/product is missing, use previous)
        # Usually: Col 0 = Company, Col 1 = Product, Col 2 = Type, Col 3 = Coverage...
        if cell_texts[0] and len(cell_texts[0]) > 1:
            current_company = cell_texts[0]
        if cell_texts[1] and len(cell_texts[1]) > 2:
            current_product = cell_texts[1]
            
        # Try to find which index has coverage and premium
        # Based on typical structure: [Company, Product, Type, Coverage, Description, Payout, SubAmt, Male, Female, ...]
        # We search dynamically
        cov_idx = -1
        male_idx = -1
        female_idx = -1
        
        for idx, txt in enumerate(cell_texts):
            if any(k in txt for k in include_keywords) and cov_idx == -1:
                cov_idx = idx
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
        
        # --- MAP TO 31 COLS ---
        out_row = [None] * 31
        # Fill first part
        for i in range(min(len(cell_texts), 26)):
            out_row[i] = cell_texts[i]
        # Overwrite company/product if they were missing in this specific row (rowspan)
        out_row[0] = current_company
        out_row[1] = current_product
        
        out_row[26] = file_name # source_file
        
        # Fill rest
        if len(cell_texts) > 26:
            for i in range(26, min(len(cell_texts), 30)):
                out_row[i+1] = cell_texts[i]
        
        final_rows.append(out_row)

print(f"\nFinal CLEAN Extraction: {len(final_rows)} rows.")

# Save with CSV module to handle quoting properly
os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    # Header
    writer.writerow([f"Col_{i}" for i in range(26)] + ["source_file"] + [f"Col_{i}" for i in range(26, 30)])
    writer.writerows(final_rows)

print(f"Saved to {output_file}")
