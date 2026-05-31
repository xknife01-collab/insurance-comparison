import pandas as pd
import os
import sys

CSV_PATH = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\3_family\child\extracted_data.csv"
XLSX_PATH = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\3_family\child\extracted_data.xlsx"

def verify():
    # 1. 파일 존재 여부 확인
    if not os.path.exists(CSV_PATH):
        print(f"[FAIL] CSV file does not exist: {CSV_PATH}")
        sys.exit(1)
    if not os.path.exists(XLSX_PATH):
        print(f"[FAIL] Excel file does not exist: {XLSX_PATH}")
        sys.exit(1)
        
    print("[PASS] Both CSV and Excel files exist.")
    
    # 2. CSV 검증
    try:
        df_csv = pd.read_csv(CSV_PATH, encoding='utf-8-sig')
        print(f"[PASS] CSV read successfully. Row count: {len(df_csv)}, Column count: {len(df_csv.columns)}")
    except Exception as e:
        print(f"[FAIL] Failed to read CSV: {e}")
        sys.exit(1)
        
    # 3. Excel 검증
    try:
        df_xlsx = pd.read_excel(XLSX_PATH)
        print(f"[PASS] Excel read successfully. Row count: {len(df_xlsx)}, Column count: {len(df_xlsx.columns)}")
    except Exception as e:
        print(f"[FAIL] Failed to read Excel: {e}")
        sys.exit(1)
        
    # 4. 열 개수 및 스키마 검증 (46개 열)
    if len(df_csv.columns) != 46:
        print(f"[FAIL] CSV column count is not 46. Found: {len(df_csv.columns)}")
        sys.exit(1)
    if len(df_xlsx.columns) != 46:
        print(f"[FAIL] Excel column count is not 46. Found: {len(df_xlsx.columns)}")
        sys.exit(1)
        
    print("[PASS] Column counts are exactly 46.")
    
    # 열 이름 검증
    expected_core = [
        "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
        "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율",
        "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "source_file"
    ]
    expected_raw = [f"원본_열_{i}" for i in range(30)]
    expected_cols = expected_core + expected_raw
    
    if list(df_csv.columns) != expected_cols:
        print("[FAIL] CSV columns do not match expected schema.")
        print(f"Expected: {expected_cols[:5]} ... {expected_cols[-5:]}")
        print(f"Found: {list(df_csv.columns)[:5]} ... {list(df_csv.columns)[-5:]}")
        sys.exit(1)
        
    print("[PASS] Columns names match the standard caregiving schema exactly.")
    
    # 5. 불하 키워드 검사 (유병자 보험 제외 검증)
    exclude_keywords = ["유병", "간편", "3.2.5", "3.3.5", "3.5.5", "심사형", "경증"]
    for kw in exclude_keywords:
        matching_rows = df_csv[df_csv['상품명'].str.contains(kw, na=False)]
        if len(matching_rows) > 0:
            print(f"[FAIL] Found {len(matching_rows)} rows containing excluded keyword '{kw}' in 상품명!")
            print(matching_rows['상품명'].unique())
            sys.exit(1)
            
    print("[PASS] Excluded keywords are not present in 상품명.")
    
    # 6. 유니크 상품 정보 출력
    unique_prods = df_csv['상품명'].dropna().unique()
    print("\n--- Extracted Products List ---")
    for idx, prod in enumerate(unique_prods):
        company = df_csv[df_csv['상품명'] == prod]['보험회사'].iloc[0]
        count = len(df_csv[df_csv['상품명'] == prod])
        print(f"[{idx+1}] {company} - {prod} ({count} rows)")
    print("--------------------------------")

if __name__ == "__main__":
    verify()
