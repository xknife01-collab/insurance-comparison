import os
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

BASE_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_FILE = os.path.join(BASE_PATH, "insurance-comparison-main", "insurance_data", "1_guaranteed", "heart", "heart_extracted_data.xlsx")

# 확장된 회사명 키워드
CO_KEYWORDS = [
    "생명", "화재", "해상", "보험", "손해", "메리츠", "한화", "삼성", "흥국", "교보", 
    "신한", "DB", "KDB", "IBK", "DGB", "하나", "농협", "KB", "ABL", "동양", 
    "라이나", "AIA", "푸르덴셜", "미래에셋", "iM", "AIG", "롯데", "MG", "카카오", "토스"
]

def clean_str(v):
    if pd.isna(v): return ""
    v = str(v).strip()
    if v.lower() in ["nan", "none", "nan.0"]: return ""
    return v

def fix_all_misalignments_final():
    if not os.path.exists(TARGET_FILE): return
    df = pd.read_excel(TARGET_FILE).astype(object)
    
    fixed_count = 0
    
    for idx, row in df.iterrows():
        # 원본 열 0~29번 추출
        ov = [clean_str(row[f"원본_열_{i}"]) for i in range(30)]
        
        corrected = False
        new_row_vals = [""] * 15
        
        # [패턴 1] col_0이 비어있고 col_1에 회사명이 있는 경우 (롯데, AIG 등)
        if ov[0] == "" and any(kw in ov[1] for kw in CO_KEYWORDS):
            new_row_vals[0] = ov[1] # 보험회사
            new_row_vals[1] = ov[2] # 상품명
            new_row_vals[2] = ov[3] # 구분
            new_row_vals[3] = ov[4] # 담보명
            new_row_vals[4] = ov[5] # 지급사유
            corrected = True
        
        # [패턴 2] col_0에 회사명(iM 등)이 있고 col_1에 상품명이 있는 경우
        elif any(kw in ov[0] for kw in CO_KEYWORDS) and corrected == False:
            new_row_vals[0] = ov[0]
            new_row_vals[1] = ov[1]
            new_row_vals[2] = ov[2]
            new_row_vals[3] = ov[3]
            new_row_vals[4] = ov[4]
            corrected = True
            
        # [패턴 3] 현재 '보험회사' 칸에 상품명이 들어가 있는 경우 (위의 로직이 실패했을 때를 대비한 보정)
        # 만약 '보험회사' 칸의 글자수가 너무 길고 '구분' 칸이 '특약'이라면 밀린 것으로 간주
        curr_co = clean_str(row.iloc[0])
        curr_gu = clean_str(row.iloc[2])
        if len(curr_co) > 15 and (curr_gu == "특약" or "담보" in curr_gu):
            # 한 칸씩 당기기
            new_row_vals[0] = ov[0] if ov[0] != "" else ov[1]
            new_row_vals[1] = ov[1] if ov[0] != "" else ov[2]
            new_row_vals[2] = ov[2] if ov[0] != "" else ov[3]
            new_row_vals[3] = ov[3] if ov[0] != "" else ov[4]
            new_row_vals[4] = ov[4] if ov[0] != "" else ov[5]
            corrected = True

        if corrected:
            # 기본 정렬 필드 업데이트
            for col_idx in range(5):
                df.iloc[idx, col_idx] = new_row_vals[col_idx]
            
            # 금액 및 보험료 필드 재배치 (스마트 로직 유지)
            # '원'이나 '만원'이 들어있는 열을 찾아서 5,6,7,8번에 순서대로 배정
            amt_fields = [5, 6, 7, 8]
            found_amt_idx = 0
            for i in range(4, 15):
                val = ov[i]
                if ("원" in val or "만원" in val) and len(val) < 40 and found_amt_idx < 4:
                    df.iloc[idx, amt_fields[found_amt_idx]] = val
                    found_amt_idx += 1
            
            # 이율, 연락처 등 (이미 잘 작동하던 로직)
            for i in range(7, 30):
                val = ov[i]
                if "%" in val and len(val) < 15 and any(c.isdigit() for c in val):
                    df.iloc[idx, 9] = val # 적용이율
                if any(c.isdigit() for c in val) and "-" in val and len(val) < 20:
                    df.iloc[idx, 14] = val # 연락처
                if any(kw in val for kw in ["대면", "온라인", "CM", "TM"]):
                    df.iloc[idx, 11] = val # 판매채널

            fixed_count += 1

    # 저장
    df.to_excel(TARGET_FILE, index=False)
    df.to_csv(TARGET_FILE.replace(".xlsx", ".csv"), index=False, encoding='utf-8-sig')
    print(f"Final cleanup finished. Corrected {fixed_count} rows.")

if __name__ == "__main__":
    fix_all_misalignments_final()
