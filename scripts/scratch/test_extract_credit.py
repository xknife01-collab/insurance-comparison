import os
import pandas as pd
import warnings
import io
import xlrd
warnings.filterwarnings('ignore')

dir_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(dir_path) if f.endswith('.xls')]

credit_keywords = ["신용", "대출", "상환", "대출안심", "신용보험", "신용생명"]

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
                raw_text = raw_bytes.decode(enc)
                if '<table' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        return frames[0], f"html_{enc}"
            except Exception:
                continue
    except Exception:
        pass
    return None, None

matched_rows = []
for filename in files:
    full_path = os.path.join(dir_path, filename)
    df, method = load_df(full_path)
    if df is None:
        continue
    
    # Check all rows
    for r_idx, row in df.iterrows():
        row_vals = [str(v) for v in row.tolist()]
        row_str = " ".join(row_vals)
        for kw in credit_keywords:
            if kw in row_str:
                # Find product name
                prod_name = ""
                for c_val in row_vals:
                    if any(p in c_val for p in ["대출안심", "대출상환", "신용보험"]):
                        prod_name = c_val
                        break
                if not prod_name:
                    if len(row_vals) > 1:
                        prod_name = row_vals[1]
                
                matched_rows.append({
                    "filename": filename,
                    "method": method,
                    "row_idx": r_idx,
                    "prod_name": prod_name,
                    "row_vals": row_vals
                })
                break

out_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\test_extract_credit_out.txt"
with open(out_path, 'w', encoding='utf-8') as out_f:
    out_f.write(f"Matched {len(matched_rows)} rows\n")
    for r in matched_rows:
        out_f.write(f"\nFile: {r['filename']} | Method: {r['method']} | Row: {r['row_idx']}\n")
        out_f.write(f"Product Guess: {r['prod_name']}\n")
        out_f.write(f"Values: {r['row_vals']}\n")

print("Saved extract output to test_extract_credit_out.txt")
