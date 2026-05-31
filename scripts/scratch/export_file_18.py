import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_18.xls"

with open(filepath, 'rb') as f:
    raw_bytes = f.read()

for enc in ['utf-8', 'cp949', 'euc-kr']:
    try:
        raw_text = raw_bytes.decode(enc)
        if '<table' in raw_text.lower():
            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
            if frames:
                df = frames[0]
                lines = []
                for i in range(len(df)):
                    row = [str(v) if str(v) != 'nan' else '' for v in df.iloc[i].tolist()]
                    lines.append(f"Row {i}: {row[:10]}") # Show first 10 columns
                
                with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\file_18_rows.txt", "w", encoding="utf-8") as f_out:
                    f_out.write('\n'.join(lines))
                print("Exported successfully.")
                break
    except Exception as e:
        print(f"Error {enc}: {e}")
