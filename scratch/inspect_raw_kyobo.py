import pandas as pd
import io

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\file_16.xls"
filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\file_16.xls"
df = None
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

if df is not None:
    # search rows containing '올바른 성장보험'
    for idx, row in df.iterrows():
        row_str = str(row.tolist())
        if '올바른 성장보험' in row_str:
            print(f"Row {idx}: {row.tolist()[:10]}")
