import os
import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')
INSURANCE_DATA_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data"

def main():
    matching_files = []
    # Search all csv files recursively
    for root, dirs, files in os.walk(INSURANCE_DATA_DIR):
        for f in files:
            if f.endswith(".csv"):
                filepath = os.path.join(root, f)
                try:
                    df = pd.read_csv(filepath)
                    for col in ["상품명", "지문", "상세안내", "기준보험료", "가입보험료"]:
                        matching_cols = [c for c in df.columns if col in c]
                        for mc in matching_cols:
                            matches = df[df[mc].astype(str).str.contains("효도쏘옥|효밍아웃|환경쏘옥")]
                            if not matches.empty:
                                matching_files.append((filepath, mc, matches["상품명"].unique()))
                except Exception:
                    pass
                    
    print(f"Found {len(matching_files)} matching files:")
    for filepath, col, products in matching_files:
        print(f"File: {os.path.relpath(filepath, INSURANCE_DATA_DIR)}")
        print(f"  Column: {col} | Products: {list(products)}")
        
if __name__ == "__main__":
    main()
