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

def calculate_filtered():
    if not os.path.exists(TARGET_FILE):
        print("파일을 찾을 수 없습니다.")
        return
        
    df = pd.read_excel(TARGET_FILE)
    
    # 보험료 추출
    df['val'] = df.apply(lambda r: clean_money(r.iloc[8]) if clean_money(r.iloc[8]) > 0 else clean_money(r.iloc[7]), axis=1)
    
    results = []
    # 보험회사(0번) + 상품명(1번)으로 그룹화
    grouped = df.groupby([df.iloc[:, 0], df.iloc[:, 1]])
    
    for (co, prod), group in grouped:
        # 주계약(2번 열)이 포함되어 있는지 확인
        has_main = group.iloc[:, 2].astype(str).str.contains('주계약|기본', na=False).any()
        
        if has_main:
            main_sum = group[group.iloc[:, 2].astype(str).str.contains('주계약|기본', na=False)]['val'].sum()
            rider_sum = group[group.iloc[:, 2].astype(str).str.contains('특약|선택', na=False)]['val'].sum()
            total = main_sum + rider_sum
            
            if total > 0:
                results.append({
                    "보험회사": co,
                    "상품명": str(prod)[:40],
                    "주계약": main_sum,
                    "특약": rider_sum,
                    "합계": total
                })
    
    # 데이터프레임 생성 및 '합계' 기준 오름차순 정렬
    res_df = pd.DataFrame(results).sort_values(by="합계", ascending=True)
    
    if not res_df.empty:
        print("\n=== [심장질환 보험: 주계약 포함 상품 리스트 (최저가순)] ===")
        # 보기 좋게 포맷팅
        display_df = res_df.copy()
        display_df['주계약'] = display_df['주계약'].apply(lambda x: f"{x:,}원")
        display_df['특약'] = display_df['특약'].apply(lambda x: f"{x:,}원")
        display_df['합계'] = display_df['합계'].apply(lambda x: f"{x:,}원")
        
        print(display_df.head(40).to_string(index=False))
        print(f"\n* 총 {len(res_df)}개의 주계약 포함 상품이 발견되었습니다.")
    else:
        print("조건에 맞는 상품이 없습니다.")

if __name__ == "__main__":
    calculate_filtered()
