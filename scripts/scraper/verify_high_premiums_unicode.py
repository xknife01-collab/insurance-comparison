import pandas as pd
import os

df = pd.read_csv(
    r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.csv',
    encoding='utf-8-sig'
)

df['보험료_num'] = pd.to_numeric(df['가입보험료'], errors='coerce')
high_rows = df[df['보험료_num'] > 100000].copy()

lines = []
lines.append(f"Number of rows with premium > 100,000: {len(high_rows)}\n")
for idx, row in high_rows.iterrows():
    lines.append(f"--- Index {idx} ---")
    lines.append(f"Company: {row['보험회사']}")
    lines.append(f"Product: {row['상품명']}")
    lines.append(f"Coverage: {row['담보명(급부명)']}")
    lines.append(f"Premium: {row['가입보험료']}")
    lines.append(f"Source: {row['source_file']}")
    for i in range(10):
        val = row.get(f'원본_열_{i}')
        if pd.notna(val) and str(val).strip() != '':
            lines.append(f"  Col_{i}: {val}")
    lines.append("")

out = "\n".join(lines)
os.makedirs(r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch', exist_ok=True)
with open(r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\high_premiums_details.txt', 'w', encoding='utf-8') as f:
    f.write(out)
print("Wrote output to scratch/high_premiums_details.txt")
