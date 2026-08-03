import pandas as pd
import glob
import os

files = glob.glob(r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data\*.xls')

print(f"[*] Total {len(files)} files to scan...")

for f in files:
    try:
        # Try reading the first column to find company names
        df = pd.read_excel(f, engine='xlrd', header=None, nrows=100)
        found_rows = df[df.apply(lambda row: row.astype(str).str.contains('삼성|메리츠|하나|DB|KB|현대').any(), axis=1)]
        
        if not found_rows.empty:
            print(f"  [FOUND] In {os.path.basename(f)}: Found {len(found_rows)} matches.")
            # Print unique companies found in first 100 rows
            raw_txt = found_rows.to_string()
            if '삼성' in raw_txt: print("    - Contains SAMSUNG")
            if '메리츠' in raw_txt: print("    - Contains MERITZ")
            if '하나' in raw_txt: print("    - Contains HANA")
            
    except Exception as e:
        # Skip if not a valid XLS binary (might be HTML)
        pass
