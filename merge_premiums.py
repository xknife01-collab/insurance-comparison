import pandas as pd
import re

csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\brain_extracted_data.csv'
df = pd.read_csv(csv_path, encoding='utf-8-sig')

sick_keywords = ["간편", "유병자", "초경증", "고당지", "311", "3N5", "355", "325", "335", "345",
                 "3.10.10", "3.5.5", "3.10.5", "3·1·1", "3·5·5", "3·N·5", "5N5"]

# 상품별로 주계약 + 뇌혈관특약 금액 모두 합산
results = {}  # {(company, product): total_premium}
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
            is_sick = any(bk.lower() in c2.lower() for bk in sick_keywords)
            if not is_sick:
                current_product = c2
                key = (current_company, current_product)
                if key not in results:
                    results[key] = 0
            else:
                current_product = None
        
        # 주계약 OR 뇌혈관 특약 둘 다 합산
        if current_company and current_product:
            is_target = ('뇌혈관' in c3 or '주계약' in c3 or '허혈' in c3 or 
                        '기본계약' in c3 or '주보험' in c3)
            if is_target:
                nums = re.findall(r'[\d,]+', c6.replace(' ', ''))
                if nums:
                    p_str = nums[0].replace(',', '')
                    if p_str.isdigit() and int(p_str) > 0:
                        key = (current_company, current_product)
                        if key in results:
                            results[key] += int(p_str)
    except:
        continue

# 기본 상품명으로 그룹화 (1종/2종 등 제거) → 최소 합산액만 남김
def base_name(name):
    n = re.sub(r'\(\d+종\)', '', name)
    n = re.sub(r'\(\d+형\)', '', name)
    n = re.sub(r'_\d+종.*', '', n)
    n = re.sub(r'_\d+형.*', '', n)
    n = re.sub(r'\s+\d+종.*', '', n)
    n = re.sub(r'\s+\d+형.*', '', n)
    n = re.sub(r'\s+\d종\b', '', n)
    n = re.sub(r'\s+\d형\b', '', n)
    n = re.sub(r'\[\d+종:.*?\]', '', n)
    n = re.sub(r'\s+(일반형|납입면제형|해약환급금미지급형.*|표준형.*|건강고지.*|일반심사.*)\s*$', '', n)
    return n.strip()

# 회사별 기본명으로 그룹화 → 최소 합산액
company_map = {}  # {company: {base_name: (full_name, min_total)}}

for (comp, prod), total in results.items():
    if total == 0:
        continue
    bn = base_name(prod)
    if comp not in company_map:
        company_map[comp] = {}
    if bn not in company_map[comp]:
        company_map[comp][bn] = (prod, total)
    else:
        if total < company_map[comp][bn][1]:
            company_map[comp][bn] = (prod, total)

with open('merged.txt', 'w', encoding='utf-8') as f:
    total_count = 0
    for comp in sorted(company_map.keys()):
        prods = company_map[comp]
        if not prods:
            continue
        f.write(f"\n[{comp}]\n")
        for bn, (name, prem) in sorted(prods.items(), key=lambda x: x[1][1]):
            f.write(f"  - {name} → {prem:,}원\n")
            total_count += 1
    f.write(f"\n총 {total_count}개\n")

print("완료!")
