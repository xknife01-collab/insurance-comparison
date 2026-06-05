# -*- coding: utf-8 -*-
import os
import pandas as pd
import io
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    # Try binary first
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "binary_xls"
    except Exception:
        pass
        
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd_pandas"
    except Exception:
        pass
        
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['cp949', 'euc-kr', 'utf-8']:
            try:
                raw_text = raw_bytes.decode(enc)
                if '<table' in raw_text.lower() or '<html' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        return frames[0], f"html_read_html_{enc}"
            except Exception:
                continue
    except Exception:
        pass
        
    return None, "failed"

files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
print(f"Total files: {len(files)}")

counts = {}
failed_files = []

for filename in files:
    filepath = os.path.join(SOURCE_DIR, filename)
    df, method = load_df(filepath)
    counts[method] = counts.get(method, 0) + 1
    if method == "failed":
        failed_files.append(filename)
    else:
        # Check if legal keywords exist in this file
        keywords = ["민사", "형사", "법률비용", "소송"]
        has_legal = False
        for col in df.columns:
            col_str = df[col].astype(str).str.cat(sep=" ")
            if any(kw in col_str for kw in keywords):
                has_legal = True
                break
        if has_legal:
            print(f"File {filename} ({method}) has legal keywords!")

print("Method counts:", counts)
print("Failed files:", failed_files)
