import os
import pandas as pd
import io
import xlrd
import sys
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    # Try reading as binary excel with cp949 override
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "binary"
    except Exception:
        # Fallback to standard pd.read_excel
        try:
            df = pd.read_excel(filepath, engine='xlrd', header=None)
            return df, "binary_std"
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
                                return frames[0], "html"
                    except Exception:
                        continue
            except Exception:
                pass
    return None, None

def inspect_all_files():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total files: {len(files)}")
    
    property_keywords = ["재물", "화재", "재산", "성공메이트", "소상공인", "비즈니스", "biz", "하우스", "우리집", "사업장"]
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, ftype = load_df(filepath)
        if df is None:
            continue
            
        # Inspect first 15 rows for product names
        products = set()
        has_property_kw = False
        
        # We also check for payment cycle keywords in the entire sheet
        payment_cycle_info = []
        for col in df.columns:
            for idx, val in df[col].dropna().items():
                val_str = str(val)
                if any(kw in val_str for kw in property_keywords):
                    has_property_kw = True
                if any(kw in val_str for kw in ["월납", "연납", "1년납", "연보험료", "월보험료", "납입주기"]):
                    payment_cycle_info.append(val_str)
                    
        if has_property_kw:
            # Let's extract unique product names in this file
            # Usually product names are in column 2 (index 2) or similar
            # Let's collect all non-empty values from column 1 or 2
            possible_cols = [1, 2]
            for c in possible_cols:
                if c < len(df.columns):
                    for v in df[c].dropna().unique():
                        v_str = str(v).strip()
                        if len(v_str) > 5 and any(kw in v_str for kw in property_keywords + ["보험"]):
                            products.add(v_str)
            
            print(f"\n[+] File: {filename} ({ftype})")
            print(f"    Products found: {sorted(list(products))}")
            print(f"    Payment cycle cues: {list(set(payment_cycle_info))[:5]}")

if __name__ == "__main__":
    inspect_all_files()
