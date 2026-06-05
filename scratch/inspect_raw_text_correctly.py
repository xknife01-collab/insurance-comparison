import io
import pandas as pd

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_1.xls"

with open(filepath, 'rb') as f:
    raw_bytes = f.read()

raw_text = raw_bytes.decode('utf-8')
frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
df = frames[0]

output = []
for idx in range(len(df)):
    row = df.iloc[idx].astype(str).tolist()
    output.append(f"Row {idx}: " + " | ".join(row))

with open('scratch/heritage_raw_inspect.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(output))

print("Written raw rows to scratch/heritage_raw_inspect.txt")
