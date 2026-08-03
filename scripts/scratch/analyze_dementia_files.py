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

dementia_files = {}

for filename in files:
    filepath = os.path.join(source_dir, filename)
    df = load_df(filepath)
    if df is None:
        continue
        
    # Check if any row contains dementia product (exclude 종신)
    has_dementia = False
    sample_rows = []
    
    # We need to find the product name column
    # Let's check headers first to find "상품명" column index
    header_row_idx = -1
    for i in range(min(20, len(df))):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        if any("상품명" in val or "보험사" in val or "회사명" in val for val in row):
            header_row_idx = i
            break
            
    prod_col = 1
    if header_row_idx != -1:
        row = [clean_val(v) for v in df.iloc[header_row_idx].tolist()]
        for c_idx, val in enumerate(row):
            if "상품명" in val:
                prod_col = c_idx
                break
                
    for idx, row in df.iterrows():
        if idx <= header_row_idx:
            continue
        row_list = [clean_val(v) for v in row.tolist()]
        if prod_col >= len(row_list):
            continue
        product_name = row_list[prod_col]
        if not product_name and prod_col + 1 < len(row_list):
            product_name = row_list[prod_col + 1]
            
        if product_name and "치매" in product_name and "종신" not in product_name:
            has_dementia = True
            sample_rows.append((idx, row_list))
            
    if has_dementia:
        # Determine header type
        h_row = []
        n_row = []
        if header_row_idx != -1:
            h_row = [clean_val(v) for v in df.iloc[header_row_idx].tolist()]
            if header_row_idx + 1 < len(df):
                n_row = [clean_val(v) for v in df.iloc[header_row_idx + 1].tolist()]
        
        has_gender_sub = any("남자" in str(v) or "여자" in str(v) for v in n_row)
        dementia_files[filename] = {
            "header_idx": header_row_idx,
            "has_gender_sub": has_gender_sub,
            "h_row": h_row,
            "n_row": n_row,
            "sample_count": len(sample_rows),
            "samples": sample_rows[:3]
        }

with open("dementia_files_analysis.txt", "w", encoding="utf-8") as f:
    for fname, info in dementia_files.items():
        f.write(f"File: {fname}\n")
        f.write(f"  Header Index: {info['header_idx']}\n")
        f.write(f"  Has Gender Sub: {info['has_gender_sub']}\n")
        f.write(f"  H Row: {info['h_row']}\n")
        f.write(f"  N Row: {info['n_row']}\n")
        f.write(f"  Total Dementia Rows: {info['sample_count']}\n")
        f.write("  Samples:\n")
        for idx, row in info['samples']:
            f.write(f"    Row {idx}: {row}\n")
        f.write("\n" + "="*80 + "\n\n")

print(f"Done. Found {len(dementia_files)} files containing dementia products.")
