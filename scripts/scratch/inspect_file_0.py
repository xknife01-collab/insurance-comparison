import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_0.xls"

try:
    df = pd.read_excel(filepath, engine='xlrd', header=None)
    print("Loaded with xlrd successfully")
except Exception as e:
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    for enc in ['cp949', 'euc-kr', 'utf-8']:
        try:
            raw_text = raw_bytes.decode(enc)
            if '<table' in raw_text.lower():
                frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                if frames:
                    df = frames[0]
                    print(f"Loaded with {enc} pd.read_html")
                    break
        except Exception:
            continue

lines = []
for i in range(min(15, len(df))):
    row_str = " | ".join([str(v).strip().replace('\n', ' ') for v in df.iloc[i].tolist()])
    lines.append(f"Row {i}: {row_str}")

with open("first_rows_0.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print("Done")
