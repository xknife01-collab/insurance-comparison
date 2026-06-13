import pandas as pd
import numpy as np
import io

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")

def parse_premium(val):
    if pd.isna(val) or val == '':
        return 0
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    try:
        return float(s)
    except:
        return 0

df['male_premium_raw'] = df['남성보험료'].apply(parse_premium)
df['female_premium_raw'] = df['여성보험료'].apply(parse_premium)

# High premium rows (male or female >= 400,000)
high_raw = df[(df['male_premium_raw'] >= 400000) | (df['female_premium_raw'] >= 400000)].copy()

# Sort by company and product
high_raw.sort_values(by=['보험회사', '상품명'], inplace=True)

report_lines = []
report_lines.append("=== HIGH PREMIUM DEMENTIA PRODUCTS (>= 400,000 KRW) ===")
report_lines.append(f"Total high premium rows found: {len(high_raw)}")
report_lines.append("")

for idx, row in high_raw.iterrows():
    report_lines.append(f"Company: {row['보험회사']}")
    report_lines.append(f"Product: {row['상품명']}")
    report_lines.append(f"Category (구분): {row['구분']}")
    report_lines.append(f"Rider Name (담보명): {row['담보명(급부명)']}")
    report_lines.append(f"Face Amount (가입금액): {row['가입금액']}")
    report_lines.append(f"Benefit Amount (지급금액): {row['지급금액']}")
    report_lines.append(f"Raw Male Premium: {row['남성보험료']}")
    report_lines.append(f"Raw Female Premium: {row['여성보험료']}")
    report_lines.append(f"Source File: {row['source_file']}")
    report_lines.append(f"Detailed Guide (상세안내): {row['상세안내']}")
    report_lines.append("-" * 60)

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\high_premium_dementia_report.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(report_lines))

print("Report written successfully to scratch/high_premium_dementia_report.txt")
