import os
import pandas as pd
import glob
import warnings
import re

# Suppress warnings
warnings.filterwarnings('ignore')

input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
output_file = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv'

# Keywords
include_keywords = ['수술', '입원', '일당']
exclude_keywords = ['연금', '종신', '유병자', '간편', '어린이', '아이', '자녀', '주니어', '태아', '변액', '치아', '운전자', '화재', '실손', '실비']

all_files = glob.glob(os.path.join(input_dir, "*.xls"))
all_files += glob.glob(os.path.join(input_dir, "*.xlsx"))
print(f"Found {len(all_files)} total files.")

all_data = []

def find_target_cols(df):
    """Dynamically find columns for Product Name, Coverage Name, Male Prem, Female Prem"""
    col_map = {'product': 1, 'coverage': 3, 'male': 7, 'female': 8}
    
    # Check first 30 rows
    samples = df.head(30).astype(str)
    
    for col in df.columns:
        col_str = " ".join([str(val) for val in samples[col].tolist()])
        # Coverage name detection
        if any(k in col_str for k in ['수술', '입원', '일당', '특약']):
            if '보험' not in col_str or len(col_str) < 300: 
                col_map['coverage'] = col
        # Product name detection
        if '보험' in col_str and len(col_str) > 50:
            col_map['product'] = col
        # Premium detection
        if '원' in col_str and any(char.isdigit() for char in col_str):
            if col_map['male'] == 7 or col_map['male'] not in df.columns:
                col_map['male'] = col
            else:
                col_map['female'] = col
                
    return col_map

for file in all_files:
    file_name = os.path.basename(file)
    print(f"Processing: {file_name}...")
    
    df = None
    
    # Step 1: Detect if it's HTML or Binary
    with open(file, 'rb') as f:
        start_bytes = f.read(20)
        
    if start_bytes.startswith(b'\xd0\xcf\x11\xe0'):
        # Binary XLS (Excel 97-2003)
        try:
            df = pd.read_excel(file, engine='xlrd')
        except Exception as e:
            print(f"  Binary read failed: {e}")
    elif start_bytes.startswith(b'PK\x03\x04'):
        # Modern XLSX
        try:
            df = pd.read_excel(file, engine='openpyxl')
        except Exception as e:
            print(f"  XLSX read failed: {e}")
    else:
        # Likely HTML (even if it has leading whitespace)
        for enc in ['utf-8-sig', 'cp949', 'utf-8']:
            try:
                with open(file, 'r', encoding=enc, errors='ignore') as f:
                    content = f.read().strip() # CRITICAL: Strip leading whitespace
                    if '<table' in content.lower():
                        df_list = pd.read_html(content)
                        if df_list:
                            df = df_list[0]
                            if isinstance(df.columns, pd.MultiIndex):
                                df.columns = [f"C{i}" for i in range(len(df.columns))]
                            break
            except Exception:
                continue

    if df is None or df.empty:
        print(f"  Could not extract data from {file_name}")
        continue

    # Process extracted dataframe
    df = df.dropna(how='all')
    cmap = find_target_cols(df)
    
    for _, row in df.iterrows():
        row_vals = [str(v) if pd.notnull(v) else "" for v in row.tolist()]
        if len(row_vals) < 5: continue
        
        product_name = str(row.get(cmap['product'], ""))
        coverage_name = str(row.get(cmap['coverage'], ""))
        
        # 1. Exclusion filter
        if any(k in product_name for k in exclude_keywords): continue
        if any(k in coverage_name for k in exclude_keywords): continue
        
        # 2. Inclusion filter
        if not any(k in coverage_name for k in include_keywords): continue
        
        # 3. Validation
        male_val = str(row.get(cmap['male'], ""))
        if not any(char.isdigit() for char in male_val): continue

        # Map to 31 columns
        new_row = [None] * 31
        for i in range(min(len(row_vals), 26)):
            new_row[i] = row_vals[i]
        new_row[26] = file_name
        if len(row_vals) > 26:
            for i in range(26, min(len(row_vals), 30)):
                new_row[i+1] = row_vals[i]
        
        all_data.append(new_row)

print(f"\nFinal Extraction Success: {len(all_data)} rows from {len(all_files)} files.")

columns = [f"Col_{i}" for i in range(26)] + ["source_file"] + [f"Col_{i}" for i in range(26, 30)]
final_df = pd.DataFrame(all_data, columns=columns)
os.makedirs(os.path.dirname(output_file), exist_ok=True)
final_df.to_csv(output_file, index=False, encoding='utf-8-sig')
print(f"Saved CLEAN data to {output_file}")
