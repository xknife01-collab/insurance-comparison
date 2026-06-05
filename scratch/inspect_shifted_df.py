import os
import pandas as pd
import io
import warnings
import xlrd

warnings.filterwarnings('ignore')

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

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
df_raw = load_df(filepath)
cleaned_rows = []
for idx, row in df_raw.iterrows():
    row_list = [clean_val(v) for v in row.tolist()]
    if not any(row_list):
        continue
    # If column A is completely empty but column B has values, shift left by 1 column
    if len(row_list) > 1 and row_list[0] == "" and row_list[1] != "":
        row_list = row_list[1:] + [""]
    cleaned_rows.append(row_list)
    
df = pd.DataFrame(cleaned_rows)
print(f"df shape: {df.shape}")
for i in range(min(15, len(df))):
    print(f"Row {i:02d}: {df.iloc[i].tolist()[:8]}")
