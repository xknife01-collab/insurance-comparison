import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_10.xls"

with open(filepath, 'rb') as f:
    raw_bytes = f.read()

for enc in ['utf-8', 'cp949', 'euc-kr']:
    try:
        raw_text = raw_bytes.decode(enc)
        if '<table' in raw_text.lower():
            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
            if frames:
                df = frames[0]
                print(f"Shape: {df.shape}")
                print("\n0~5행:")
                for i in range(6):
                    row = [str(v) if str(v) != 'nan' else '' for v in df.iloc[i].tolist()]
                    print(f"  행{i}: {row}")
                break
    except Exception as e:
        print(f"Error: {e}")
