import os
import glob
import xlrd
import io
import pandas as pd
import re

parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = glob.glob(os.path.join(parent_dir, "*.xls"))

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

property_keywords = ["재물", "성공메이트", "성공파트너", "우리매장", "소상공인", "비즈니스", "biz", "안심파트너", "우리동네", "파트너", "m-house", "m house"]

print("Scanning all files for property insurance products...")
found_files = []

for filepath in sorted(files):
    name = os.path.basename(filepath)
    df, ftype = load_df(filepath)
    if df is None:
        continue
    
    # Let's check if the file contains any property keywords in any cell
    has_property = False
    matching_cells = []
    
    for r_idx, row in df.iterrows():
        row_str = " ".join([clean_val(v) for v in row.tolist()])
        for kw in property_keywords:
            if kw.lower() in row_str.lower():
                has_property = True
                matching_cells.append((r_idx, kw))
                break
                
    if has_property:
        found_files.append((name, ftype, df.shape, matching_cells))

print(f"\nFound {len(found_files)} files containing property keywords:")
for name, ftype, shape, matches in found_files:
    print(f"- {name} ({ftype}, Shape: {shape})")
    # Print sample matches
    sample_matches = ", ".join([f"row {r}: '{kw}'" for r, kw in matches[:3]])
    print(f"  Matches: {sample_matches}")
