import re

with open('no_sick.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def base_name(name):
    """1종,2종,1형,2형 등 꼬리표 제거해서 기본 상품명 추출"""
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
    n = re.sub(r'\s+\(.*?(일반형|납입면제형|해약환급금.*|표준형.*|건강고지.*|일반심사.*)\)', '', n)
    return n.strip()

# 회사별로 같은 기본명끼리 그룹화 → 최소금액만 남기기
company_products = {}  # {company: {base_name: (full_name, min_premium)}}

current_company = None
for line in lines:
    line = line.rstrip('\r\n')
    if line.startswith('[') and line.endswith(']'):
        current_company = line[1:-1]
        if current_company not in company_products:
            company_products[current_company] = {}
    elif line.strip().startswith('-') and '→' in line:
        parts = line.strip().lstrip('- ').split(' → ')
        if len(parts) == 2:
            prod_name = parts[0].strip()
            try:
                premium = int(parts[1].replace(',', '').replace('원', '').strip())
            except:
                continue
            bn = base_name(prod_name)
            if bn not in company_products[current_company]:
                company_products[current_company][bn] = (prod_name, premium)
            else:
                existing_prem = company_products[current_company][bn][1]
                if premium < existing_prem:
                    company_products[current_company][bn] = (prod_name, premium)

# 출력
with open('deduped.txt', 'w', encoding='utf-8') as f:
    total = 0
    for comp in company_products:
        prods = company_products[comp]
        if not prods:
            continue
        f.write(f"\n[{comp}]\n")
        for bn, (name, prem) in sorted(prods.items(), key=lambda x: x[1][1]):
            f.write(f"  - {name} → {prem:,}원\n")
            total += 1
    f.write(f"\n총 {total}개\n")

print("완료!")
