import os
import pandas as pd
import io
import re
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"c:\Users\zkfnt\Desktop\insurance-comparison-main"

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def scan():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total files: {len(files)}")
    
    product_names = set()
    
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
                
            # Search first 20 rows for product name column
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
                        product_names.add((product_name, filename))
        except Exception as e:
            pass

    print(f"Found {len(product_names)} unique products:")
    for prod, fn in sorted(list(product_names)):
        # Let's print if it has child-related keywords or pre-existing keywords
        is_child = any(k in prod for k in ["어린이", "자녀", "태아", "꿈나무", "신생아", "아이", "청소년"])
        is_sick = any(k in prod for k in ["유병", "간편", "3.2.5", "3.3.5", "3.5.5", "심사", "경증", "간편고지", "간편한"])
        if is_child:
            print(f"  [CHILD] {prod} ({fn}) (Sick: {is_sick})")

if __name__ == "__main__":
    scan()
