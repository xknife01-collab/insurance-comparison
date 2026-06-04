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

def main():
    files = sorted(glob.glob(os.path.join(SOURCE_DIR, "*.xls")))
    print(f"Total .xls files: {len(files)}")
    
    # We want to check all files and see if they contain '저축' or similar.
    # Let's print filename, size, first row content, and detected type.
    for filepath in files:
        filename = os.path.basename(filepath)
        df, method = load_df(filepath)
        if df is None:
            print(f"FAILED TO LOAD: {filename}")
            continue
            
        # Get first 3 rows as text to see what kind of sheet it is
        first_rows = []
        for idx, r in df.head(5).iterrows():
            row_str = " | ".join([str(v) for v in r.dropna().tolist()])
            if row_str.strip():
                first_rows.append(row_str)
                
        first_rows_txt = "\n  ".join(first_rows)[:400]
        
        # Check if '저축' appears anywhere in the sheet
        all_text = " ".join([str(v) for idx, r in df.iterrows() for v in r.dropna().tolist()])
        has_savings = "저축" in all_text
        has_pension = "연금" in all_text
        has_variable = "변액" in all_text
        
        print(f"File: {filename} | Shape: {df.shape} | Method: {method} | Has savings: {has_savings} | Has pension: {has_pension} | Has variable: {has_variable}")
        print(f"  First rows:\n  {first_rows_txt}")
        print("="*80)

if __name__ == "__main__":
    main()
