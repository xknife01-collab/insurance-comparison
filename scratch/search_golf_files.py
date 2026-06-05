import os
import pandas as pd
import io
import warnings
import xlrd
from bs4 import BeautifulSoup

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

GOLF_KEYWORDS = ["골프", "레저", "홀인원", "알바트로스", "카트", "golf", "leisure", "hole-in-one", "albatross", "오잘공", "상과염", "테니스엘보", "골프엘보"]

def load_df(filepath):
    # Try reading as binary excel with cp949 override
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data)
    except Exception:
        # Fallback to standard pd.read_excel
        try:
            return pd.read_excel(filepath, engine='xlrd', header=None)
        except Exception:
            # Fallback to HTML-saved excel parsing
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

def search_golf_files():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls") or f.endswith(".xlsx")]
    print(f"Scanning {len(files)} files for Golf/Leisure keywords...")
    
    matches = []
    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        # Check if any cell in any row contains golf keywords
        found = False
        match_count = 0
        product_names = set()
        
        for idx, row in df.iterrows():
            row_str = " ".join([clean_val(v) for v in row.tolist()]).lower()
            if any(k in row_str for k in GOLF_KEYWORDS):
                found = True
                match_count += 1
                # Try to capture product names (usually column 1 or index 1, 2)
                for v in row.tolist():
                    v_str = clean_val(v)
                    if "보험" in v_str and len(v_str) < 50:
                        product_names.add(v_str)
                        
        if found:
            matches.append((filename, match_count, list(product_names)[:3]))
            
    print(f"\nFound {len(matches)} files containing Golf/Leisure keywords:")
    for fn, count, prods in matches:
        print(f" - {fn} | Matches: {count} rows | Sample Products: {prods}")

if __name__ == "__main__":
    search_golf_files()
