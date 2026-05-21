import pandas as pd
import os
import glob
import warnings

warnings.filterwarnings('ignore')

source_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'

def try_read(file_path):
    try:
        # Try HTML first as most .xls from these sources are HTML tables
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            html_data = f.read()
        dfs = pd.read_html(html_data)
        if dfs: return dfs[0]
    except:
        pass
    
    try:
        with open(file_path, 'r', encoding='cp949', errors='ignore') as f:
            html_data = f.read()
        dfs = pd.read_html(html_data)
        if dfs: return dfs[0]
    except:
        pass
        
    try:
        return pd.read_excel(file_path)
    except:
        return None

def main():
    # Pick a few representative files
    test_files = [
        "보장성_상품비교_20260406102522903.xls",
        "장기보장성 비교 공시 (11).xls",
        "종신 1.xls"
    ]
    
    for filename in test_files:
        f = os.path.join(source_dir, filename)
        if not os.path.exists(f): continue
        
        print(f"\n--- Analyzing: {filename} ---")
        df = try_read(f)
        if df is not None:
            print(f"Shape: {df.shape}")
            # Print first 5 rows to see where headers might be
            for i in range(min(5, len(df))):
                print(f"Row {i}: {df.iloc[i].tolist()}")
            
            # Check column names assigned by pandas
            print(f"Pandas Columns: {df.columns.tolist()}")
        else:
            print("Failed to read.")

if __name__ == "__main__":
    main()
