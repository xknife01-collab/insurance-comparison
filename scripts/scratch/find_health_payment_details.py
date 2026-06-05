import os
import io
import re
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        wb = pd.read_excel(filepath, engine='xlrd', header=None)
        return wb, "xlrd"
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
                            return frames[0], f"html_{enc}"
                except Exception:
                    continue
        except Exception:
            pass
    return None, None

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    exclude_kws = ["실손", "치아", "치과", "펫", "운전자", "자동차", "어린이", "자녀", "태아", "정기", "종신", "치매", "간병", "골프", "화재", "연금", "저축", "변액", "용종", "신용", "홀인원"]
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        # Check if contains comprehensive health products
        comp_prods = []
        for idx, row in df.iterrows():
            row_vals = [clean_val(v) for v in row.tolist()]
            # Look at product name columns
            for col_idx in range(min(5, len(row_vals))):
                val = row_vals[col_idx]
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    if not any(ek in val for ek in exclude_kws):
                        comp_prods.append(val)
                        
        if not comp_prods:
            continue
            
        print(f"\n=========================================")
        print(f"File: {filename} ({method}) | Cols: {df.shape[1]}")
        print(f"Sample Products: {list(set(comp_prods))[:3]}")
        
        # Scan all rows and columns for payment-related text
        payment_terms = ["월납", "연납", "년납", "일시납", "납입주기", "납입방법"]
        found_cells = []
        for idx, row in df.iterrows():
            row_vals = [clean_val(v) for v in row.tolist()]
            for c_idx, val in enumerate(row_vals):
                if any(t in val for t in payment_terms):
                    found_cells.append((idx, c_idx, val))
                    
        if found_cells:
            print(f"Found payment cells: {found_cells[:10]}")
        else:
            print("No payment terms found in cells.")
            
if __name__ == "__main__":
    main()
