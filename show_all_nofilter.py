import pandas as pd
import re

csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\brain_extracted_data.csv'
df = pd.read_csv(csv_path, encoding='utf-8-sig')

# 필터 없이 그냥 전부 뽑기: 회사명, 상품명, 특약명(뇌혈관), 금액
results = {}
current_company = None
current_product = None

for i, row in df.iterrows():
    try:
        c1 = str(row.iloc[1]).strip()
        c2 = str(row.iloc[2]).strip()
        c3 = str(row.iloc[3]).strip()
        c6 = str(row.iloc[6]).strip()
        
        if c1 != 'nan' and len(c1) < 20:
            current_company = c1
            
        if c2 != 'nan' and len(c2) > 3 and c2 != current_company:
            current_product = c2
            key = f"{current_company}||{current_product}"
            if key not in results:
                results[key] = 0
        
        # 뇌혈관 또는 주계약/기본 특약에서 보험료 합산
        if current_company and current_product and ('뇌혈관' in c3 or '주계약' in c3 or '허혈' in c3):
            nums = re.findall(r'[\d,]+', c6.replace(' ', ''))
            if nums:
                p_str = nums[0].replace(',', '')
                if p_str.isdigit() and int(p_str) > 0:
                    key = f"{current_company}||{current_product}"
                    results[key] += int(p_str)
    except:
        continue

# 저장
with open('all_nofilter.txt', 'w', encoding='utf-8') as f:
    prev_comp = None
    for key, premium in sorted(results.items()):
        comp, prod = key.split('||', 1)
        if premium == 0:
            continue
        if comp != prev_comp:
            f.write(f"\n[{comp}]\n")
            prev_comp = comp
        f.write(f"  - {prod} → {premium:,}원\n")

print("완료!")
