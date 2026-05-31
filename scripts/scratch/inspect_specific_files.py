import pandas as pd
import xlrd
import io
import warnings

warnings.filterwarnings('ignore')

def inspect_file(filepath):
    print(f"=== Inspecting {filepath} ===")
    
    # 1. Try xlrd cp949
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        print("Loaded with xlrd (cp949 override). First 5 rows:")
        for r in range(min(5, sheet.nrows)):
            print([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return
    except Exception as e:
        print("xlrd failed:", e)
        
    # 2. Try HTML parsing with various encodings
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    
    for enc in ['cp949', 'euc-kr', 'utf-8']:
        try:
            raw_text = raw_bytes.decode(enc)
            if '<table' in raw_text.lower():
                frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                if frames:
                    print(f"Loaded as HTML with encoding {enc}. First 5 rows:")
                    df = frames[0]
                    for idx, row in df.head(5).iterrows():
                        print(row.tolist())
                    return
        except Exception as e:
            print(f"HTML parsing with {enc} failed:", e)

if __name__ == "__main__":
    inspect_file(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_35.xls")
    inspect_file(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_36.xls")
