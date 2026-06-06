import os
import io
import pandas as pd
import sys
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
            
    yearly_products = []
    for hf in html_files:
        filepath = os.path.join(SOURCE_DIR, hf)
        df = load_html_df(filepath)
        if df is None:
            continue
            
        current_product = None
        for idx in range(df.shape[0]):
            row = df.iloc[idx]
            prod_val = str(row.iloc[1]).strip() if df.shape[1] > 1 else ""
            if prod_val and prod_val != "nan" and prod_val != "상품명":
                current_product = prod_val
                
            if current_product:
                row_str = " ".join(str(v) for v in row.dropna())
                if "연납" in row_str or "1년납" in row_str or "연보험료" in row_str:
                    yearly_products.append((hf, current_product, row_str))
                    
    unique_yearly = {}
    for hf, prod, text in yearly_products:
        if prod not in unique_yearly:
            unique_yearly[prod] = (hf, text)
            
    print(f"Yearly products found in HTML files: {len(unique_yearly)}")
    for prod, (hf, text) in sorted(unique_yearly.items()):
        print(f"File: {hf} | Product: {prod}")
        # print snippet containing 연납 or 1년납
        for kw in ["연납", "1년납", "연보험료"]:
            pos = text.find(kw)
            if pos != -1:
                print(f"  Snippet: ...{text[max(0, pos-40):min(len(text), pos+60)].strip()}...")
                break

if __name__ == "__main__":
    main()
