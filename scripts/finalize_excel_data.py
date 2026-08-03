import pandas as pd
import re
import os
import warnings

warnings.filterwarnings('ignore')

TARGET_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_extracted_data.xlsx"

def clean_money(v):
    if pd.isna(v) or v == "": return 0
    v = str(v).replace(',', '').replace('원', '').strip()
    nums = re.findall(r'\d+', v)
    return int(nums[0]) if nums else 0

def finalize_excel_data_v3():
    if not os.path.exists(TARGET_FILE): return
    df = pd.read_excel(TARGET_FILE).astype(object)
    
    # 1. 아이 보험 삭제
    child_keywords = ["아이미래", "어린이", "자녀", "아이"]
    def is_child(x):
        x_str = str(x) if pd.notna(x) else ""
        return any(kw in x_str for kw in child_keywords)
        
    initial_count = len(df)
    df = df[~df.iloc[:, 1].apply(is_child)]
    print(f"Removed {initial_count - len(df)} rows of child insurance.")

    # 2. 고액 상품 월납 환산
    # 사용자가 명시한 키워드와 금액 기준
    high_keywords = ["KDB", "WON", "미래", "Dream", "GI", "평생"]
    
    fixed_count = 0
    for idx, row in df.iterrows():
        prod = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ""
        m_val = clean_money(row['남성보험료'])
        f_val = clean_money(row['여성보험료'])
        
        # 조건: 사용자가 지목한 상품이거나 보험료가 100만원 이상인 경우
        if any(kw in prod for kw in high_keywords) or m_val > 500000:
            if m_val > 100000:
                # 기본적으로 20년납(240)으로 나누기
                m_monthly = int(m_val / 240)
                f_monthly = int(f_val / 240)
                
                # 만약 동양생명(아이보험 제외하고 남은 것 중) 등이 1년납인 것 같다면 별도 처리 가능하나
                # 현재는 사용자가 말한 'KDB 포함 고액상품 240으로 나누기'에 집중합니다.
                
                df.at[idx, '남성보험료'] = f"{m_monthly:,} 원"
                df.at[idx, '여성보험료'] = f"{f_monthly:,} 원"
                df.iloc[idx, 8] = f"{m_monthly:,} 원" # 가입보험료 업데이트
                fixed_count += 1

    # 저장
    df.to_excel(TARGET_FILE, index=False)
    df.to_csv(TARGET_FILE.replace(".xlsx", ".csv"), index=False, encoding='utf-8-sig')
    print(f"Finalized {fixed_count} rows to monthly amounts.")

if __name__ == "__main__":
    finalize_excel_data_v3()
