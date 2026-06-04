import os
import glob
import pandas as pd
import io
import xlrd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "xlrd"
    except Exception:
        pass
        
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd_default"
    except Exception:
        pass
        
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['utf-8', 'cp949', 'euc-kr']:
            try:
                raw_text = raw_bytes.decode(enc, errors='replace')
                if '<table' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        return frames[0], f"html_{enc}"
            except Exception:
                continue
    except Exception:
        pass
        
    return None, None

def inspect():
    files = sorted(glob.glob(os.path.join(SOURCE_DIR, "*.xls")))
    print(f"Total .xls files: {len(files)}")
    
    savings_files = []
    for filepath in files:
        filename = os.path.basename(filepath)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        content_str = ""
        for idx, row in df.iterrows():
            content_str += " " + " ".join([str(v) for v in row.dropna().tolist()])
            
        # Detect if it is savings insurance
        # General savings insurance keywords: '저축보험', '저축성'
        # Exclude: '연금', '변액', '보장성', '종신', '실손', '간병', '치매', '골프'
        is_savings = False
        if any(k in filename or k in content_str for k in ['저축보험', '저축성']):
            if not any(x in filename or x in content_str for x in ['연금', '변액', '보장성', '종신', '실손', '치매', '간병']):
                is_savings = True
                
        # Also let's keep track if '저축' is present at all
        if is_savings:
            savings_files.append((filename, method, df.shape))
            print(f"FOUND SAVINGS FILE: {filename} | shape: {df.shape} | method: {method}")
            # Print first 5 rows to see what it looks like
            print(df.head(5))
            print("-" * 50)
            
    print(f"Total savings files found: {len(savings_files)}")

if __name__ == "__main__":
    inspect()
