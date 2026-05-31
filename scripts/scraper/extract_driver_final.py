import os
import pandas as pd
from bs4 import BeautifulSoup
import warnings
import re

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

companies = ['DB손보', '메리츠화재', '삼성화재', 'KB손보', '현대해상', '한화손보', '롯데손보', '농협손보',
             '흥국화재', 'MG손보', 'AXA손보', 'AIG손보', '하나손보', '신한EZ손해보험']

driver_keywords = ["운전자", "교통사고", "벌금", "변호사", "교통상해", "부상치료", "자부상", "운전중",
                   "형사합의", "사고처리", "면허정지", "면허취소"]
driver_product_keys = ["운전자", "운전", "drive", "바이크", "마이바이크", "라이더", "교통"]
driver_coverage_keys = ["운전자용", "운전중", "교통사고처리지원", "변호사선임", "자동차사고벌금",
                        "벌금(대물)", "벌금Ⅱ", "부상치료비", "자부상", "교통상해사망", "교통상해후유장해"]
exclude_kws = ["치아", "치매", "간병", "뇌혈관", "허혈성", "암진단", "심장질환", "보철", "임플란트", "틀니", "치주", "잇몸"]


def is_driver_row(row_list, current_product):
    row_str = " ".join([str(v) for v in row_list])
    if any(ek in row_str for ek in exclude_kws):
        return False
    is_driver_product = bool(current_product and any(k in str(current_product).lower() for k in driver_product_keys))
    matched_kws = [kw for kw in driver_keywords if kw in row_str]
    if matched_kws:
        if is_driver_product:
            return True
        if any(k in row_str for k in driver_coverage_keys):
            return True
    return False


def parse_clean_premium(val):
    if pd.isna(val):
        return None
    val_str = str(val).strip()
    if not val_str or val_str.lower() in ('nan', 'none'):
        return None
    if len(val_str) > 15:
        return None
    clean = val_str.replace(' ', '')
    if clean.isdigit():
        num = int(clean)
        if 1000 <= num <= 200000:
            return num
    if re.match(r'^\d{1,3}(,\d{3})+$', clean):
        num = int(clean.replace(',', ''))
        if 1000 <= num <= 200000:
            return num
    m = re.match(r'^([\d,]+)원$', clean)
    if m:
        num_str = m.group(1).replace(',', '')
        if num_str.isdigit():
            num = int(num_str)
            if 1000 <= num <= 200000:
                return num
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

def build_row_data(row_list, last_company, last_product, filename):
    row_data = {col: "" for col in standard_cols}
    row_data["보험회사"] = last_company
    row_data["상품명"] = last_product
    row_str = " ".join([str(v) for v in row_list])
    row_data["구분"] = "특약" if "특약" in row_str else "주계약"

    for v in row_list:
        if any(k in v for k in ["벌금", "변호사", "교통사고", "부상치료", "자부상", "교통상해", "사망", "후유장해", "PM"]):
            row_data["담보명(급부명)"] = v
            break
    if not row_data["담보명(급부명)"] and len(row_list) > 0:
        row_data["담보명(급부명)"] = row_list[0]

    long_texts = [v for v in row_list if len(v) > 20 and v != last_product and v != row_data["담보명(급부명)"]]
    if long_texts:
        row_data["지급사유"] = long_texts[0]
        if len(long_texts) > 1:
            row_data["상세안내"] = long_texts[1]

    payout_candidates = [v for v in row_list if any(x in v for x in ["원", "배", "한도", "%", "지급", "보험가입금액"])]
    if payout_candidates:
        row_data["지급금액"] = payout_candidates[0]

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

    row_data["source_file"] = filename
    for i in range(min(len(row_list), 30)):
        row_data[f"원본_열_{i}"] = row_list[i]
    return row_data


