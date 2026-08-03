import os
import pandas as pd
import re
import warnings

warnings.filterwarnings('ignore')

BASE_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_FILE = os.path.join(BASE_PATH, "insurance-comparison-main", "insurance_data", "1_guaranteed", "heart", "heart_extracted_data.xlsx")

def clean_str(v):
    if pd.isna(v): return ""
    v = str(v).strip()
    if v.lower() in ["nan", "none", "nan.0"]: return ""
    return v

def is_date(v):
    return bool(re.match(r'\d{4}-\d{2}-\d{2}', v))

def is_phone(v):
    return any(c.isdigit() for c in v) and "-" in v and len(v) < 20

def is_rate(v):
    return "%" in v and len(v) < 15 and any(c.isdigit() for c in v)

def fix_with_smart_mapping_final_v4():
    if not os.path.exists(TARGET_FILE): return

    print("Loading excel for final smart fixing (v4)...")
    # 모든 데이터를 일단 문자열로 읽음
    df = pd.read_excel(TARGET_FILE).astype(object)
    
    CO_KEYWORDS = ["생명", "화재", "해상", "보험", "손해", "메리츠", "한화", "삼성", "흥국", "교보", "신한", "DB", "KDB", "IBK", "DGB", "하나", "농협", "KB", "ABL", "동양", "라이나", "AIA", "푸르덴셜", "미래에셋", "iM", "AIG", "롯데", "MG"]
    
    for idx, row in df.iterrows():
        # 원본 열 추출
        ov = [clean_str(row[f"원본_열_{i}"]) for i in range(30)]
        
        # 0:보험회사, 1:상품명, 2:구분, 3:담보명, 4:지급사유, 5:지급금액, 6:가입금액, 
        # 7:기준보험료, 8:가입보험료, 9:적용이율, 10:갱신구분, 11:판매채널, 12:기준일자, 13:상세안내, 14:연락처
        new_row = [""] * 15
        
        # 1. 보험회사/상품명/구분/담보명 (가장 중요한 0~3번)
        # 만약 0번이 비어있거나 1번에 회사가 있으면 밀림 해결
        if ov[0] == "" and any(kw in ov[1] for kw in CO_KEYWORDS):
            new_row[0], new_row[1], new_row[2], new_row[3] = ov[1], ov[2], ov[3], ov[4]
            search_start = 5
        elif any(kw in ov[1] for kw in CO_KEYWORDS) and not any(kw in ov[0] for kw in CO_KEYWORDS):
            new_row[0], new_row[1], new_row[2], new_row[3] = ov[1], ov[2], ov[3], ov[4]
            search_start = 5
        else:
            new_row[0], new_row[1], new_row[2], new_row[3] = ov[0], ov[1], ov[2], ov[3]
            search_start = 4

        # 2. 내용 기반 배치
        for i in range(search_start, 30):
            val = ov[i]
            if val == "": continue
            
            # 지급사유 (길이가 적당히 길어야 함)
            if new_row[4] == "" and len(val) > 30 and i < 8:
                new_row[4] = val
            # 이율
            elif new_row[9] == "" and is_rate(val) and "100%" not in val:
                new_row[9] = val
            # 날짜
            elif new_row[12] == "" and is_date(val):
                new_row[12] = val
            # 연락처
            elif new_row[14] == "" and is_phone(val):
                new_row[14] = val
            # 판매채널
            elif new_row[11] == "" and any(kw in val for kw in ["대면", "온라인", "CM", "TM", "다이렉트"]):
                new_row[11] = val
            # 금액/보험료 (5,6,7,8) - '원' 포함 + 너무 길지 않아야 함 (안내문구 배제)
            elif ("원" in val or "만원" in val) and len(val) < 25:
                for j in [5, 6, 7, 8]:
                    if new_row[j] == "":
                        new_row[j] = val
                        break
        
        # 3. 상세안내 (원본_열_21 또는 28 등 가장 긴 텍스트)
        all_text = sorted(ov, key=len, reverse=True)
        new_row[13] = all_text[0] if len(all_text[0]) > 50 else ""

        # 데이터프레임 업데이트
        for col_idx in range(15):
            df.iloc[idx, col_idx] = new_row[col_idx]

    # 저장
    df.to_excel(TARGET_FILE, index=False)
    df.to_csv(TARGET_FILE.replace(".xlsx", ".csv"), index=False, encoding='utf-8-sig')
    print(f"Final Smart Fix Complete. Processed {len(df)} rows.")

if __name__ == "__main__":
    fix_with_smart_mapping_final_v4()
