import pandas as pd
import os
import json

def find_yearly_indicator():
    file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_final_consolidated.xlsx'
    df = pd.read_excel(file_path)
    
    # 1. Check Column Headers
    yearly_cols = [c for c in df.columns if '연' in str(c)]
    print(f"[*] Columns with '연': {yearly_cols}")

    # 2. Check Row values
    print("[*] Checking rows for '연' indicator...")
    found_rows = []
    for idx, row in df.iterrows():
        row_text = " ".join([str(v) for v in row.values])
        if '연' in row_text:
            found_rows.append(idx)
            # print(f"Row {idx} has '연': {row_text}")

    print(f"[*] Found {len(found_rows)} rows with '연' indicator.")
    return yearly_cols, found_rows

if __name__ == "__main__":
    find_yearly_indicator()
