import os
import io
import re
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd"
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
    
    html_files = []
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None or not method.startswith("html"):
            continue
            
        # Check if it has comprehensive products
        has_comp = False
        num_cols = len(df.columns)
        for idx, row in df.iterrows():
            for col_idx in range(min(5, num_cols)):
                val = clean_val(row.iloc[col_idx])
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    if not any(ek in val for ek in exclude_kws):
                        has_comp = True
                        break
            if has_comp:
                break
                
        if has_comp:
            html_files.append((filename, df.shape))
            
    print(f"Total HTML comprehensive files found: {len(html_files)}")
    for filename, shape in html_files:
        print(f"File: {filename} | Shape: {shape}")
        # Print first 10 rows to inspect headers/cycles
        filepath = os.path.join(SOURCE_DIR, filename)
        df, _ = load_df(filepath)
        print("  - Rows 0 to 5:")
        for idx in range(min(5, len(df))):
            row_str = " | ".join([clean_val(v) for v in df.iloc[idx].tolist()[:10]])
            print(f"    Row {idx}: {row_str[:120]}")
            
if __name__ == "__main__":
    main()
