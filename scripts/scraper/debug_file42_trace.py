import pandas as pd
import os

filepath = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_42.xls'
filename = os.path.basename(filepath)
companies = ['DB손보', '메리츠화재', '삼성화재', 'KB손보', '현대해상', '한화손보', '롯데손보', '농협손보', '흥국화재', 'MG손보', 'AXA손보', 'AIG손보', '하나손보', '신한EZ손해보험']
driver_keywords = ["운전자", "교통사고", "벌금", "변호사", "교통상해", "부상치료", "자부상", "운전중", "형사합의", "사고처리"]

xl = pd.ExcelFile(filepath)
df = xl.parse(xl.sheet_names[0], header=None)

last_product = ''
rows_extracted = 0

for idx, row in df.iterrows():
    row_list = [str(val).strip() for val in row if pd.notna(val)]
    if not row_list or len(row_list) < 2:
        continue
        
    # Find product name
    potential_product = ""
    for v in row_list:
        if len(v) > 8 and '보험' in v and not any(x in v for x in companies) and not any(x in v for x in ['조회', '회사', '상품', '담보', '지급']):
            potential_product = v
            break
    if potential_product:
        last_product = potential_product
    
    # Check driver conditions
    row_str = " ".join([str(v) for v in row_list])
    matched_kws = [kw for kw in driver_keywords if kw in row_str]
    
    if not matched_kws:
        continue
        
    exclude_kws = ["치아", "치매", "간병", "뇌혈관", "허혈성", "암진단", "심장질환", "보철", "임플란트", "틀니"]
    if any(ek in row_str for ek in exclude_kws):
        continue
    
    is_driver_product = False
    if last_product:
        prod_lower = str(last_product).lower()
        if any(k in prod_lower for k in ["운전자", "운전", "drive", "바이크", "마이바이크", "라이더", "교통"]):
            is_driver_product = True
    
    if is_driver_product:
        rows_extracted += 1
        if rows_extracted <= 5:
            print(f"Row {idx}: product='{last_product[:30]}', coverage='{row_list[0][:30]}', matched={matched_kws}")
    else:
        if any(k in row_str for k in ["운전자용", "운전중", "교통사고처리지원", "변호사선임", "자동차사고벌금", "벌금(대물)", "벌금Ⅱ", "부상치료비", "자부상", "교통상해사망", "교통상해후유장해"]):
            rows_extracted += 1
            if rows_extracted <= 5:
                print(f"Row {idx} (rider): product='{last_product[:30]}', coverage='{row_list[0][:30]}', matched={matched_kws}")

print(f"\nTotal rows that would be extracted: {rows_extracted}")
print(f"\nFirst last_product seen: '{last_product[:60]}'")
