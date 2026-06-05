import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.csv"
df = pd.read_csv(csv_path, encoding='utf-8-sig')

# Clean columns for display
df['보험회사_clean'] = df['보험회사'].astype(str).str.strip().str[:10]
df['상품명_clean'] = df['상품명'].astype(str).str.strip().str[:30]
df['담보명_clean'] = df['담보명(급부명)'].astype(str).str.strip().str[:30]
df['가입금액_clean'] = df['가입금액'].astype(str).str.strip().str[:20]

# Print traffic accident riders
traffic = df[df['담보명(급부명)'].str.contains('교통사고처리지원금|형사합의|변호사|벌금', na=False, case=False)].copy()

report_lines = []
report_lines.append("=== Raw Excel/HTML Rider Scan Report ===")
report_lines.append(f"Total matched driver rows in DB: {len(traffic)}")
report_lines.append(f"{'Company':<12} | {'Product Name':<32} | {'Rider Name':<32} | {'Limit':<15} | {'Premium(M)':<10} | {'Premium(F)':<10}")
report_lines.append("-" * 125)

for idx, row in traffic.head(100).iterrows():
    m_prem = str(row['기준보험료']) if pd.notna(row['기준보험료']) else "N/A"
    f_prem = str(row['가입보험료']) if pd.notna(row['가입보험료']) else "N/A"
    line = f"{row['보험회사_clean']:<12} | {row['상품명_clean']:<32} | {row['담보명_clean']:<32} | {row['가입금액_clean']:<15} | {m_prem:<10} | {f_prem:<10}"
    report_lines.append(line)

with open("scratch/driver_riders_report.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(report_lines))

print("Report generated successfully at scratch/driver_riders_report.txt")
