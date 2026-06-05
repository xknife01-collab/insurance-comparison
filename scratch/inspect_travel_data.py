import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
OUTPUT_FILE = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\inspect_output.txt"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None)
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

def inspect_files():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write(f"Found {len(files)} .xls files in {SOURCE_DIR}\n\n")
        
        travel_count = 0
        for filename in files:
            filepath = os.path.join(SOURCE_DIR, filename)
            df = load_df(filepath)
            if df is None:
                out.write(f"Failed to read: {filename}\n")
                continue
                
            # Find product name column
            prod_col = 1
            for i in range(min(20, len(df))):
                row = [clean_val(v) for v in df.iloc[i].tolist()]
                if any("상품명" in val for val in row):
                    for col_idx, val in enumerate(row):
                        if "상품명" in val.replace(" ", ""):
                            prod_col = col_idx
                            break
                    break
                    
            # Gather unique products
            products = set()
            for idx, row in df.iterrows():
                row_list = [clean_val(v) for v in row.tolist()]
                if prod_col < len(row_list):
                    val = row_list[prod_col]
                    if val and val != "상품명":
                        products.add(val)
            
            # Find travel products
            travel_found = []
            for p in products:
                if any(kw in p for kw in ["여행", "해외", "국내", "유학", "워킹", "출장"]):
                    travel_found.append(p)
                    
            if travel_found:
                travel_count += 1
                out.write(f"[{filename}] - Travel products found:\n")
                for tp in travel_found:
                    out.write(f"  - {tp}\n")
            else:
                # Write some sample products for reference
                sample_prods = list(products)[:3]
                out.write(f"[{filename}] - No travel products. Samples: {sample_prods}\n")
                
        out.write(f"\nTotal files with travel insurance products: {travel_count}\n")

if __name__ == "__main__":
    inspect_files()
