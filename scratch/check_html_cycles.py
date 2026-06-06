import os
import io
import pandas as pd
import sys
import re
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_html_df(filepath):
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

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    html_files = []
    for f in sorted(files):
        filepath = os.path.join(SOURCE_DIR, f)
        try:
            with open(filepath, 'rb') as file_obj:
                head = file_obj.read(100)
                if b'<table' in head.lower() or b'<html' in head.lower():
                    html_files.append(f)
        except Exception:
            pass
            
    print(f"Total HTML files to scan: {len(html_files)}")
    
    results = []
    for hf in html_files:
        filepath = os.path.join(SOURCE_DIR, hf)
        df = load_html_df(filepath)
        if df is None:
            continue
            
        # Let's search each row to identify products and check payment cycles
        # Product name is typically in column 1
        # Let's iterate over rows to find product names and check for "월납", "연납", "1년납", "일시납"
        current_product = None
        for idx in range(df.shape[0]):
            row = df.iloc[idx]
            prod_val = str(row.iloc[1]).strip() if df.shape[1] > 1 else ""
            if prod_val and prod_val != "nan" and prod_val != "상품명":
                current_product = prod_val
                
            if current_product:
                row_str = " ".join(str(v) for v in row.dropna())
                
                # Check for cycle keywords
                cycle = "Unknown"
                if "월납" in row_str:
                    cycle = "월납"
                elif "연납" in row_str or "1년납" in row_str or "연보험료" in row_str:
                    cycle = "연납/1년납"
                elif "일시납" in row_str:
                    cycle = "일시납"
                    
                results.append({
                    "file": hf,
                    "product": current_product,
                    "row_str": row_str,
                    "cycle": cycle
                })
                
    # Group results by product to determine final cycle
    product_cycles = {}
    for r in results:
        prod = r["product"]
        cycle = r["cycle"]
        if prod not in product_cycles:
            product_cycles[prod] = {"files": set(), "cycles": set(), "sample_text": ""}
        product_cycles[prod]["files"].add(r["file"])
        if cycle != "Unknown":
            product_cycles[prod]["cycles"].add(cycle)
        # Store a sample text containing cycle cues if possible
        if any(kw in r["row_str"] for kw in ["월납", "연납", "1년납", "일시납"]):
            product_cycles[prod]["sample_text"] = r["row_str"]
            
    print(f"\nFound {len(product_cycles)} unique products in HTML files:")
    for prod, info in sorted(product_cycles.items()):
        cycles_list = list(info["cycles"])
        files_list = sorted(list(info["files"]))
        print(f"Product: {prod}")
        print(f"  Files: {files_list}")
        print(f"  Cycles detected: {cycles_list}")
        if info["sample_text"]:
            # Find snippet of cycle cue
            snippet = ""
            for kw in ["월납", "연납", "1년납", "일시납", "납입주기"]:
                pos = info["sample_text"].find(kw)
                if pos != -1:
                    snippet = info["sample_text"][max(0, pos-40):min(len(info["sample_text"]), pos+60)]
                    break
            print(f"  Cue snippet: ...{snippet.strip()}...")
        print("-" * 40)

if __name__ == "__main__":
    main()
