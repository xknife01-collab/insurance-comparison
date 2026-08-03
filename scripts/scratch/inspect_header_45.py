import pandas as pd
import warnings

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_45.xls"

df = pd.read_excel(filepath, engine='xlrd', header=None)
lines = []
for idx, row in df.iterrows():
    row_list = [str(v) for v in row.tolist()]
    if any("상품명" in val or "보험사" in val or "회사명" in val for val in row_list):
        lines.append(f"Header at row {idx}:")
        for c_idx, val in enumerate(row):
            lines.append(f"Col {c_idx}: {val}")
        break

with open("header_45.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
