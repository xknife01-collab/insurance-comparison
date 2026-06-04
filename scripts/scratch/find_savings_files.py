import os
import glob
import pandas as pd
import xlrd
import warnings
import io

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "xlrd"
    except Exception:
        pass
        
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['utf-8', 'cp949', 'euc-kr']:
            try:
                raw_text = raw_bytes.decode(enc, errors='replace')
                if '<table' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        return frames[0], f"html_{enc}"
            except Exception:
                continue
    except Exception:
        pass
    return None, None

def main():
    files = sorted(glob.glob(os.path.join(SOURCE_DIR, "*.xls")))
    print(f"Total .xls files: {len(files)}")
    
    savings_files = []
    
    for filepath in files:
        filename = os.path.basename(filepath)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        # Scan product names (usually column 1 or 2)
        # Let's search all cells for general savings keywords
        has_savings = False
        sample_products = []
        for r_idx, row in df.iterrows():
            for c_idx, val in enumerate(row):
                val_str = str(val).strip()
                if "저축보험" in val_str or "저축성" in val_str:
                    # But exclude pension, variable, whole life keywords unless it's a specific general savings product
                    if not any(k in val_str for k in ["연금저축", "연금보험", "변액", "종신"]):
                        has_savings = True
                        sample_products.append(val_str)
        
        if has_savings:
            savings_files.append((filename, method, df.shape, list(set(sample_products))[:5]))
            
    print("\n--- Identified General Savings Files ---")
    for fn, method, shape, samples in savings_files:
        print(f"File: {fn} | Method: {method} | Shape: {shape}")
        print(f"  Samples: {samples}")

if __name__ == "__main__":
    main()