def parse_html_file(filepath):
    filename = os.path.basename(filepath)
    rows = []
    try:
        content = None
        for enc in ['cp949', 'utf-8', 'euc-kr']:
            try:
                with open(filepath, 'r', encoding=enc, errors='ignore') as f:
                    content = f.read()
                if '<table' in content.lower():
                    break
            except Exception:
                continue
        if not content or '<table' not in content.lower():
            return []
        soup = BeautifulSoup(content, 'html.parser')
        table = soup.find('table')
        if not table:
            return []

        full_text = soup.get_text()
        last_company = next((c for c in companies if c[:2] in full_text), "")
        last_product = ""
        for tr in table.find_all('tr'):
            tds = tr.find_all(['td', 'th'])
            row_list = [" ".join(td.get_text().split()) for td in tds]
            if not row_list or len(row_list) < 2:
                continue
            for v in row_list:
                for c in companies:
                    if c in v:
                        last_company = c
                        break
            for v in row_list:
                if len(v) > 8 and '보험' in v and not any(x in v for x in companies) and \
                        not any(x in v for x in ['조회', '회사', '상품', '담보', '지급']):
                    last_product = v
                    break
            if is_driver_row(row_list, last_product):
                rows.append(build_row_data(row_list, last_company, last_product, filename))
        return rows
    except Exception as e:
        print(f"  HTML parse error {filename}: {e}")
        return []


def parse_excel_file(filepath):
    filename = os.path.basename(filepath)
    rows = []
    try:
        xl = pd.ExcelFile(filepath)
        for sheet in xl.sheet_names:
            df = xl.parse(sheet, header=None)
            full_text = df.to_string()
            last_company = next((c for c in companies if c[:2] in full_text), "")
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
                for v in row_list:
                    if len(v) > 8 and '보험' in v and not any(x in v for x in companies) and \
                            not any(x in v for x in ['조회', '회사', '상품', '담보', '지급']):
                        last_product = v
                        break
                if is_driver_row(row_list, last_product):
                    rows.append(build_row_data(row_list, last_company, last_product, filename))
        return rows
    except Exception as e:
        print(f"  Excel parse error {filename}: {e}")
        return []


if __name__ == "__main__":
    all_rows = []
    files = sorted([f for f in os.listdir(root_dir) if f.lower().endswith('.xls') or f.lower().endswith('.xlsx')])
    print(f"Processing {len(files)} files...")

    for filename in files:
        filepath = os.path.join(root_dir, filename)
        is_html = False
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                head = f.read(500)
                if "<html" in head.lower() or "<table" in head.lower():
                    is_html = True
        except Exception:
            pass

        file_rows = parse_html_file(filepath) if is_html else parse_excel_file(filepath)
        if file_rows:
            all_rows.extend(file_rows)
            print(f"  [{len(file_rows):4d}] {filename}")

    df_final = pd.DataFrame(all_rows)
    if df_final.empty:
        print("FAILED: No rows extracted.")
    else:
        def fix_company(row):
            comp = str(row['보험회사']).strip()
            if comp and comp not in ('nan', 'None', ''):
                return comp
            for c in companies:
                if c[:2] in str(row['상품명']):
                    return c
            return ""

        df_final['보험회사'] = df_final.apply(fix_company, axis=1)
        df_final = df_final[standard_cols]
        df_final.drop_duplicates(
            subset=['보험회사', '상품명', '담보명(급부명)', '지급사유', '지급금액', '가입금액', '가입보험료'],
            inplace=True
        )

        os.makedirs(os.path.dirname(output_csv), exist_ok=True)
        df_final.to_csv(output_csv, index=False, encoding='utf-8-sig')
        df_final.to_excel(output_xlsx, index=False)
        print(f"\n[완료] 총 {len(df_final)}행 저장 완료!")
        print(f"  CSV:  {output_csv}")
        print(f"  XLSX: {output_xlsx}")
        
        # Summary by company
        print("\n--- 보험사별 행 수 ---")
        if '보험회사' in df_final.columns:
            print(df_final['보험회사'].value_counts().to_string())
