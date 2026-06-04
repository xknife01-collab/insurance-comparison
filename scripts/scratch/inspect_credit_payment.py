import os
import pandas as pd
import warnings
import io
import xlrd
warnings.filterwarnings('ignore')

dir_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(dir_path) if f.endswith('.xls')]

target_products = [
    "삼성 인생금융 대출안심보험",
    "삼성 상생금융 대출안심보험",
    "무배당 e수술보장 대출상환 신용보험",
    "신한진심을품은대출안심보장보험",
    "신용보험",
    "더세이프 대출안심보험",
    "대출안심 보장보험",
    "대출안심 정기보험",
    "대출안심보장보험"
]

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
    
    for r_idx, row in df.iterrows():
        row_vals = [str(v).strip() for v in row.tolist()]
        # Check if product name column matches (usually col 1 or 2)
        prod_candidate = ""
        if len(row_vals) > 1:
            prod_candidate = row_vals[1]
        if len(row_vals) > 2 and not prod_candidate:
            prod_candidate = row_vals[2]
            
        is_target = False
        matched_prod = ""
        for tp in target_products:
            if tp in prod_candidate or tp in "".join(row_vals):
                is_target = True
                matched_prod = tp
                break
                
        if is_target:
            matched_rows.append({
                "filename": filename,
                "method": method,
                "row_idx": r_idx,
                "row_vals": row_vals
            })

out_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\inspect_credit_payment.txt"
with open(out_path, 'w', encoding='utf-8') as out_f:
    out_f.write(f"Matched {len(matched_rows)} rows\n")
    for r in matched_rows:
        out_f.write(f"\nFile: {r['filename']} | Row: {r['row_idx']} | Col count: {len(r['row_vals'])}\n")
        out_f.write(f"Values: {r['row_vals']}\n")

print("Saved inspection output to inspect_credit_payment.txt")
