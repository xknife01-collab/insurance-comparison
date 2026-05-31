import os
import pandas as pd
from bs4 import BeautifulSoup
import re

root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
companies = ['DB손보', '메리츠화재', '삼성화재', 'KB손보', '현대해상', '한화손보', '롯데손보', '농협손보', '흥국화재', 'MG손보', 'AXA손보', 'AIG손보', '하나손보', '신한EZ손해보험', '동양생명', '신한라이프', '교보생명', '미래에셋생명', '한화생명']

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

def parse_clean_premium(val):
    if pd.isna(val):
        return None
    val_str = str(val).strip()
    if not val_str or val_str.lower() in ('nan', 'none'):
        return None
    
    # If the text is long, it's NOT a premium
    if len(val_str) > 15:
        return None
        
    clean = val_str.replace(' ', '')
    
    # Pattern 1: purely digits
    if clean.isdigit():
        num = int(clean)
        if 1000 <= num <= 200000:
            return num
            
    # Pattern 2: digits with commas
    if re.match(r'^\d{1,3}(,\d{3})+$', clean):
        num = int(clean.replace(',', ''))
        if 1000 <= num <= 200000:
            return num
            
    # Pattern 3: digits with '원'
    m = re.match(r'^([\d,]+)원$', clean)
    if m:
        num_str = m.group(1).replace(',', '')
        if num_str.isdigit():
            num = int(num_str)
            if 1000 <= num <= 200000:
                return num
                
    # Pattern 4: float
    try:
        fval = float(clean.replace(',', ''))
        if fval.is_integer():
            num = int(fval)
            if 1000 <= num <= 200000:
                return num
    except ValueError:
        pass
        
    return None

def parse_clean_coverage(val):
    if pd.isna(val):
        return ""
    val_str = str(val).strip()
    if '만' in val_str or '억' in val_str:
        return val_str
    return ""

def process_file_rows(row_list, filename, last_company, last_product):
    row_data = {
        '보험회사': last_company,
        '상품명': last_product,
        '구분': "특약" if any("특약" in str(v) for v in row_list) else "주계약",
        '담보명(급부명)': "",
        '지급사유': "",
        '지급금액': "",
        '가입금액': "",
        '기준보험료': "",
        '가입보험료': "",
        '적용이율': "",
        '갱신구분': "",
        '판매채널': "",
        '기준일자': "",
        '상세안내': "",
        '연락처': "",
        'source_file': filename
    }
    
    # 담보명 찾기
    for v in row_list:
        v_str = str(v).strip()
        if any(k in v_str for k in ["벌금", "변호사", "교통사고", "부상치료", "자부상", "교통상해", "사망", "후유장해", "PM"]):
            row_data["담보명(급부명)"] = v_str
            break
    if not row_data["담보명(급부명)"] and len(row_list) > 2:
        row_data["담보명(급부명)"] = str(row_list[0]).strip()
        
    # 지급사유 / 상세안내
    long_texts = [str(v).strip() for v in row_list if len(str(v).strip()) > 20 and str(v).strip() != last_product and str(v).strip() != row_data.get("담보명(급부명)", "")]
    if long_texts:
        row_data["지급사유"] = long_texts[0]
        if len(long_texts) > 1:
            row_data["상세안내"] = long_texts[1]
            
    # 지급금액
    payout_candidates = [str(v).strip() for v in row_list if any(x in str(v) for x in ["원", "배", "한도", "%", "지급", "보험가입금액"])]
    if payout_candidates:
        row_data["지급금액"] = payout_candidates[0]
        
    # 가입금액 및 보험료 추출
    prem_candidates = []
    cov_candidates = []
    
    for v in row_list:
        p_val = parse_clean_premium(v)
        if p_val is not None:
            prem_candidates.append(p_val)
        c_val = parse_clean_coverage(v)
        if c_val:
            cov_candidates.append(c_val)
            
    if cov_candidates:
        row_data["가입금액"] = cov_candidates[-1]
        
    if len(prem_candidates) >= 2:
        row_data["기준보험료"] = str(prem_candidates[-2])
        row_data["가입보험료"] = str(prem_candidates[-1])
    elif len(prem_candidates) == 1:
        row_data["가입보험료"] = str(prem_candidates[0])
        
    for i in range(min(len(row_list), 30)):
        row_data[f"원본_열_{i}"] = row_list[i]
        
    return row_data

# Test on file_42.xls and file_49.xls
for f in ["file_42.xls", "file_49.xls"]:
    filepath = os.path.join(root_dir, f)
    print(f"\n--- Testing strict parser on {f} ---")
    if not os.path.exists(filepath):
        print("File not found")
        continue
    
    xl = pd.ExcelFile(filepath)
    for sheet in xl.sheet_names:
        df = xl.parse(sheet, header=None)
        
        full_text = df.to_string()
        last_company = ""
        for c in companies:
            if c[:2] in full_text or c[:2] in f:
                last_company = c
                break
                
        last_product = ""
        count = 0
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
                
            if is_driver_row(row_list, f, last_product):
                row_data = process_file_rows(row_list, f, last_company, last_product)
                if row_data["가입보험료"]:
                    print(f"Row {idx} | Comp: {row_data['보험회사']} | Prod: {row_data['상품명'][:30]} | Cov: {row_data['담보명(급부명)'][:20]} | Premium: {row_data['가입보험료']}")
                    count += 1
        print(f"Extracted {count} valid premium rows from sheet {sheet}")
