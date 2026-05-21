import pandas as pd
import re
import os
import warnings

warnings.filterwarnings('ignore')

TARGET_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_extracted_data.xlsx"

def clean_money(v):
    if pd.isna(v): return 0
    v = str(v).replace(',', '').replace('원', '').strip()
    nums = re.findall(r'\d+', v)
    return int(nums[0]) if nums else 0

def calculate_gender_totals_desc():
    if not os.path.exists(TARGET_FILE):
        print("파일을 찾을 수 없습니다.")
        return
        
    df = pd.read_excel(TARGET_FILE)
    
    # 남성/여성 보험료 숫자화
    df['m_val'] = df['남성보험료'].apply(clean_money)
    df['f_val'] = df['여성보험료'].apply(clean_money)
    
    results = []
    grouped = df.groupby([df.iloc[:, 0], df.iloc[:, 1]])
    
    for (co, prod), group in grouped:
        m_total = group['m_val'].sum()
        f_total = group['f_val'].sum()
        
        if m_total > 0:
            results.append({
                "보험회사": co,
                "상품명": str(prod)[:40],
                "남성 총보험료": m_total,
                "여성 총보험료": f_total
            })
    
    # 내림차순(False) 정렬
    res_df = pd.DataFrame(results).sort_values(by="남성 총보험료", ascending=False)
    
    if not res_df.empty:
        print("\n=== [심장질환 보험: 상품별 남녀 합산 보험료 리스트 (최고가순)] ===")
        display_df = res_df.copy()
        display_df['남성 총보험료'] = display_df['남성 총보험료'].apply(lambda x: f"{x:,}원")
        display_df['여성 총보험료'] = display_df['여성 총보험료'].apply(lambda x: f"{x:,}원")
        
        print(display_df.head(30).to_string(index=False))
        print(f"\n* 총 {len(res_df)}개의 상품이 계산되었습니다.")

if __name__ == "__main__":
    calculate_gender_totals_desc()
