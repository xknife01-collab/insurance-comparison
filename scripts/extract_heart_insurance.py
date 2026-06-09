import os
import pandas as pd
import numpy as np
import warnings

# 경고 무시
warnings.filterwarnings('ignore')

# 설정
SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart"
REFERENCE_COLS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", "지급금액", "가입금액", 
    "기준보험료", "가입보험료", "적용이율", "갱신구분", "판매채널", "기준일자", 
    "상세안내", "연락처", "source_file"
]
ORIGIN_COLS = [f"원본_열_{i}" for i in range(30)]
ALL_COLS = REFERENCE_COLS + ORIGIN_COLS

HEART_KEYWORDS = ["심장", "허혈성", "심근경색", "부정맥", "빈맥", "심부전", "판막", "심뇌", "심혈관"]

def detect_payment_cycle(product_name, detail_text):
    combined = f"{product_name} {detail_text}".lower().replace(" ", "")
    if "일시납" in combined or "하루" in combined or "1회납" in combined:
        return "일시납"
    elif "연납" in combined or "년납" in combined or "1년납" in combined:
        return "연납"
    elif "월납" in combined:
        return "월납"
    return "월납"

def extract_number(val_str):
    if pd.isna(val_str) or val_str is None:
        return 0
    s = str(val_str).replace(",", "").replace(" ", "").replace("원", "")
    if not s or s == "-":
        return 0
    try:
        return float(s)
    except:
        import re
        m = re.search(r'(\d+(\.\d+)?)', s)
        if m:
            return float(m.group(1))
        return 0

def extract_payment_months(text):
    import re
    normalized_text = text.replace(" ", "").replace("\n", "")
    
    m = re.search(r'(\d+)년납', normalized_text)
    if m:
        return int(m.group(1)) * 12
        
    m = re.search(r'(\d+)년납입', normalized_text)
    if m:
        return int(m.group(1)) * 12
        
    if "일시납" in normalized_text or "일시납입" in normalized_text:
        return 240 # 일시납 비교 기준 20년납 준용
        
    return 240

def clean_val(val):
    if pd.isna(val) or val is None: return ""
    val = str(val).strip()
    if val.lower() in ["nan", "none", "null", "-", "nan.0"]: return ""
    return " ".join(val.split())

def load_file(file_path):
    try:
        # 1. 일반 엑셀
        return pd.read_excel(file_path)
    except:
        try:
            # 2. HTML
            tables = pd.read_html(file_path, flavor='bs4')
            if tables:
                return max(tables, key=lambda x: x.shape[1])
        except:
            return None

def process_files():
    if not os.path.exists(TARGET_DIR): os.makedirs(TARGET_DIR)
    
    all_heart_data = []
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(('.xls', '.xlsx'))]
    print(f"총 {len(files)}개 파일 분석 시작...")

    for idx, filename in enumerate(files):
        file_path = os.path.join(SOURCE_DIR, filename)
        df = load_file(file_path)
        if df is None or df.empty: continue

        # 데이터 클리닝 및 필터링
        # 협회 데이터는 보통 0~5번 열 사이에 키워드가 있음
        mask = df.astype(str).apply(lambda x: x.str.contains('|'.join(HEART_KEYWORDS), case=False, na=False)).any(axis=1)
        heart_rows = df[mask]

        if not heart_rows.empty:
            print(f"[{idx+1}/{len(files)}] {filename} -> {len(heart_rows)}건 추출 중")
            for _, row in heart_rows.iterrows():
                row_list = row.tolist()
                new_row = {col: "" for col in ALL_COLS}
                
                # 원본 데이터 매핑
                for i, val in enumerate(row_list[:30]):
                    new_row[f"원본_열_{i}"] = clean_val(val)
                
                # 핵심 열 매핑 (표준 협회 레이아웃 적용)
                # 원본 데이터에서 직접 추출하여 열 밀림 방지
                new_row["보험회사"] = new_row["원본_열_0"]
                new_row["상품명"] = new_row["원본_열_1"]
                new_row["구분"] = new_row["원본_열_2"]
                new_row["담보명(급부명)"] = new_row["원본_열_3"]
                new_row["지급사유"] = new_row["원본_열_4"]
                new_row["지급금액"] = new_row["원본_열_5"]
                new_row["가입금액"] = new_row["원본_열_6"]
                # 추가 정보가 있을 경우 (9번 이후)
                # 보통 적용이율(9), 갱신구분(10), 판매채널(11), 기준일자(12)... 순서임
                # 단, 원본 데이터에 해당 내용이 있는 경우만 채움
                cols_extra = ["적용이율", "갱신구분", "판매채널", "기준일자", "상세안내", "연락처"]
                for i, col_name in enumerate(cols_extra):
                    if (9 + i) < len(row_list):
                        new_row[col_name] = clean_val(row_list[9 + i])

                # 납입 형태(월납, 연납, 일시납) 판정 및 월납 환산
                row_all_text = " ".join([str(x) for x in row_list if pd.notna(x)])
                cycle = detect_payment_cycle(new_row["상품명"], row_all_text)
                months = extract_payment_months(row_all_text)
                
                male_raw = new_row["원본_열_7"]
                female_raw = new_row["원본_열_8"]
                
                male_num = extract_number(male_raw)
                female_num = extract_number(female_raw)
                
                # 스마트 보정 알고리즘
                if cycle in ["연납", "일시납"]:
                    if male_num >= 500000:
                        male_num = male_num / float(months)
                    else:
                        male_num = male_num / 12.0
                    
                    if female_num >= 500000:
                        female_num = female_num / float(months)
                    else:
                        female_num = female_num / 12.0
                else:
                    # 월납 혹은 미분류이지만 비정상적으로 총납입보험료가 기재된 경우 보정
                    if male_num >= 1000000:
                        male_num = male_num / float(months)
                    elif male_num > 150000:
                        male_num = male_num / 12.0
                        
                    if female_num >= 1000000:
                        female_num = female_num / float(months)
                    elif female_num > 150000:
                        female_num = female_num / 12.0

                new_row["기준보험료"] = f"{int(round(male_num))} 원" if male_num > 0 else ""
                new_row["가입보험료"] = f"{int(round(female_num))} 원" if female_num > 0 else ""
                new_row["source_file"] = filename
                all_heart_data.append(new_row)

    if all_heart_data:
        final_df = pd.DataFrame(all_heart_data)
        
        # 1. 빈 상품명/담보명 행 제거 (가끔 헤더가 검색되는 경우 방지)
        final_df = final_df[final_df["상품명"] != ""]
        final_df = final_df[final_df["담보명(급부명)"] != ""]
        
        # 2. 저장
        xlsx_path = os.path.join(TARGET_DIR, "heart_extracted_data.xlsx")
        csv_path = os.path.join(TARGET_DIR, "heart_extracted_data.csv")
        final_df.to_excel(xlsx_path, index=False)
        final_df.to_csv(csv_path, index=False, encoding='utf-8-sig')
        
        print(f"\n[+] 최종 완료! 건수: {len(final_df)}건")
        print(f" - 파일: {xlsx_path}")
    else:
        print("\n[-] 추출 실패")

if __name__ == "__main__":
    process_files()
