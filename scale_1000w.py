import pandas as pd
import re

csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\brain_extracted_data.csv'
df = pd.read_csv(csv_path, encoding='utf-8-sig')

# 유병자/간편 상품 키워드
sick_keywords = ["간편", "유병자", "초경증", "고당지", "311", "3N5", "355", "325", "335", "345",
                 "3.10.10", "3.5.5", "3.10.5", "3·1·1", "3·5·5", "3·N·5", "5N5"]

# 어린이/자녀 상품 키워드 (제외 대상)
child_keywords = ["어린이", "자녀", "꿈나무", "금쪽", "아이", "헤아림", "베이비", "아기", "임산부", "꿈나무"]

TARGET = 10_000_000  # 1,000만원 기준

def parse_coverage(c5_str, c3_str=""):
    """담보금액 문자열에서 원 단위 숫자 추출"""
    s = (c5_str + c3_str).replace(',', '').replace(' ', '')
    
    # 억 단위
    m_uk = re.search(r'(\d+)억', s)
    if m_uk:
        val = int(m_uk.group(1)) * 100_000_000
        m_man = re.search(r'억(\d+)만', s)
        if m_man:
            val += int(m_man.group(1)) * 10_000
        return val
    
    # 만 단위
    m_man = re.search(r'(\d+)만', s)
    if m_man:
        return int(m_man.group(1)) * 10_000
    
    return 0

results = {}
current_company = None
current_product = None

for i, row in df.iterrows():
    try:
        c1 = str(row.iloc[1]).strip()
        c2 = str(row.iloc[2]).strip()
        c3 = str(row.iloc[3]).strip()
        c5 = str(row.iloc[5]).strip()
        c6 = str(row.iloc[6]).strip()

        if c1 != 'nan' and len(c1) < 20:
            current_company = c1

        if c2 != 'nan' and len(c2) > 3 and c2 != current_company:
            # 1. 유병자 필터
            is_sick = any(bk.lower() in c2.lower() for bk in sick_keywords)
            # 2. 어린이 보험 필터 (사용자 요청: 어린이 보험 빼고)
            is_child = any(ck.lower() in c2.lower() for ck in child_keywords)
            
            if not is_sick and not is_child:
                current_product = c2
                key = (current_company, current_product)
                if key not in results:
                    results[key] = 0.0
            else:
                current_product = None

        if current_company and current_product:
            is_target = ('뇌혈관' in c3 or '주계약' in c3 or '허혈' in c3 or
                         '기본계약' in c3 or '주보험' in c3)
            if is_target:
                coverage = parse_coverage(c5, c3)
                nums = re.findall(r'[\d,]+', c6.replace(' ', ''))
                if nums:
                    p_str = nums[0].replace(',', '')
                    if p_str.isdigit() and int(p_str) > 0:
                        premium = int(p_str)
                        
                        # [사용자 요청 로직] 
                        # 1. 담보 금액 정보가 있으면 1,000만원으로 환산
                        # 2. 담보 금액 정보가 없으면 "그냥 나오게" (그대로 유지)
                        if coverage > 0:
                            scaled = premium * (TARGET / coverage)
                        else:
                            scaled = premium
                        
                        key = (current_company, current_product)
                        if key in results:
                            results[key] += scaled
    except:
        continue

# 기본 상품명으로 그룹화 (중복 제거)
def base_name(name):
    n = re.sub(r'\(\d+종\)', '', name)
    n = re.sub(r'\(\d+형\)', '', n)
    n = re.sub(r'_\d+종.*', '', n)
    n = re.sub(r'_\d+형.*', '', n)
    n = re.sub(r'\s+\d+종.*', '', n)
    n = re.sub(r'\s+\d+형.*', '', n)
    n = re.sub(r'\s+\d종\b', '', n)
    n = re.sub(r'\s+\d형\b', '', n)
    n = re.sub(r'\[\d+종:.*?\]', '', n)
    n = re.sub(r'\s+(일반형|납입면제형|해약환급금미지급형.*|표준형.*|건강고지.*|일반심사.*)\s*$', '', n)
    return n.strip()

company_map = {}
for (comp, prod), total in results.items():
    if total < 500: continue
    bn = base_name(prod)
    if comp not in company_map:
        company_map[comp] = {}
    if bn not in company_map[comp]:
        company_map[comp][bn] = (prod, total)
    else:
        if total < company_map[comp][bn][1]:
            company_map[comp][bn] = (prod, total)

with open('final_clean.txt', 'w', encoding='utf-8') as f:
    total_count = 0
    for comp in sorted(company_map.keys()):
        prods = company_map[comp]
        if not prods: continue
        f.write(f"\n[{comp}]\n")
        for bn, (name, prem) in sorted(prods.items(), key=lambda x: x[1][1]):
            f.write(f"  - {name} → {int(prem):,}원\n")
            total_count += 1
    f.write(f"\n총 {total_count}개\n")

print(f"완료! 총 {total_count}개 추출됨.")
