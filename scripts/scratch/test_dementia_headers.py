import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(source_dir) if f.endswith(".xls")]

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception:
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['cp949', 'euc-kr', 'utf-8']:
                try:
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                        if frames:
                            return frames[0]
                except Exception:
                    continue
        except Exception:
            pass
    return None

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

dementia_files = []
for filename in files:
    filepath = os.path.join(source_dir, filename)
    df = load_df(filepath)
    if df is None:
        continue
    
    # Check if any row contains dementia product (exclude 종신)
    has_dementia = False
    for idx, row in df.iterrows():
        row_list = [clean_val(v) for v in row.tolist()]
        # Check product name in columns 0, 1, 2
        for prod_col in [0, 1, 2]:
            if prod_col < len(row_list):
                product_name = row_list[prod_col]
                if product_name and "치매" in product_name and "종신" not in product_name:
                    has_dementia = True
                    break
        if has_dementia:
            break
            
    if has_dementia:
        dementia_files.append((filename, df))

print(f"Found {len(dementia_files)} dementia files:")
for fname, df in dementia_files:
    print(f"\nFile: {fname} (Shape: {df.shape})")
    # Show first 10 rows
    for i in range(min(15, len(df))):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        # Filter out empty elements at the end for clean printing
        while row and row[-1] == "":
            row.pop()
        print(f"  Row {i}: {row[:12]}")
