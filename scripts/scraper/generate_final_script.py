import os

script_content = r"""# -*- coding: utf-8 -*-
import os
import pandas as pd
from bs4 import BeautifulSoup
import warnings

warnings.filterwarnings('ignore')

root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
output_csv = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.csv"
output_xlsx = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.xlsx"

standard_cols = [
    '보험회사', '상품명', '구분', '담보명(급부명)', '지급사유', '지급금액', '가입금액', 
    '기준보험료', '가입보험료', '적용이율', '갱신구분', '판매채널', '기준일자', '상세안내', '연락처', 'source_file'
]
for i in range(30):
    standard_cols.append(f"원본_열_{i}")

companies = ['DB손보', '메리츠화재', '삼성화재', 'KB손보', '현대해상', '한화손보', '롯데손보', '농협손보', '흥국화재', 'MG손보', 'AXA손보', 'AIG손보', '하나손보', '신한EZ손해보험', '동양생명', '신한라이프', '교보생명', '미래에셋생명', '한화생명']

driver_keywords = ["운전자", "교통사고", "벌금", "변호사", "교통상해", "부상치료", "자부상", "운전중", "형사합의", "사고처리", "면허정지", "면허취소"]

def is_driver_row(row_list, filename, current_product):
    row_str = " ".join([str(v) for v in row_list])
    # Exclusion checks
    exclude_kws = ["치아", "치매", "간병", "뇌혈관", "허혈성", "암진단", "심장질환", "보철", "임플란트", "틀니", "치주", "잇몸"]
    if any(ek in row_str for ek in exclude_kws):
        return False
        
    # Check if the product itself is driver's insurance
    is_driver_product = False
    if current_product:
        prod_lower = str(current_product).lower()
        if any(k in prod_lower for k in ["운전자", "운전", "drive", "바이크", "마이바이크", "라이더", "교통"]):
            is_driver_product = True
            
    # Check if the row contains driver keywords
    matched_kws = [kw for kw in driver_keywords if kw in row_str]
    if len(matched_kws) > 0:
        if is_driver_product:
            return True
        # If it's not a driver product, check if the coverage itself is explicitly a driver's rider
        if any(k in row_str for k in ["운전자용", "운전중", "교통사고처리지원", "변호사선임", "자동차사고벌금", "벌금(대물)", "벌금Ⅱ", "부상치료비", "자부상", "교통상해사망", "교통상해후유장해"]):
            return True
            
    return False

def parse_html_file(filepath):
    filename = os.path.basename(filepath)
    rows = []
    try:
        with open(filepath, 'r', encoding='cp949', errors='ignore') as f:
            content = f.read()
        if '<table' not in content.lower():
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
        soup = BeautifulSoup(content, 'html.parser')
        table = soup.find('table')
        if not table:
            return []
            
        full_text = soup.get_text()
        last_company = ""
        for c in companies:
            if c[:2] in full_text or c[:2] in filename:
                last_company = c
                break
                
        last_product = ""
        for tr in table.find_all('tr'):
            tds = tr.find_all(['td', 'th'])
            row_list = [" ".join(td.get_text().split()) for td in tds]
            if not row_list or len(row_list) < 2:
                continue
                
            # Update last company
            for v in row_list:
                for c in companies:
                    if c in v:
                        last_company = c
                        break
                        
            # Find product name
            potential_product = ""
            for v in row_list:
                if len(v) > 8 and '보험' in v and not any(x in v for x in companies) and not any(x in v for x in ['조회', '회사', '상품', '담보', '지급']):
                    potential_product = v
                    break
            if potential_product:
                last_product = potential_product
                
            if not is_driver_row(row_list, filename, last_product):
                continue
                
            row_data = {col: "" for col in standard_cols}
            row_data["보험회사"] = last_company
            row_data["상품명"] = last_product
            
            row_str = " ".join([str(v) for v in row_list])
            row_data["구분"] = "특약" if "특약" in row_str else "주계약"
            
            # Find coverage/benefit name
            benefit_idx = -1
            for i, v in enumerate(row_list):
                if any(k in v for k in ["벌금", "변호사", "교통사고", "부상치료", "자부상", "교통상해", "사망", "후유장해", "PM"]):
                    benefit_idx = i
                    row_data["담보명(급부명)"] = v
                    break
            if benefit_idx == -1 and len(row_list) > 2:
                row_data["담보명(급부명)"] = row_list[0]
                    
            # Extract description/reasons
            long_texts = [v for v in row_list if len(v) > 20 and v != last_product and v != row_data.get("담보명(급부명)", "")]
            if long_texts:
                row_data["지급사유"] = long_texts[0]
                if len(long_texts) > 1:
                    row_data["상세안내"] = long_texts[1]
                    
            # Payout amount
            payout_candidates = [v for v in row_list if any(x in v for x in ["원", "배", "한도", "%", "지급", "보험가입금액"])]
            if payout_candidates:
                row_data["지급금액"] = payout_candidates[0]
                
            # Premium and coverage amount
            prem_candidates = []
            cov_candidates = []
            for v in row_list:
                clean_str = str(v).strip()
                if '만' in clean_str or '억' in clean_str:
                    cov_candidates.append(clean_str)
                elif '원' in clean_str and '만' not in clean_str:
                    num_only = ''.join(c for c in clean_str if c.isdigit())
                    if num_only and int(num_only) >= 1000:
                        prem_candidates.append(num_only)
                elif all(c.isdigit() or c == ',' for c in clean_str) and len(clean_str) >= 4:
                    num_only = clean_str.replace(',', '')
                    if num_only.isdigit() and int(num_only) >= 1000:
                        prem_candidates.append(num_only)
                        
            if cov_candidates:
                row_data["가입금액"] = cov_candidates[-1]
            if len(prem_candidates) >= 2:
                row_data["기준보험료"] = prem_candidates[-2]
                row_data["가입보험료"] = prem_candidates[-1]
            elif len(prem_candidates) == 1:
                row_data["가입보험료"] = prem_candidates[0]
                
            row_data["source_file"] = filename
            for i in range(min(len(row_list), 30)):
                row_data[f"원본_열_{i}"] = row_list[i]
            rows.append(row_data)
        return rows
    except Exception as e:
        print(f"Error parsing HTML file {filepath}: {e}")
        return []

def parse_excel_file(filepath):
    filename = os.path.basename(filepath)
    rows = []
    try:
        xl = pd.ExcelFile(filepath)
        for sheet in xl.sheet_names:
            df = xl.parse(sheet, header=None)
            
            # Find company from text
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
                    
                # Update last company
                for v in row_list:
                    for c in companies:
                        if c in v:
                            last_company = c
                            break
                            
                # Find product name
                potential_product = ""
                for v in row_list:
                    if len(v) > 8 and '보험' in v and not any(x in v for x in companies) and not any(x in v for x in ['조회', '회사', '상품', '담보', '지급']):
                        potential_product = v
                        break
                if potential_product:
                    last_product = potential_product
                    
                if not is_driver_row(row_list, filename, last_product):
                    continue
                    
                row_data = {col: "" for col in standard_cols}
                row_data["보험회사"] = last_company
                row_data["상품명"] = last_product
                
                row_str = " ".join([str(v) for v in row_list])
                row_data["구분"] = "특약" if "특약" in row_str else "주계약"
                
                # Find coverage/benefit name
                benefit_idx = -1
                for i, v in enumerate(row_list):
                    if any(k in v for k in ["벌금", "변호사", "교통사고", "부상치료", "자부상", "교통상해", "사망", "후유장해", "PM"]):
                        benefit_idx = i
                        row_data["담보명(급부명)"] = v
                        break
                if benefit_idx == -1 and len(row_list) > 2:
                    row_data["담보명(급부명)"] = row_list[0]
                        
                # Extract description/reasons
                long_texts = [v for v in row_list if len(v) > 20 and v != last_product and v != row_data.get("담보명(급부명)", "")]
                if long_texts:
                    row_data["지급사유"] = long_texts[0]
                    if len(long_texts) > 1:
                        row_data["상세안내"] = long_texts[1]
                        
                # Payout amount
                payout_candidates = [v for v in row_list if any(x in v for x in ["원", "배", "한도", "%", "지급", "보험가입금액"])]
                if payout_candidates:
                    row_data["지급금액"] = payout_candidates[0]
                    
                # Premium and coverage amount
                prem_candidates = []
                cov_candidates = []
                for v in row_list:
                    clean_str = str(v).strip()
                    if '만' in clean_str or '억' in clean_str:
                        cov_candidates.append(clean_str)
                    elif '원' in clean_str and '만' not in clean_str:
                        num_only = ''.join(c for c in clean_str if c.isdigit())
                        if num_only and int(num_only) >= 1000:
                            prem_candidates.append(num_only)
                    elif all(c.isdigit() or c == ',' for c in clean_str) and len(clean_str) >= 4:
                        num_only = clean_str.replace(',', '')
                        if num_only.isdigit() and int(num_only) >= 1000:
                            prem_candidates.append(num_only)
                            
                if cov_candidates:
                    row_data["가입금액"] = cov_candidates[-1]
                if len(prem_candidates) >= 2:
                    row_data["기준보험료"] = prem_candidates[-2]
                    row_data["가입보험료"] = prem_candidates[-1]
                elif len(prem_candidates) == 1:
                    row_data["가입보험료"] = prem_candidates[0]
                    
                row_data["source_file"] = filename
                for i in range(min(len(row_list), 30)):
                    row_data[f"원본_열_{i}"] = row_list[i]
                rows.append(row_data)
        return rows
    except Exception as e:
        print(f"Error parsing Excel file {filepath}: {e}")
        return []

if __name__ == "__main__":
    all_rows = []
    files = [f for f in os.listdir(root_dir) if f.endswith('.xls') or f.endswith('.xlsx')]
    
    for filename in files:
        filepath = os.path.join(root_dir, filename)
        is_html = False
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                head = f.read(500)
                if "<html" in head.lower() or "<table" in head.lower():
                    is_html = True
        except:
            pass
            
        if is_html:
            file_rows = parse_html_file(filepath)
        else:
            file_rows = parse_excel_file(filepath)
            
        if file_rows:
            all_rows.extend(file_rows)
            print(f"Extracted {len(file_rows)} rows from {filename}")
            
    df_final = pd.DataFrame(all_rows)
    if not df_final.empty:
        # Fill empty company names based on product names
        def fix_company(row):
            comp = str(row['보험회사']).strip()
            if comp and comp != 'nan' and comp != 'None':
                return comp
            prod = str(row['상품명'])
            for c in companies:
                if c[:2] in prod:
                    return c
            return ""
            
        df_final['보험회사'] = df_final.apply(fix_company, axis=1)
        
        # Clean standard columns
        df_final = df_final[standard_cols]
        
        # Deduplicate identical rows
        df_final.drop_duplicates(subset=['보험회사', '상품명', '담보명(급부명)', '지급사유', '지급금액', '가입금액', '가입보험료'], inplace=True)
        
        # Write to CSV and Excel
        os.makedirs(os.path.dirname(output_csv), exist_ok=True)
        df_final.to_csv(output_csv, index=False, encoding='utf-8-sig')
        df_final.to_excel(output_xlsx, index=False)
        print(f"COMPLETE: Extracted and saved {len(df_final)} rows to CSV and Excel!")
    else:
        print("FAILED: No rows extracted.")
"""

target_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\rebuild_driver_excel_final.py"

with open(target_path, "w", encoding="utf-8-sig") as f:
    f.write(script_content)
    
print("Successfully generated rebuild_driver_excel_final.py with UTF-8-sig encoding!")
