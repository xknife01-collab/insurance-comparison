import os
import xlrd
import pandas as pd
import io

parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
target_files = ["file_38.xls", "file_42.xls", "file_47.xls", "file_50.xls"]

output_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\property_details.txt"

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

with open(output_path, "w", encoding="utf-8") as out:
    for fname in target_files:
        fpath = os.path.join(parent_dir, fname)
        df, ftype = load_df(fpath)
        if df is None:
            out.write(f"File: {fname} could not be loaded.\n\n")
            continue
            
        out.write(f"==================================================\n")
        out.write(f"File: {fname} | Type: {ftype} | Shape: {df.shape}\n")
        out.write(f"==================================================\n")
        
        # Print first 20 rows of the sheet
        out.write("First 20 rows:\n")
        for idx in range(min(20, len(df))):
            row_str = " | ".join([clean_val(v) for v in df.iloc[idx].tolist()])
            out.write(f"  Row {idx}: {row_str}\n")
        out.write("\n")
        
        # Group products and print their rows
        products = {}
        last_prod = ""
        for idx, row in df.iterrows():
            if idx < 5:  # skip top header area for product grouping
                continue
            row_vals = [clean_val(v) for v in row.tolist()]
            # Usually product name is in column 1 or 2
            # Let's find product candidate
            prod_cand = ""
            for col_idx in [1, 2]:
                if col_idx < len(row_vals):
                    val = row_vals[col_idx]
                    if "보험" in val or "공제" in val or "House" in val:
                        prod_cand = val
                        break
            if prod_cand:
                last_prod = prod_cand
            
            if last_prod:
                if last_prod not in products:
                    products[last_prod] = []
                products[last_prod].append((idx, row_vals))
                
        out.write(f"Unique products and their rows ({len(products)} products):\n")
        for prod, rows in products.items():
            out.write(f"Product: {prod} ({len(rows)} rows)\n")
            for idx, r_vals in rows[:10]: # Print first 10 rows per product
                out.write(f"  Row {idx}: " + " | ".join(r_vals) + "\n")
            if len(rows) > 10:
                out.write(f"  ... and {len(rows) - 10} more rows\n")
        out.write("\n\n")

print(f"Details written to {output_path}")
