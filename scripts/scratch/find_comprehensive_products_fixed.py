import os
import io
import re
import pandas as pd
import warnings
import sys

# Ensure stdout handles Korean and special characters properly
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
OUT_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None)
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
                            return frames[0]
                except Exception:
                    continue
        except Exception:
            pass
    return None

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Found {len(files)} files.")
    
    comp_products = []
    
    # We want to identify health/comprehensive products
    exclude_kws = ["실손", "치아", "치과", "펫", "운전자", "자동차", "어린이", "자녀", "태아", "정기", "종신", "치매", "간병", "골프", "화재", "연금", "저축", "변액", "용종", "신용", "홀인원"]
    
    for filename in sorted(files, key=lambda x: int(re.search(r'\d+', x).group()) if re.search(r'\d+', x) else 0):
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        num_cols = len(df.columns)
        products_in_file = set()
        for idx, row in df.iterrows():
            for col_idx in range(min(5, num_cols)):
                val = clean_val(row.iloc[col_idx])
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    if any(ek in val for ek in exclude_kws):
                        continue
                    p_name = val.split("\n")[0].strip()
                    products_in_file.add(p_name)
                    
        for p in sorted(products_in_file):
            comp_products.append({
                "filename": filename,
                "product": p
            })
            
    print(f"Found {len(comp_products)} comprehensive product entries.")
    
    # Save to report
    out_path = os.path.join(OUT_DIR, "comprehensive_products.txt")
    with open(out_path, "w", encoding="utf-8") as f:
        for entry in comp_products:
            f.write(f"File: {entry['filename']} | Product: {entry['product']}\n")
    print(f"Saved report to: {out_path}")
            
if __name__ == "__main__":
    main()
