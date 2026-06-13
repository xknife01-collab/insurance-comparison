import pandas as pd
import re

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")

def clean_val_to_num(val):
    if pd.isna(val) or val == "": return 0
    s = str(val).replace(",", "").replace("원", "").replace(" ", "").strip()
    try:
        return float(s)
    except:
        return 0

high_rows = []
for idx, row in df.iterrows():
    pm = clean_val_to_num(row.get('남성보험료', 0))
    pf = clean_val_to_num(row.get('여성보험료', 0))
    p = max(pm, pf)
    if p > 100000:
        high_rows.append(row)

high_df = pd.DataFrame(high_rows)

out_lines = []
out_lines.append(f"Found {len(high_df)} rows with premium > 100,000 KRW.")
out_lines.append("=" * 100)

if len(high_df) > 0:
    unique_prods = high_df[['보험회사', '상품명', 'source_file', '남성보험료', '여성보험료', '상세안내']].drop_duplicates(subset=['보험회사', '상품명'])
    for idx, row in unique_prods.iterrows():
        out_lines.append(f"Company: {row['보험회사']}")
        out_lines.append(f"Product: {row['상품명']}")
        out_lines.append(f"Source: {row['source_file']}")
        out_lines.append(f"Male: {row['남성보험료']} | Female: {row['여성보험료']}")
        out_lines.append(f"Desc: {row['상세안내']}")
        out_lines.append("-" * 50)
else:
    out_lines.append("No high premium rows found.")

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\high_premium_clean.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

print("Inspection report saved successfully in UTF-8!")
