import os
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

BASE_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_FILE = os.path.join(BASE_PATH, "insurance-comparison-main", "insurance_data", "1_guaranteed", "heart", "heart_extracted_data.xlsx")

# 회사명 키워드 (밀림 감지용)
CO_KEYWORDS = ["생명", "화재", "해상", "보험", "손해", "메리츠", "한화", "삼성", "흥국", "교보", "신한", "DB", "KDB", "IBK", "DGB", "하나", "농협", "KB", "ABL", "동양", "라이나", "AIA", "푸르덴셜", "미래에셋"]

def clean_str(v):
    if pd.isna(v): return ""
    v = str(v).strip()
    if v.lower() in ["nan", "none", "nan.0"]: return ""
    return v

def fix_all_alignments():
    if not os.path.exists(TARGET_FILE):
        print(f"Error: {TARGET_FILE} not found.")
        return

    print("Loading current excel...")
    df = pd.read_excel(TARGET_FILE)
    
    fixed_count = 0
    
    for idx, row in df.iterrows():
        co = clean_str(row["보험회사"])
        prod = clean_str(row["상품명"])
        
        # [밀림 감지 로직]
        # 보험회사가 비어있고 상품명에 회사 키워드가 있는 경우
        # 또는 보험회사에 회사 키워드가 없고 상품명에 있는 경우 등
        is_misaligned = False
        if co == "" and any(kw in prod for kw in CO_KEYWORDS):
            is_misaligned = True
        
        if is_misaligned:
            # 원본 열(0~29) 데이터를 다시 확인하여 한 칸씩 당김
            # 원본_열_1에 회사가 있고, 2에 상품명이 있는 경우임
            df.at[idx, "보험회사"] = clean_str(row["원본_열_1"])
            df.at[idx, "상품명"] = clean_str(row["원본_열_2"])
            df.at[idx, "구분"] = clean_str(row["원본_열_3"])
            df.at[idx, "담보명(급부명)"] = clean_str(row["원본_열_4"])
            df.at[idx, "지급사유"] = clean_str(row["원본_열_5"])
            df.at[idx, "지급금액"] = clean_str(row["원본_열_6"])
            df.at[idx, "가입금액"] = clean_str(row["원본_열_7"])
            df.at[idx, "기준보험료"] = clean_str(row["원본_열_8"])
            df.at[idx, "가입보험료"] = clean_str(row["원본_열_9"])
            
            # 추가 정보 필드들도 한 칸씩 당김
            df.at[idx, "적용이율"] = clean_str(row["원본_열_10"])
            df.at[idx, "갱신구분"] = clean_str(row["원본_열_11"])
            df.at[idx, "판매채널"] = clean_str(row["원본_열_12"])
            df.at[idx, "기준일자"] = clean_str(row["원본_열_13"])
            df.at[idx, "상세안내"] = clean_str(row["원본_열_14"])
            df.at[idx, "연락처"] = clean_str(row["원본_열_15"])
            
            fixed_count += 1

    # 저장
    df.to_excel(TARGET_FILE, index=False)
    # CSV도 동기화
    csv_path = TARGET_FILE.replace(".xlsx", ".csv")
    df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    
    print(f"Total rows scanned: {len(df)}")
    print(f"Total rows corrected: {fixed_count}")
    print(f"Successfully fixed and saved to {TARGET_FILE}")

if __name__ == "__main__":
    fix_all_alignments()
