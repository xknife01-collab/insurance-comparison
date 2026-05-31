import pandas as pd
import warnings
import io

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_45.xls"

try:
    df = pd.read_excel(filepath, engine='xlrd', header=None)
except Exception:
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    for enc in ['cp949', 'euc-kr', 'utf-8']:
        try:
            raw_text = raw_bytes.decode(enc)
            if '<table' in raw_text.lower():
                frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                if frames:
                    df = frames[0]
                    break
        except Exception:
            continue

# Show rows for (무)New간편요양보험2506(3종)
lines = []
for i in range(len(df)):
    row = [str(v) if str(v) != 'nan' else '' for v in df.iloc[i].tolist()]
    if any("New간편요양" in v for v in row):
        lines.append(f"Row {i}: {row[:10]}")

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\db_premium_debug.txt", "w", encoding="utf-8") as f_out:
    f_out.write('\n'.join(lines))
print("Exported.")
