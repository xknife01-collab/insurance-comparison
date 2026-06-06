import os
import xlrd
import io
import pandas as pd

parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
target_files = ["file_10.xls", "file_38.xls", "file_42.xls", "file_44.xls", "file_47.xls", "file_49.xls", "file_50.xls"]

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath)
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "binary_xls"
    except Exception:
        try:
            with open(filepath, 'rb') as f:
                content = f.read()
            for enc in ['utf-8', 'cp949', 'euc-kr', 'utf-16']:
                try:
                    text = content.decode(enc)
                    if '<table' in text.lower():
                        frames = pd.read_html(io.StringIO(text), flavor='bs4')
                        if frames:
                            return frames[0], f"html_{enc}"
                except Exception:
                    continue
        except Exception:
            pass
    return None, None

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

for fname in target_files:
    fpath = os.path.join(parent_dir, fname)
    df, ftype = load_df(fpath)
    if df is None:
        continue
    
    # Let's extract unique product names.
    # Product name is typically in column 1 or 2. Let's inspect column 1 and 2.
    # We will search for rows where the product name is populated.
    products = set()
    for idx, row in df.iterrows():
        row_vals = [clean_val(v) for v in row.tolist()]
        # Product names usually contain "보험", "공제" or are in column 2 (0-indexed 2 is the 3rd column)
        # In file_38, product names are in column 2. Let's check columns 1 and 2.
        for col_idx in [1, 2]:
            if col_idx < len(row_vals):
                val = row_vals[col_idx]
                if "보험" in val or "공제" in val or "House" in val:
                    products.add(val)
                    
    print(f"\nFile: {fname} | Type: {ftype} | Shape: {df.shape}")
    print("Products found:")
    for p in sorted(list(products)):
        print(f"  - {p}")
