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
            for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-16']:
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
    
    html_count = 0
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None or not method.startswith("html"):
            continue
            
        # Check if it has comprehensive products
        comp_prods = set()
        num_cols = len(df.columns)
        for idx, row in df.iterrows():
            row_vals = [clean_val(v) for v in row.tolist()]
            for col_idx in range(min(5, num_cols)):
                val = row_vals[col_idx]
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    if not any(ek in val for ek in exclude_kws):
                        comp_prods.add(val)
                        
        if not comp_prods:
            continue
            
        html_count += 1
        print(f"\n[{html_count}] File: {filename} ({method}) | Shape: {df.shape}")
        print(f"Products: {list(comp_prods)[:2]}")
        
        # Look for payment cycles or intervals
        # Print column indices and values that contain 납입 or 주기 or 월 or 연
        for idx, row in df.iterrows():
            row_vals = [clean_val(v) for v in row.tolist()]
            # Search in the first 10 rows (header area)
            if idx < 10:
                for col_idx, val in enumerate(row_vals):
                    if any(kw in val for kw in ["주기", "납입", "월납", "연납", "년납"]):
                        print(f"  Header Row {idx}, Col {col_idx}: {val}")
            # Search in general rows
            if idx >= 10:
                for col_idx, val in enumerate(row_vals):
                    if val in ["월납", "연납", "일시납", "년납"]:
                        print(f"  Row {idx}, Col {col_idx}: {val}")

if __name__ == "__main__":
    main()
