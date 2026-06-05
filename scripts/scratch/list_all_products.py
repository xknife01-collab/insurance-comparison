import os
import io
import re
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        # Try xlrd
        return pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception:
        # Try HTML
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['utf-8', 'euc-kr', 'cp949', 'utf-16']:
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
    
    out_path = os.path.join(SOURCE_DIR, "insurance-comparison-main", "scripts", "scratch", "all_products.txt")
    
    with open(out_path, "w", encoding="utf-8") as f_out:
        f_out.write("List of unique products found in each file:\n")
        f_out.write("=" * 80 + "\n")
        
        for filename in sorted(files):
            filepath = os.path.join(SOURCE_DIR, filename)
            df = load_df(filepath)
            if df is None:
                f_out.write(f"File: {filename} -> FAILED TO LOAD\n")
                f_out.write("-" * 80 + "\n")
                continue
                
            products_in_file = set()
            for idx, row in df.iterrows():
                for col_idx in range(min(5, len(row))):
                    val = clean_val(row.iloc[col_idx])
                    if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                        # Keep only the first line of text
                        p_name = val.split("\n")[0].strip()
                        # Clean up random spaces/junk
                        p_name = re.sub(r'\s+', ' ', p_name)
                        products_in_file.add(p_name)
                        
            f_out.write(f"File: {filename} | Shape: {df.shape} | Products count: {len(products_in_file)}\n")
            for p in sorted(list(products_in_file)):
                f_out.write(f"  - {p}\n")
            f_out.write("-" * 80 + "\n")
            
    print(f"Saved all products list to {out_path}")

if __name__ == "__main__":
    main()
