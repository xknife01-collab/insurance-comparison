import os
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

BASE_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_FILE = os.path.join(BASE_PATH, "insurance-comparison-main", "insurance_data", "1_guaranteed", "heart", "heart_extracted_data.xlsx")

def clean_str(v):
    if pd.isna(v): return ""
    v = str(v).strip()
    if v.lower() in ["nan", "none", "nan.0"]: return ""
    return v

def fix_misaligned():
    if not os.path.exists(TARGET_FILE):
        print(f"Error: {TARGET_FILE} not found.")
        return

    print("Loading current excel...")
    df_main = pd.read_excel(TARGET_FILE)
    
    corrected_rows = []
    processed_filenames = []

    # 파일 목록에서 타겟 찾기
    all_files = os.listdir(BASE_PATH)
    targets = []
    
    for f in all_files:
        # file_40.xls 찾기
        if "file_40.xls" in f:
            targets.append(f)
        # (11)이 포함된 한글 깨진 파일 찾기
        if "(11).xls" in f:
            targets.append(f)
            
    if not targets:
        print("No target files found.")
        return

    for filename in targets:
        file_path = os.path.join(BASE_PATH, filename)
        print(f"Re-extracting {filename}...")
        processed_filenames.append(filename)
        
        try:
            df_src = pd.read_excel(file_path)
        except Exception as e:
            print(f"Failed to read {filename}: {e}")
            continue
        
        # 헤더 탐색
        header_row = -1
        for i in range(min(30, len(df_src))):
            row_vals = [str(v) for v in df_src.iloc[i].tolist()]
            row_joined = "".join(row_vals)
            # 한글 깨짐 대비 영어 키워드나 핵심 글자 일부만 체크
            if any(k in row_joined for k in ["보험회사", "상품명", "담보명", "지급사유"]):
                header_row = i
                break
        
        if header_row == -1:
            # 헤더를 못 찾으면 0번부터 시도
            header_row = 0
            print(f"Header not found in {filename}, starting from row 0.")
        
        df_data = df_src.iloc[header_row + 1:].copy()
        keywords = ["심장", "허혈성", "심근경색", "부정맥", "빈맥"]
        mask = df_data.astype(str).apply(lambda x: x.str.contains('|'.join(keywords), case=False, na=False)).any(axis=1)
        heart_rows = df_data[mask]
        
        print(f"Found {len(heart_rows)} rows in {filename}")
        
        for _, row in heart_rows.iterrows():
            row_list = row.tolist()
            new_row = {col: "" for col in df_main.columns}
            
            # [교정] 이 파일들은 1번 열이 보험회사, 2번이 상품명...
            if len(row_list) > 1: new_row["보험회사"] = clean_str(row_list[1])
            if len(row_list) > 2: new_row["상품명"] = clean_str(row_list[2])
            if len(row_list) > 3: new_row["구분"] = clean_str(row_list[3])
            if len(row_list) > 4: new_row["담보명(급부명)"] = clean_str(row_list[4])
            if len(row_list) > 5: new_row["지급사유"] = clean_str(row_list[5])
            if len(row_list) > 6: new_row["지급금액"] = clean_str(row_list[6])
            if len(row_list) > 7: new_row["가입금액"] = clean_str(row_list[7])
            if len(row_list) > 8: new_row["기준보험료"] = clean_str(row_list[8])
            if len(row_list) > 9: new_row["가입보험료"] = clean_str(row_list[9])
            
            new_row["source_file"] = filename
            
            for i, val in enumerate(row_list[:30]):
                new_row[f"원본_열_{i}"] = clean_str(val)
                
            corrected_rows.append(new_row)

    # 3. 기존 데이터에서 문제가 된 파일의 행들 제거
    df_main_cleaned = df_main[~df_main["source_file"].isin(processed_filenames)].copy()
    
    # 4. 결합
    df_corrected = pd.DataFrame(corrected_rows)
    df_final = pd.concat([df_main_cleaned, df_corrected], ignore_index=True)
    
    # 5. 저장
    df_final.to_excel(TARGET_FILE, index=False)
    print(f"Successfully fixed and saved to {TARGET_FILE}")

if __name__ == "__main__":
    fix_misaligned()
