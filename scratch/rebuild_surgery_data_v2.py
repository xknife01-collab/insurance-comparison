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
exclude_keywords = ['연금', '종신', '유병자', '간편', '어린이', '아이', '자녀', '주니어', '태아', '변액', '치아', '운전자', '화재']

all_files = glob.glob(os.path.join(input_dir, "*.xls"))
print(f"Found {len(all_files)} .xls files.")

all_data = []

def find_target_cols(df):
    """Dynamically find columns for Product Name, Coverage Name, Male Prem, Female Prem"""
    col_map = {'product': 1, 'coverage': 3, 'male': 7, 'female': 8} # Defaults
    
    # Check first 20 rows to find patterns
    samples = df.head(20).astype(str)
    
    for col in df.columns:
        col_str = " ".join([str(val) for val in samples[col].tolist()])
        # Coverage name detection
        if any(k in col_str for k in ['수술', '입원', '일당', '특약']):
            if '보험' not in col_str or len(col_str) < 500: # Not the product name col
                col_map['coverage'] = col
        # Product name detection
        if '보험' in col_str and len(col_str) > 100:
            col_map['product'] = col
        # Premium detection (Male usually comes first)
        if '원' in col_str and any(char.isdigit() for char in col_str):
            if col_map['male'] == 7: # First one found
                col_map['male'] = col
            else:
                col_map['female'] = col
                
    return col_map

for file in all_files:
    file_name = os.path.basename(file)
    print(f"Processing: {file_name}...")
    
    try:
        if "file_" in file_name: # Likely HTML formatted
            df_list = pd.read_html(file)
            df = df_list[0]
            # Flatten multi-index columns if any
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = [f"C{i}" for i in range(len(df.columns))]
        else:
            df = pd.read_excel(file)
    except Exception as e:
        print(f"  Failed to read {file_name}: {e}")
        continue

    # Clean up
    df = df.dropna(how='all')
    
    # Find columns
    cmap = find_target_cols(df)
    
    for _, row in df.iterrows():
        row_vals = row.tolist()
        if len(row_vals) < 5: continue
        
        product_name = str(row.get(cmap['product'], ""))
        coverage_name = str(row.get(cmap['coverage'], ""))
        
        # 1. Exclusion filter
        if any(k in product_name for k in exclude_keywords): continue
        if any(k in coverage_name for k in exclude_keywords): continue # Skip if rider itself is for child/pre-existing
        
        # 2. Inclusion filter
        if not any(k in coverage_name for k in include_keywords): continue
        
        # 3. Final validation (must have some premium)
        male_val = str(row.get(cmap['male'], ""))
        if not any(char.isdigit() for char in male_val): continue

        # Map to 31 columns
        # We try to preserve the original 1-1 mapping as much as possible but centered around detected cols
        new_row = [None] * 31
        
        # Fill Col_0 to Col_25
        for i in range(min(len(row_vals), 26)):
            new_row[i] = row_vals[i]
            
        new_row[26] = file_name
        
        # Fill rest
        if len(row_vals) > 26:
            for i in range(26, min(len(row_vals), 30)):
                new_row[i+1] = row_vals[i]
        
        all_data.append(new_row)

print(f"\nRefined Extraction: {len(all_data)} rows.")

columns = [f"Col_{i}" for i in range(26)] + ["source_file"] + [f"Col_{i}" for i in range(26, 30)]
final_df = pd.DataFrame(all_data, columns=columns)
os.makedirs(os.path.dirname(output_file), exist_ok=True)
final_df.to_csv(output_file, index=False, encoding='utf-8-sig')
print(f"Saved refined data to {output_file}")
