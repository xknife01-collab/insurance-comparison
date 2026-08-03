import pandas as pd
import re
import os
import warnings

warnings.filterwarnings('ignore')

TARGET_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_extracted_data.xlsx"

def analyze_periods():
    if not os.path.exists(TARGET_FILE): return
    df = pd.read_excel(TARGET_FILE)
    
    targets = [
        "KDB심장보험", "우리WON건강", "iM 평생건강보험", 
        "미래를 다지는", "GI보장보험", "The(더) Dream", 
        "우리아이미래보장보험", "신한건강보험"
    ]
    
    print("\n=== [고액 상품 납입 기간 및 월납 환산 분석] ===")
    
    seen_prods = set()
    
    for idx, row in df.iterrows():
        prod = str(row.iloc[1])
        if any(t in prod for t in targets) and prod not in seen_prods:
            # 상세안내 및 원본 열 28번에서 납입 기간 정보 탐색
            details = str(row.get('상세안내', '')) + " " + str(row.get('원본_열_28', ''))
            
            # 정규표현식으로 납입 기간(10년납, 20년납 등) 추출
            periods = re.findall(r'(\d+)년납|일시납', details)
            
            period_str = ""
            divisor = 1 # 기본값
            
            if "일시납" in details:
                period_str = "일시납 (1회 납부)"
                divisor = 1
            elif periods:
                years = int(periods[0])
                period_str = f"{years}년납"
                divisor = years * 12
            else:
                # 정보가 없을 경우 일반적인 20년납으로 가정 (업계 평균)
                period_str = "정보 없음 (20년납 추정)"
                divisor = 240
                
            print(f"상품명: {prod[:45]}")
            print(f"분석된 납입기간: {period_str}")
            print(f"월납 환산 시 나누어야 할 수: {divisor}")
            print("-" * 50)
            seen_prods.add(prod)

if __name__ == "__main__":
    analyze_periods()
