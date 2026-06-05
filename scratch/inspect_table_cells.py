import io
import pandas as pd

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_1.xls"

with open(filepath, 'rb') as f:
    raw_bytes = f.read()

raw_text = raw_bytes.decode('utf-8')
frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
df = frames[0]

# Search for rows where any cell contains '주기'
for r_idx in range(len(df)):
    row_list = df.iloc[r_idx].astype(str).tolist()
    row_str = " | ".join(row_list)
    if '주기' in row_str:
        print(f"Row {r_idx} has '주기':")
        print(row_str[:200])

# Let's print rows that contain the name of the product or some sample rows
print("\nFirst 10 rows:")
for i in range(min(15, len(df))):
    print(f"Row {i}:", df.iloc[i].astype(str).tolist()[:8])
