import os
import pandas as pd
import io
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data)
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
                            return frames[0]
                except Exception:
                    continue
        except Exception:
            pass
    return None

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def search():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    keywords = ["여행", "해외", "국내", "유학", "관광", "레저"]
    
    found_products = {}
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        prod_col = 1
        for i in range(min(20, len(df))):
            row = [clean_val(v) for v in df.iloc[i].tolist()]
            if any("상품명" in val for val in row):
                for col_idx, val in enumerate(row):
                    if "상품명" in val.replace(" ", ""):
                        prod_col = col_idx
                        break
                break
                
        for idx, row in df.iterrows():
            row_list = [clean_val(v) for v in row.tolist()]
            if prod_col < len(row_list):
                prod_name = row_list[prod_col]
                if prod_name and prod_name != "상품명":
                    for kw in keywords:
                        if kw in prod_name:
                            if filename not in found_products:
                                found_products[filename] = set()
                            found_products[filename].add(prod_name)
                            break
                            
    if found_products:
        print(f"Found travel-related products in {len(found_products)} files:")
        for fn, prods in found_products.items():
            print(f"File: {fn} -> {list(prods)}")
    else:
        print("No travel-related product names found in any of the files.")

if __name__ == "__main__":
    search()
