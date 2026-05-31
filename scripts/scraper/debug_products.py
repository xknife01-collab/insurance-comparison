import pandas as pd
import os

filepath = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_42.xls'
xl = pd.ExcelFile(filepath)
df = xl.parse(xl.sheet_names[0], header=None)
last_product = ''
companies = ['DB손보', '메리츠화재', '삼성화재', 'KB손보', '현대해상', '한화손보', '롯데손보', '농협손보', '흥국화재', 'MG손보', 'AXA손보', 'AIG손보', '하나손보', '신한EZ손해보험']
driver_products = []
for idx, row in df.iterrows():
    row_list = [str(val).strip() for val in row if pd.notna(val)]
    for v in row_list:
        if len(v) > 8 and '보험' in v and not any(x in v for x in companies) and not any(x in v for x in ['조회', '회사', '상품', '담보', '지급']):
            print(f'Product at row {idx}: {v[:80]}')
            driver_products.append(v)
            break

print(f'Total unique products: {len(driver_products)}')
print('\n--- Checking is_driver_row for first 5 products ---')
driver_keywords = ["운전자", "교통사고", "벌금", "변호사", "교통상해", "부상치료", "자부상", "운전중", "형사합의", "사고처리"]
for p in driver_products[:5]:
    matched = [kw for kw in driver_keywords if kw in p]
    prod_lower = p.lower()
    driver_match = any(k in prod_lower for k in ["운전자", "운전", "drive", "바이크", "마이바이크", "라이더", "교통"])
    print(f'  Product: {p[:50]}, Driver product: {driver_match}, Matched kw: {matched}')
