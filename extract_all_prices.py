import pandas as pd
csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\brain_extracted_data.csv'
df = pd.read_csv(csv_path, encoding='utf-8-sig')

prods = {}
for i, row in df.iterrows():
    c1 = str(row.iloc[1]).strip() # 회사명
    c2 = str(row.iloc[2]).strip() # 상품명
    c3 = str(row.iloc[3]).strip() # 특약명
    c6 = str(row.iloc[6]).strip() # 가입보험료
    
    if c1 != 'nan' and c2 != 'nan' and ('뇌혈관' in c3 or '주계약' in c3 or '허혈' in c3):
        if c1 not in prods:
            prods[c1] = {}
        if c2 not in prods[c1]:
            prods[c1][c2] = set()
        
        if c6 != 'nan' and c6 != '0':
            prods[c1][c2].add(c6)

with open('all_raw_products_with_price.txt', 'w', encoding='utf-8') as f:
    for comp in sorted(prods.keys()):
        f.write(f"\n[{comp}]\n")
        for p in sorted(prods[comp].keys()):
            prices = ", ".join(sorted(list(prods[comp][p])))
            price_str = f"({prices}원)" if prices else "(가격정보 없음)"
            f.write(f" - {p} {price_str}\n")
