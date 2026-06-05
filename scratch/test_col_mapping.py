import sys
import os
import numpy as np
sys.path.append(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main")

import pandas as pd
from scripts.reextract_all_accident import load_df, clean_val

def get_unified_headers_test(df):
    # Extract header rows
    header_rows = []
    for r_idx in range(min(12, len(df))):
        row_vals = [clean_val(v) for v in df.iloc[r_idx]]
        row_str = " ".join(row_vals)
        if any(kw in row_str for kw in ["상품명", "보험회사", "회사명", "담보명", "급부명", "지급사유", "보험료"]):
            header_rows.append(r_idx)
            
    if not header_rows:
        return [clean_val(c) for c in df.columns], []
        
    header_df = df.iloc[header_rows].copy()
    # Replace empty strings with NaN so ffill works
    header_df = header_df.replace("", np.nan).ffill(axis=1)
    
    concat_headers = []
    for c_idx in range(len(df.columns)):
        parts = []
        for r_idx in range(len(header_df)):
            val = clean_val(header_df.iloc[r_idx, c_idx])
            if val and val not in parts:
                parts.append(val)
        concat_headers.append("_".join(parts))
        
    return concat_headers, header_rows

df, method = load_df(r'C:\Users\zkfnt\Desktop\insurance-comparison-main\장기보장성 비교 공시 (7).xls')
headers, rows = get_unified_headers_test(df)

print("Headers with empty-to-NaN replace:")
for i, h in enumerate(headers):
    print(f"  {i}: {h}")
