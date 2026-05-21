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
                new_row["기준보험료"] = new_row["원본_열_7"]
                new_row["가입보험료"] = new_row["원본_열_8"]
                
                # 추가 정보가 있을 경우 (9번 이후)
                # 보통 적용이율(9), 갱신구분(10), 판매채널(11), 기준일자(12)... 순서임
                # 단, 원본 데이터에 해당 내용이 있는 경우만 채움
                cols_extra = ["적용이율", "갱신구분", "판매채널", "기준일자", "상세안내", "연락처"]
                for i, col_name in enumerate(cols_extra):
                    if (9 + i) < len(row_list):
                        new_row[col_name] = clean_val(row_list[9 + i])

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
        
        print(f"\n✅ 최종 완료! 건수: {len(final_df)}건")
        print(f" - 파일: {xlsx_path}")
    else:
        print("\n❌ 추출 실패")

if __name__ == "__main__":
    process_files()
