# -*- coding: utf-8 -*-
import os
import pandas as pd
import io
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data)
    except Exception:
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

files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
print(f"Scanning {len(files)} files...")

keywords = ["민사", "형사", "법률비용", "소송", "변호사"]

all_matches = []

for filename in files:
    filepath = os.path.join(SOURCE_DIR, filename)
    df = load_df(filepath)
    if df is None:
        continue
    
    # Forward-fill company (Col 1) and product name (Col 2)
    # Wait, let's find company and product name column indices
    # Typically Col 1 is company, Col 2 is product name
    current_company = ""
    current_product = ""
    
    for idx, row in df.iterrows():
        # Clean values
        row_vals = ["" if pd.isna(v) else str(v).strip() for v in row.tolist()]
        
        # update current company and product if present in row
        if len(row_vals) > 1 and row_vals[1] != "" and "회사" not in row_vals[1] and "조회" not in row_vals[1]:
            current_company = row_vals[1]
        if len(row_vals) > 2 and row_vals[2] != "" and "상품명" not in row_vals[2]:
            current_product = row_vals[2]
            
        row_str = " | ".join(row_vals)
        if any(kw in row_str for kw in keywords):
            all_matches.append({
                "file": filename,
                "row_idx": idx,
                "company": current_company,
                "product": current_product,
                "row_vals": row_vals
            })

print(f"Found {len(all_matches)} rows matching keywords.")

# Save matching rows detail to scratch/all_matching_rows.txt
with open("scratch/all_matching_rows.txt", "w", encoding="utf-8") as f:
    for m in all_matches:
        f.write(f"File: {m['file']}, Row: {m['row_idx']}, Company: {m['company']}, Product: {m['product']}\n")
        f.write(f"  Row: {' | '.join(m['row_vals'][:10])}\n\n")

print("Saved to scratch/all_matching_rows.txt")
# Print unique products found
unique_products = set((m['company'], m['product']) for m in all_matches)
print("Unique Products:")
for c, p in unique_products:
    print(f"  - {c} | {p}")
