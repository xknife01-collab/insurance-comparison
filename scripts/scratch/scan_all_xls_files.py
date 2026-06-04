import os
import io
import pandas as pd
import warnings
import json

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def clean_val(v):
    if pd.isna(v) or v is None: return ""
    val_str = str(v).replace('\n', ' ').strip()
    if val_str.endswith(".0"):
        part = val_str[:-2]
        if part.replace("-", "", 1).isdigit():
            return part
    return val_str

def load_df(filepath):
    # Try reading with xlrd
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd"
    except Exception as e:
        pass
        
    # Try reading as HTML
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
    except Exception as e:
        pass
        
    return None, None

def scan_files():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total XLS files: {len(files)}")
    
    results = {}
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        
        if df is None:
            print(f"[FAILED] {filename}")
            results[filename] = {"status": "failed", "method": None, "products": []}
            continue
            
        # Find product name column
        prod_col = -1
        header_row_idx = -1
        
        for i in range(min(20, len(df))):
            row = [clean_val(v) for v in df.iloc[i].tolist()]
            if any("상품명" in val or "보험사" in val or "회사명" in val for val in row):
                header_row_idx = i
                for col_idx, val in enumerate(row):
                    v = val.replace(" ", "").replace("\n", "")
                    if "상품명" in v:
                        prod_col = col_idx
                        break
                break
        
        if prod_col == -1:
            prod_col = 1 # default fallback
            
        products = set()
        for idx, row in df.iterrows():
            if idx <= header_row_idx:
                continue
            row_list = [clean_val(v) for v in row.tolist()]
            if prod_col < len(row_list):
                pname = row_list[prod_col].strip()
                if pname and pname != "상품명" and len(pname) >= 2:
                    products.add(pname)
                    
        print(f"[SUCCESS] {filename} ({method}) - {len(products)} unique products")
        results[filename] = {
            "status": "success",
            "method": method,
            "products": sorted(list(products))
        }
        
    # Filter files containing target keywords
    variable_term_files = {}
    for fname, data in results.items():
        if data["status"] == "success":
            matched = [p for p in data["products"] if "변액" in p or "정기" in p]
            if matched:
                variable_term_files[fname] = {
                    "method": data["method"],
                    "matched_products": matched
                }
                
    print("\n=== FILES CONTAINING '변액' OR '정기' ===")
    for fname, info in sorted(variable_term_files.items()):
        print(f"{fname} ({info['method']}):")
        for p in info['matched_products']:
            print(f"  - {p}")
            
    # Write to a JSON for reference
    with open("scan_results.json", "w", encoding="utf-8") as f:
        json.dump(variable_term_files, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    scan_files()
