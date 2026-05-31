import os
import pandas as pd
import io
import warnings
import xlrd
import glob

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
OUT_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\pension_layouts.txt"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "xlrd"
    except Exception:
        try:
            return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd_default"
        except Exception:
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
    return None, "failed"

def analyze():
    files = sorted(glob.glob(os.path.join(SOURCE_DIR, "*.xls")))
    results = []
    
    for filepath in files:
        filename = os.path.basename(filepath)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        # Check if file has pension data
        has_pension = False
        sample_prod = ""
        companies = set()
        
        for idx, row in df.iterrows():
            row_str = " ".join([str(v) for v in row.dropna().tolist()])
            if '연금저축' in row_str or '연금보험' in row_str:
                has_pension = True
                
        if not has_pension:
            continue
            
        # Try to find header rows
        header_rows = []
        for r_idx in range(min(15, len(df))):
            row_vals = [str(x).strip() for x in df.iloc[r_idx].tolist()]
            if any("상품명" in x or "회사명" in x or "보험회사" in x for x in row_vals):
                header_rows.append((r_idx, row_vals))
                
        results.append({
            "filename": filename,
            "method": method,
            "shape": df.shape,
            "headers": header_rows
        })
        
    with open(OUT_PATH, 'w', encoding='utf-8') as out_f:
        out_f.write(f"Found {len(results)} pension files:\n\n")
        for res in results:
            out_f.write(f"File: {res['filename']} | Shape: {res['shape']} | Method: {res['method']}\n")
            out_f.write("Headers found:\n")
            for r_idx, h in res['headers']:
                out_f.write(f"  Row {r_idx}: {h[:15]}\n")
            out_f.write("-" * 85 + "\n")

if __name__ == "__main__":
    analyze()
