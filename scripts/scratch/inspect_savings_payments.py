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
    
    for filepath in files:
        filename = os.path.basename(filepath)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        all_text = " ".join([str(v) for idx, r in df.iterrows() for v in r.dropna().tolist()])
        
        # Filter for general savings
        has_savings = "저축" in all_text or "저축" in filename
        has_pension = "연금" in all_text or "연금" in filename
        has_variable = "변액" in all_text or "변액" in filename
        
        is_general_savings = False
        if has_savings and not has_variable and not has_pension:
            is_general_savings = True
        if any(k in filename for k in ['저축성_상품비교', '장기저축성']):
            is_general_savings = True
            
        if is_general_savings:
            print(f"File: {filename} (Shape: {df.shape}, Method: {method})")
            
            # Let's inspect unique values of potential columns that describe payment cycle
            # For 26 columns (HTML), column 21 is payment cycle
            if df.shape[1] == 26:
                unique_vals = df[21].unique().tolist()
                print(f"  Col 21 unique values: {unique_vals}")
                # Also print the first few rows of product name + payment cycle
                print(df[[0, 1, 2, 21]].drop_duplicates().head(5))
            else:
                # For binary excel (shape 14), let's see which column contains payment cycle or if it is inside details
                # Let's look at the sheet structure
                print(f"  Binary excel columns: {df.shape[1]}")
                print(df.head(10))
            print("="*60)

if __name__ == "__main__":
    main()
