import os
import pandas as pd
import io
import warnings
import xlrd
import glob

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    # Try reading as binary excel with cp949 override first
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "xlrd_cp949"
    except Exception as e_cp949:
        try:
            return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd"
        except Exception as e_xlrd:
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
                                return frames[0], f"html_{enc}"
                    except Exception:
                        continue
            except Exception as e_html:
                pass
    return None, "failed"

def inspect_all():
    files = sorted(glob.glob(os.path.join(SOURCE_DIR, "*.xls")))
    print(f"Total xls files found: {len(files)}")
    
    pension_files = []
    
    for filepath in files:
        filename = os.path.basename(filepath)
        df, method = load_df(filepath)
        if df is None:
            print(f"[-] {filename}: Loading failed")
            continue
            
        # Search for product names or cells containing '연금저축' or '연금'
        found_keywords = False
        sample_products = []
        
        for col in df.columns:
            col_vals = df[col].dropna().astype(str).tolist()
            for v in col_vals:
                if '연금' in v or '연금저축' in v:
                    found_keywords = True
                    # Try to capture sample product name
                    if len(v) > 5 and '원' not in v and '%' not in v:
                        sample_products.append(v)
        
        if found_keywords:
            pension_files.append((filename, method, list(set(sample_products))[:3], len(df)))
            
    print(f"\nFound {len(pension_files)} files containing pension keywords out of {len(files)} files:")
    for fn, method, samples, rows in pension_files:
        print(f"  - {fn} ({method}, rows: {rows}): samples={samples}")

if __name__ == "__main__":
    inspect_all()
