import pandas as pd
import os
from bs4 import BeautifulSoup
import warnings

warnings.filterwarnings('ignore')

root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
filepath = os.path.join(root_dir, "file_42.xls")
filename = "file_42.xls"

# Simulate is_html detection
is_html = False
try:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        head = f.read(500)
        if "<html" in head.lower() or "<table" in head.lower():
            is_html = True
except:
    pass

print(f"file_42.xls is_html detected: {is_html}")

# Simulate parse_excel_file
companies = ['DB손보', '메리츠화재', '삼성화재', 'KB손보', '현대해상', '한화손보', '롯데손보', '농협손보', '흥국화재', 'MG손보', 'AXA손보', 'AIG손보', '하나손보', '신한EZ손해보험']
driver_keywords = ["운전자", "교통사고", "벌금", "변호사", "교통상해", "부상치료", "자부상", "운전중", "형사합의", "사고처리", "면허정지", "면허취소"]

def is_driver_row(row_list, filename, current_product):
    row_str = " ".join([str(v) for v in row_list])
    exclude_kws = ["치아", "치매", "간병", "뇌혈관", "허혈성", "암진단", "심장질환", "보철", "임플란트", "틀니", "치주", "잇몸"]
    if any(ek in row_str for ek in exclude_kws):
        return False
    is_driver_product = False
    if current_product:
        prod_lower = str(current_product).lower()
        if any(k in prod_lower for k in ["운전자", "운전", "drive", "바이크", "마이바이크", "라이더", "교통"]):
            is_driver_product = True
    matched_kws = [kw for kw in driver_keywords if kw in row_str]
    if len(matched_kws) > 0:
        if is_driver_product:
            return True
        if any(k in row_str for k in ["운전자용", "운전중", "교통사고처리지원", "변호사선임", "자동차사고벌금", "벌금(대물)", "벌금Ⅱ", "부상치료비", "자부상", "교통상해사망", "교통상해후유장해"]):
            return True
    return False

rows = []
try:
    xl = pd.ExcelFile(filepath)
    for sheet in xl.sheet_names:
        df = xl.parse(sheet, header=None)
        full_text = df.to_string()
        last_company = ""
        for c in companies:
            if c[:2] in full_text or c[:2] in filename:
                last_company = c
                break
        last_product = ""
        for idx, row in df.iterrows():
            row_list = [str(val).strip() for val in row if pd.notna(val)]
            if not row_list or len(row_list) < 2:
                continue
            for v in row_list:
                for c in companies:
                    if c in v:
                        last_company = c
                        break
            potential_product = ""
            for v in row_list:
                if len(v) > 8 and '보험' in v and not any(x in v for x in companies) and not any(x in v for x in ['조회', '회사', '상품', '담보', '지급']):
                    potential_product = v
                    break
            if potential_product:
                last_product = potential_product
            if is_driver_row(row_list, filename, last_product):
                rows.append(row_list)
    
    print(f"Total rows extracted from file_42.xls: {len(rows)}")
    for i, r in enumerate(rows[:3]):
        print(f"  Row {i}: {r[:3]}")
except Exception as e:
    print(f"Error: {e}")
