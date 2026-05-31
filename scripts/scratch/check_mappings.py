import os
import sys
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

sys.path.append(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts")

from extract_home_facility_data import load_df, find_header_mapping, clean_val

# Test a few files
test_files = ["file_10.xls", "file_11.xls", "file_18.xls", "file_45.xls"]

for filename in test_files:
    filepath = os.path.join(r"C:\Users\zkfnt\Desktop\insurance-comparison-main", filename)
    df = load_df(filepath)
    if df is None:
        print(f"❌ {filename} load failed")
        continue
    
    mapping, header_idx = find_header_mapping(df)
    print(f"\n파일: {filename}")
    print(f"헤더 인덱스: {header_idx}")
    print(f"매핑:")
    for k, v in sorted(mapping.items()):
        print(f"  {k}: {v}")
