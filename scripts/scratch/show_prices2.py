import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv"
out_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\product_price_list.txt"

df = pd.read_csv(csv_path)

lines = []
lines.append(f"재가/시설 보험 상품 목록 (총 {df['상품명'].nunique()}개 상품)")
lines.append("=" * 70)

seen = {}
for _, row in df.iterrows():
    prod = str(row['상품명']).strip()
    company = str(row['보험회사']).strip()
    std_p = str(row.get('기준보험료', '')).strip()
    entry_p = str(row.get('가입보험료', '')).strip()
    
    if prod not in seen:
        seen[prod] = {'company': company, 'std': std_p, 'entry': entry_p}

# Group by company
from collections import defaultdict
by_company = defaultdict(list)
for prod, info in seen.items():
    by_company[info['company']].append((prod, info['std'], info['entry']))

num = 1
for company, products in sorted(by_company.items()):
    lines.append(f"\n【 {company} 】")
    for prod, std, entry in sorted(products):
        std_clean = std if std and std != 'nan' else '-'
        entry_clean = entry if entry and entry != 'nan' else '-'
        lines.append(f"  {num}. {prod}")
        lines.append(f"     기준보험료: {std_clean}  /  가입보험료: {entry_clean}")
        num += 1

with open(out_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"저장완료: {out_path}")
print('\n'.join(lines))
