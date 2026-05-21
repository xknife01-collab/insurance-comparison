import pandas as pd
import os
import glob
import warnings
import numpy as np

# Suppress warnings
warnings.filterwarnings('ignore')

source_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
output_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'

os.makedirs(output_dir, exist_ok=True)

target_columns = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", "지급금액", "가입금액", 
    "기준보험료", "가입보험료", "적용이율", "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", 
    "source_file"
]

# Keywords to find column indices
column_mapping_keywords = {
    "보험회사": ["보험회사", "회사명", "생명보험회사", "손해보험회사", "회사"],
    "상품명": ["상품명", "보험상품명"],
    "구분": ["구분"],
    "담보명(급부명)": ["담보명", "급부명", "내용", "급부내용"],
    "지급사유": ["지급사유", "사유"],
    "지급금액": ["지급금액", "지급금액(단위:원)", "지급 금액"],
    "가입금액": ["가입금액", "가입 금액"],
}

def try_read(file_path):
    # Try cp949 (EUC-KR) first as it's the most common for these XLS files
    for enc in ['cp949', 'utf-8-sig', 'utf-8']:
        try:
            with open(file_path, 'r', encoding=enc) as f:
                html_data = f.read()
            # If we successfully read, try to parse. 
            # Check for some common Korean characters to ensure it's not junk
            if "보험" in html_data or "상품" in html_data or "뇌" in html_data:
                dfs = pd.read_html(html_data)
                if dfs: return dfs[0]
        except:
            continue
            
    # Fallback for real Excel files
    try:
        return pd.read_excel(file_path)
    except:
        return None

def find_column_indices(df):
    indices = {col: -1 for col in column_mapping_keywords.keys()}
    header_row_idx = -1
    
    # Scan first 15 rows for headers
    for i in range(min(15, len(df))):
        row = [str(x).replace('\n', '').replace(' ', '') for x in df.iloc[i]]
        matches = 0
        temp_indices = {col: -1 for col in column_mapping_keywords.keys()}
        
        for idx, cell_val in enumerate(row):
            if not cell_val or cell_val == 'nan': continue
            for target_col, keywords in column_mapping_keywords.items():
                if temp_indices[target_col] != -1: continue
                for kw in keywords:
                    if kw in cell_val:
                        temp_indices[target_col] = idx
                        matches += 1
                        break
        
        if matches >= 3:
            indices = temp_indices
            header_row_idx = i
            break
            
    return indices, header_row_idx

def main():
    all_rows = []
    files = glob.glob(os.path.join(source_dir, "*.xls"))
    keywords = ["뇌혈관", "뇌졸중", "뇌출혈", "뇌질환"]
    
    for f in files:
        df = try_read(f)
        if df is None: continue
        
        col_map, header_idx = find_column_indices(df)
        data_start = header_idx + 1 if header_idx != -1 else 0
        
        # If no header found, use a more robust fallback
        if sum(1 for v in col_map.values() if v != -1) < 3:
            # Check for "No." column or empty first column
            row_sample = df.iloc[min(data_start + 5, len(df)-1)].tolist() if len(df) > data_start + 5 else []
            shift = 0
            if row_sample:
                s0 = str(row_sample[0])
                if not s0 or s0 == 'nan' or s0.isdigit():
                    shift = 1
            
            col_map = {
                "보험회사": 0 + shift,
                "상품명": 1 + shift,
                "구분": 2 + shift,
                "담보명(급부명)": 3 + shift,
                "지급사유": 4 + shift,
                "지급금액": 5 + shift,
                "가입금액": 6 + shift,
            }

        print(f"File: {os.path.basename(f)}, Map: {col_map}, Start: {data_start}")

        for i in range(data_start, len(df)):
            row_vals = df.iloc[i].tolist()
            row_str = " ".join([str(x) for x in row_vals])
            
            if any(kw in row_str for kw in keywords):
                new_row = {c: "" for c in target_columns}
                new_row["source_file"] = os.path.basename(f)
                
                for target_col, idx in col_map.items():
                    if 0 <= idx < len(row_vals):
                        val = row_vals[idx]
                        new_row[target_col] = str(val).strip() if pd.notna(val) else ""
                
                # Double check: if "보험회사" is empty but index+1 has content, and "상품명" is where "보험회사" should be...
                # Actually, let's just trust the map if found, or fix the fallback.
                
                # Final safeguard for empty company names
                if not new_row["보험회사"] and len(row_vals) > col_map["보험회사"] + 1:
                    # If current mapped company is empty, try the next one if it looks like a company name
                    # But only if "상품명" is also empty or shifted.
                    pass 

                # Store raw columns for verification
                for j, v in enumerate(row_vals):
                    if j < 20:
                        new_row[f"원본_열_{j}"] = v
                
                all_rows.append(new_row)
                
    if all_rows:
        final_cols = target_columns + [f"원본_열_{j}" for j in range(20)]
        result_df = pd.DataFrame(all_rows, columns=final_cols)
        out_path = os.path.join(output_dir, "extracted_data.csv")
        result_df.to_csv(out_path, index=False, encoding='utf-8-sig')
        print(f"Saved {len(all_rows)} rows to {out_path}")
    else:
        print("No matches found.")

if __name__ == "__main__":
    main()
