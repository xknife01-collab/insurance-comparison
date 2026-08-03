import os
import pandas as pd
import glob
import warnings
import re
import csv

# Suppress warnings
warnings.filterwarnings('ignore')

input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
output_file = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv'

# Keywords (NO PREMIUM CAP)
include_keywords = ['수술', '입원', '일당']
exclude_keywords = [
    '암', '연금', '종신', '유병자', '간편', '어린이', '아이', '자녀', '주니어', '태아', 
    '변액', '치아', '운전자', '화재', '실손', '실비', '저축', '사망', '치매', '간병',
    'CEO', 'VIP', 'VVIP', '경영인', '정기', '유니버설', '유니버셜'
]

all_files = glob.glob(os.path.join(input_dir, "*.xls"))
print(f"Found {len(all_files)} .xls files.")

final_rows = []

def get_premium_val(val):
    if pd.isna(val) or val == "": return 0
    clean = re.sub(r'[^\d]', '', str(val))
    try: return int(clean) if clean else 0
    except: return 0

for file in all_files:
    file_name = os.path.basename(file)
    df = None
    
    # Method 1: Try reading as REAL Excel first (to get perfect Korean)
    for engine in ['xlrd', 'openpyxl']:
        try:
            df = pd.read_excel(file, engine=engine)
            if not df.empty: break
        except: continue
        
    # Method 2: Fallback to HTML if Excel engines fail
    if df is None:
        for enc in ['cp949', 'utf-8-sig', 'utf-8']:
            try:
                with open(file, 'r', encoding=enc) as f:
                    content = f.read()
                    if '<table' in content.lower():
                        df_list = pd.read_html(content)
                        if df_list:
                            df = df_list[0]
                            break
            except: continue

    if df is None or df.empty: continue

    # Process DataFrame
    # Handle MultiIndex columns if any
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [f"Col_{i}" for i in range(len(df.columns))]
    
    current_product = ""
    current_company = ""
    
    for _, row in df.iterrows():
        row_vals = [str(v).strip() if pd.notnull(v) else "" for v in row.tolist()]
        if len(row_vals) < 5: continue
        
        # Simple heuristic for company/product
        if row_vals[0] and len(row_vals[0]) > 1 and '보험사' not in row_vals[0]: 
            current_company = row_vals[0]
        if row_vals[1] and len(row_vals[1]) > 2 and '상품명' not in row_vals[1]: 
            current_product = row_vals[1]
            
        cov_idx = -1
        for idx, txt in enumerate(row_vals):
            if any(k in txt for k in include_keywords):
                cov_idx = idx
                break
        
        if cov_idx == -1: continue

        # Filter
        full_text = (current_company + " " + current_product + " " + row_vals[cov_idx]).replace(" ", "")
        if any(k in full_text for k in exclude_keywords): continue
        
        # Collect
        out_row = [None] * 31
        for i in range(min(len(row_vals), 26)):
            out_row[i] = row_vals[i]
        out_row[0] = current_company
        out_row[1] = current_product
        out_row[26] = file_name
        
        final_rows.append(out_row)

# Combine
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

print(f"\nFinal CLEAN Extraction (Excel Engine First): {len(final_combined)} products.")

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([f"Col_{i}" for i in range(26)] + ["source_file"] + [f"Col_{i}" for i in range(26, 30)])
    writer.writerows(final_combined)
