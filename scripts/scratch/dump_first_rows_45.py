import pandas as pd
import warnings

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_45.xls"

df = pd.read_excel(filepath, engine='xlrd', header=None)
lines = []
for i in range(15):
    row = df.iloc[i].tolist()
    row_str = " | ".join([str(v) for v in row])
    lines.append(f"Row {i}: {row_str}")

with open("first_rows_45.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print("Done")
