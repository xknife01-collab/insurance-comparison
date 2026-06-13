import os
import xlrd
import pandas as pd
import io
import sys

# Set output to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]

target_companies = ["흥국", "푸본", "교보", "하나"]

def clean_cell(c):
    if c is None or pd.isna(c): return ""
    return str(c).strip()

for filename in sorted(files):
    if not ("보장성_상품비교" in filename or "변액_보장성" in filename):
        continue
    filepath = os.path.join(SOURCE_DIR, filename)
    try:
        book = xlrd.open_workbook(filepath, logfile=open(os.devnull, 'w'))
        sheet = book.sheet_by_index(0)
        
        for rx in range(sheet.nrows):
            row = [clean_cell(sheet.cell_value(rx, cx)) for cx in range(sheet.ncols)]
            row_str = " | ".join(row)
            if any(tc in row_str for tc in target_companies):
                if any(k in row_str for k in ["정기"]):
                    print(f"[{filename}] Row {rx}: {row_str}")
    except Exception:
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['utf-8', 'cp949', 'euc-kr']:
                try:
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                        if frames:
                            df = frames[0]
                            for rx, r in df.iterrows():
                                r_list = [clean_cell(v) for v in r.tolist()]
                                row_str = " | ".join(r_list)
                                if any(tc in row_str for tc in target_companies):
                                    if any(k in row_str for k in ["정기"]):
                                        print(f"[{filename} (html_{enc})] Row {rx}: {row_str}")
                            break
                except Exception:
                    continue
        except Exception:
            pass
