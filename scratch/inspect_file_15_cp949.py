import pandas as pd
import io

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_15.xls"

with open(path, "rb") as f:
    raw_bytes = f.read()

# Decode as cp949 with replace
decoded_text = raw_bytes.decode('cp949', errors='replace')
frames = pd.read_html(io.StringIO(decoded_text), flavor='bs4')
df = frames[0]

# Find product name column
prod_col = 1
for idx, row in df.iterrows():
    row_list = [str(v).strip() for v in row.tolist() if not pd.isna(v)]
    if any("상품명" in val for val in row_list):
        for col_idx, val in enumerate(row_list):
            if "상품명" in val.replace(" ", ""):
                prod_col = col_idx
                break
        break

products = set()
for idx, row in df.iterrows():
    row_list = [str(v).strip() for v in row.tolist()]
    if prod_col < len(row_list):
        val = row_list[prod_col]
        if val and val != "상품명" and "nan" not in val:
            products.add(val)

output = []
output.append("Products when decoded as CP949:")
for p in sorted(list(products)):
    output.append(f"  - {p}")

with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\file_15_cp949_utf8.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(output))

print("Written successfully!")
