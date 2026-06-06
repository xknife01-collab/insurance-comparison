import os
import xlrd
import pandas as pd
import io

parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
target_files = ["file_10.xls", "file_20.xls", "file_38.xls", "file_42.xls", "file_44.xls", "file_47.xls", "file_49.xls", "file_50.xls"]

output_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\all_matching_files_products.txt"

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
            continue
        
        products = set()
        for idx, row in df.iterrows():
            row_vals = [clean_val(v) for v in row.tolist()]
            for col_idx in [1, 2]:
                if col_idx < len(row_vals):
                    val = row_vals[col_idx]
                    if val and not any(h in val for h in ["회사명", "상품명", "선택", "조회 조건", "장기보장성", "실손"]):
                        products.add(val)
                        
        out.write(f"File: {fname} | Type: {ftype} | Shape: {df.shape}\n")
        out.write("Products:\n")
        for p in sorted(list(products)):
            out.write(f"  - {p}\n")
        out.write("\n")

print(f"Results written to {output_path}")
