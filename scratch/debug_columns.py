import pandas as pd
import os
import glob
import warnings

warnings.filterwarnings('ignore')

source_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'

def try_read(file_path):
    try:
        # Try Excel
        return pd.read_excel(file_path)
    except:
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                html_data = f.read()
            dfs = pd.read_html(html_data)
            if dfs: return dfs[0]
        except:
            try:
                with open(file_path, 'r', encoding='cp949', errors='ignore') as f:
                    html_data = f.read()
                dfs = pd.read_html(html_data)
                if dfs: return dfs[0]
            except:
                pass
    return None

def main():
    files = glob.glob(os.path.join(source_dir, "*.xls"))
    if not files:
        print("No files found.")
        return
    
    for f in files[:3]: # Check first 3 files
        print(f"\n--- Checking: {os.path.basename(f)} ---")
        df = try_read(f)
        if df is not None:
            print("Columns:", df.columns.tolist())
            print("First row values:", df.iloc[0].tolist() if len(df) > 0 else "Empty")
            print("Second row values:", df.iloc[1].tolist() if len(df) > 1 else "N/A")
        else:
            print("Could not read file.")

if __name__ == "__main__":
    main()
