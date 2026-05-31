import pandas as pd
import os

df = pd.read_csv(
    r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.csv',
    encoding='utf-8-sig'
)

# Filter for rows with non-empty premium
df_valid = df[df['가입보험료'].notna() & (df['가입보험료'] != '')].copy()
df_valid['가입보험료'] = pd.to_numeric(df_valid['가입보험료'], errors='coerce')
df_valid = df_valid[df_valid['가입보험료'].notna()].copy()
df_valid['가입보험료'] = df_valid['가입보험료'].astype(int)

# Group by company and product to see the parsed premiums
lines = []
lines.append(f"Total rows with valid premiums: {len(df_valid)}")
lines.append("-" * 80)

grouped = df_valid.groupby(['보험회사', '상품명'])
for (company, product), group in grouped:
    lines.append(f"보험회사: {company} | 상품명: {product}")
    for idx, row in group.iterrows():
        lines.append(f"  - 담보명: {row['담보명(급부명)']} | 가입금액: {row['가입금액']} | 가입보험료: {row['가입보험료']:,}원 | 소스: {row['source_file']}")
    lines.append("-" * 80)

output_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\valid_premiums_summary.txt'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    f.write("\n".join(lines))
print("Wrote summary to scratch/valid_premiums_summary.txt")
