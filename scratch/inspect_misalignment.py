import os
import pandas as pd
import io
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data)
    except Exception:
        try:
            return pd.read_excel(filepath, engine='xlrd', header=None)
        except Exception:
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

def inspect_rows():
    target_files = ["file_12.xls", "file_15.xls", "file_47.xls", "file_49.xls"]
    for fn in target_files:
        filepath = os.path.join(SOURCE_DIR, fn)
        df = load_df(filepath)
        if df is None:
            print(f"Failed to load {fn}")
            continue
            
        print(f"\n==================== FILE: {fn} ====================")
        print(f"Shape: {df.shape}")
        for i in range(min(15, len(df))):
            row = [clean_val(v) for v in df.iloc[i].tolist()]
            print(f"Row {i:02d}: {row[:10]}")

if __name__ == "__main__":
    inspect_rows()
