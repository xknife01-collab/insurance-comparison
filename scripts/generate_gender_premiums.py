import os
import pandas as pd
import re
import warnings

warnings.filterwarnings('ignore')

TARGET_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_extracted_data.xlsx"

def clean_money(v):
    if pd.isna(v): return 0
    v = str(v).replace(',', '').replace('원', '').strip()
    nums = re.findall(r'\d+', v)
    return int(nums[0]) if nums else 0

def process_gender_premiums_v2():
    if not os.path.exists(TARGET_FILE): return
    
    print("Loading excel for gender premium generation (v2)...")
    # 처음부터 모든 컬럼을 object로 읽어 타입 충돌 방지
    df = pd.read_excel(TARGET_FILE).astype(object)
    
    # 9, 10번 위치에 빈 문자열로 컬럼 생성
    if '남성보험료' not in df.columns:
        df.insert(9, '남성보험료', "")
    if '여성보험료' not in df.columns:
        df.insert(10, '여성보험료', "")

    # 남녀 배율 (심장질환 기준 약 1.55배)
    RATIO = 1.55
    
    count = 0
    for idx, row in df.iterrows():
        # 현재 보험료 추출
        curr_val = clean_money(row.iloc[8]) # 가입보험료
        if curr_val == 0:
            curr_val = clean_money(row.iloc[7]) # 기준보험료
            
        if curr_val == 0: continue
        
        # 상품명(1) 및 담보명(3) 텍스트 분석
        full_text = str(row.iloc[1]) + " " + str(row.iloc[3])
        
        male_val = 0
        female_val = 0
        
        # 성별 판별 및 계산
        if any(kw in full_text for kw in ["(여)", "여성", "여자"]):
            female_val = curr_val
            male_val = int(female_val * RATIO)
        elif any(kw in full_text for kw in ["(남)", "남성", "남자"]):
            male_val = curr_val
            female_val = int(male_val / RATIO)
        else:
            # 성별 구분이 없으면 '남성' 기준으로 간주하여 계산
            male_val = curr_val
            female_val = int(male_val / RATIO)
            
        # 값 적용 (포맷팅 포함)
        df.at[idx, '남성보험료'] = f"{male_val:,} 원" if male_val > 0 else ""
        df.at[idx, '여성보험료'] = f"{female_val:,} 원" if female_val > 0 else ""
        count += 1

    # 저장
    df.to_excel(TARGET_FILE, index=False)
    df.to_csv(TARGET_FILE.replace(".xlsx", ".csv"), index=False, encoding='utf-8-sig')
    print(f"Gender premium generation complete. Processed {count} rows.")

if __name__ == "__main__":
    process_gender_premiums_v2()
