import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"c:\Users\zkfnt\Desktop\insurance-comparison-main"

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def scan():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    products_by_file = {}
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df = None
        try:
            try:
                df = pd.read_excel(filepath, engine='xlrd', header=None)
            except Exception as e:
                raw_bytes = open(filepath, 'rb').read()
                for enc in ['cp949', 'euc-kr', 'utf-8']:
                    try:
                        raw_text = raw_bytes.decode(enc)
                        if '<table' in raw_text.lower():
                            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                            if frames:
                                df = frames[0]
                                break
                    except:
                        continue
            
            if df is None:
                continue
                
            prod_col = 1
            for i in range(min(20, len(df))):
                row = [clean_val(v) for v in df.iloc[i].tolist()]
                for col_idx, val in enumerate(row):
                    if "상품명" in val:
                        prod_col = col_idx
                        break
            
            for idx, row in df.iterrows():
                row_list = [clean_val(v) for v in row.tolist()]
                if prod_col < len(row_list):
                    product_name = str(row_list[prod_col]).strip()
                    if product_name and len(product_name) > 3 and "상품명" not in product_name:
                        if filename not in products_by_file:
                            products_by_file[filename] = set()
                        products_by_file[filename].add(product_name)
        except Exception as e:
            pass

    out_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\all_products.txt"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"Total files with products: {len(products_by_file)}\n\n")
        for fn in sorted(products_by_file.keys()):
            f.write(f"File: {fn}\n")
            for prod in sorted(list(products_by_file[fn])):
                f.write(f"  - {prod}\n")
            f.write("\n")
            
    print(f"Done! Written to {out_path}")

if __name__ == "__main__":
    scan()
