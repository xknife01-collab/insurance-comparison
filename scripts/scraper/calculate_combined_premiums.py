import pandas as pd
import os

csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.csv'
df = pd.read_csv(csv_path, encoding='utf-8-sig')

# Clean premium columns
df['기준보험료_num'] = pd.to_numeric(df['기준보험료'], errors='coerce')
df['가입보험료_num'] = pd.to_numeric(df['가입보험료'], errors='coerce')

# Fallback empty values
df.loc[df['기준보험료_num'].isna() & df['가입보험료_num'].notna(), '기준보험료_num'] = df['가입보험료_num']
df.loc[df['가입보험료_num'].isna() & df['기준보험료_num'].notna(), '가입보험료_num'] = df['기준보험료_num']

# Filter rows that have at least one premium
df_prem = df[df['가입보험료_num'].notna()].copy()

# Group by Company and Product
grouped = df_prem.groupby(['보험회사', '상품명', 'source_file'])

lines = []
lines.append("=== 주계약 및 특약 합산 보험료 분석 ===")
lines.append("")

for (company, product, source), group in grouped:
    main_rows = group[group['구분'] == '주계약']
    rider_rows = group[group['구분'] == '특약']
    
    main_male_sum = main_rows['기준보험료_num'].sum()
    main_female_sum = main_rows['가입보험료_num'].sum()
    
    rider_male_sum = rider_rows['기준보험료_num'].sum()
    rider_female_sum = rider_rows['가입보험료_num'].sum()
    
    total_male = main_male_sum + rider_male_sum
    total_female = main_female_sum + rider_female_sum
    
    lines.append(f"보험회사: {company} | 상품명: {product}")
    lines.append(f"  - 소스 파일: {source}")
    
    if len(main_rows) > 0:
        lines.append(f"  - 주계약 ({len(main_rows)}개 담보):")
        for idx, row in main_rows.iterrows():
            lines.append(f"    * {row['담보명(급부명)']} -> 남: {int(row['기준보험료_num']):,}원 / 여: {int(row['가입보험료_num']):,}원")
        lines.append(f"    * 주계약 합계: 남 {int(main_male_sum):,}원 / 여 {int(main_female_sum):,}원")
    else:
        lines.append("  - 주계약 담보 없음")
        
    if len(rider_rows) > 0:
        lines.append(f"  - 특약 ({len(rider_rows)}개 담보):")
        for idx, row in rider_rows.iterrows():
            lines.append(f"    * {row['담보명(급부명)']} -> 남: {int(row['기준보험료_num']):,}원 / 여: {int(row['가입보험료_num']):,}원")
        lines.append(f"    * 특약 합계: 남 {int(rider_male_sum):,}원 / 여 {int(rider_female_sum):,}원")
    else:
        lines.append("  - 특약 담보 없음")
        
    lines.append(f"  => [총 합계 보험료] 남성: {int(total_male):,}원 / 여성: {int(total_female):,}원")
    lines.append("-" * 80)

output_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\combined_premiums.txt'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    f.write("\n".join(lines))
print(f"Successfully calculated combined premiums. Wrote to {output_path}")
