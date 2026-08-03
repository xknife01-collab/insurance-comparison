import pandas as pd
import re

csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\brain_extracted_data.csv'
df = pd.read_csv(csv_path, encoding='utf-8-sig')

# 상품명에서만 유병자 키워드 필터 (특약명c3은 건드리지 않음)
sick_keywords = ["간편", "유병자", "초경증", "고당지", "311", "3N5", "355", "325", "335", "345",
                 "3.10.10", "3.5.5", "3.10.5", "3·1·1", "3·5·5", "3·N·5", "5N5"]

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
            # 상품명에서만 유병자 키워드 체크
            is_sick = any(bk.lower() in c2.lower() for bk in sick_keywords)
            if not is_sick:
                current_product = c2
                key = f"{current_company}||{current_product}"
                if key not in results:
                    results[key] = 0
            else:
                current_product = None  # 유병자면 이후 특약도 무시
        
        if current_company and current_product and ('뇌혈관' in c3 or '주계약' in c3 or '허혈' in c3):
            nums = re.findall(r'[\d,]+', c6.replace(' ', ''))
            if nums:
                p_str = nums[0].replace(',', '')
                if p_str.isdigit() and int(p_str) > 0:
                    key = f"{current_company}||{current_product}"
                    if key in results:
                        results[key] += int(p_str)
    except:
        continue

with open('no_sick.txt', 'w', encoding='utf-8') as f:
    prev_comp = None
    count = 0
    for key, premium in sorted(results.items()):
        comp, prod = key.split('||', 1)
        if premium == 0:
            continue
        if comp != prev_comp:
            f.write(f"\n[{comp}]\n")
            prev_comp = comp
        f.write(f"  - {prod} → {premium:,}원\n")
        count += 1
    f.write(f"\n총 {count}개\n")

print("완료!")
