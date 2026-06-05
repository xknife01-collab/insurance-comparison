import os
import pandas as pd
import io
import warnings
from bs4 import BeautifulSoup

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
OUTPUT_FILE = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\all_products.txt"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd"
    except Exception:
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-8-sig']:
                try:
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower() or '<html' in raw_text.lower():
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

def inspect_all():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    unique_products = set()
    product_mapping = {}
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            print(f"Failed to read: {filename}")
            continue
            
        # Find product name column
        prod_col = 1
        for i in range(min(25, len(df))):
            row = [clean_val(v) for v in df.iloc[i].tolist()]
            if any("상품명" in val for val in row):
                for col_idx, val in enumerate(row):
                    if "상품명" in val.replace(" ", ""):
                        prod_col = col_idx
                        break
                break
                
        # Extract product names
        file_products = set()
        for idx, row in df.iterrows():
            row_list = [clean_val(v) for v in row.tolist()]
            if prod_col < len(row_list):
                val = row_list[prod_col]
                if val and val != "상품명" and len(val) > 1:
                    file_products.add(val)
                    unique_products.add(val)
                    
        product_mapping[filename] = (method, file_products)
        
    # Write to file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write(f"Total files: {len(files)}\n")
        out.write(f"Total unique products: {len(unique_products)}\n\n")
        
        out.write("--- UNIQUE PRODUCTS LIST ---\n")
        for prod in sorted(list(unique_products)):
            out.write(f"- {prod}\n")
            
        out.write("\n\n--- FILE BY FILE DETAILS ---\n")
        for fn in sorted(product_mapping.keys()):
            method, prods = product_mapping[fn]
            out.write(f"[{fn}] (method={method}, count={len(prods)})\n")
            for p in sorted(list(prods)):
                out.write(f"  - {p}\n")
            out.write("\n")

if __name__ == "__main__":
    inspect_all()
    print("Done!")
