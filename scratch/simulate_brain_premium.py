import pandas as pd
import os
import sys

# Reconfigure stdout to utf-8 for Korean
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

EXCEL_FILE = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\뇌보험_담보_통합_최종_성별분리.xlsx'

if os.path.exists(EXCEL_FILE):
    df = pd.read_excel(EXCEL_FILE)
    df = df[~df['상품명'].str.contains('소방관', na=False)]
    df = df[~df['상품명'].str.contains('종합', na=False)]
    
    print("--- 60대(연령비율 적용) 및 보장 조건에 따른 뇌혈관 시뮬레이션 요율 ---")
    
    # 뇌 Loader의 연령 비율 재현
    def get_age_ratio(age):
        def get_age_index(a):
            if a <= 20: return 0.38
            if a <= 30: return 0.58
            if a <= 40: return 1.00
            if a <= 50: return 1.75
            if a <= 60: return 3.20
            if a <= 70: return 5.50
            return 7.00
        return get_age_index(age) / get_age_index(40)

    # 40세, 50세, 60세 기준 최고 보험료 시뮬레이션
    highest_row = df.sort_values(by='남성보험료', ascending=False).iloc[0]
    
    base_diag = highest_row['남성보험료']
    base_surg = int(base_diag * 0.25) # 수술비 25% 가산
    
    print(f"Product: {highest_row['상품명']}")
    print(f"Base Diag Premium (from Excel): {base_diag:,} KRW")
    print(f"Base Surg Premium (simulated 25%): {base_surg:,} KRW")
    
    for age in [40, 50, 60]:
        ratio = get_age_ratio(age)
        final_diag_80 = int(base_diag * ratio * 1.0 * 1.0) # 80세만기, 1천만가입
        final_diag_100 = int(base_diag * ratio * 1.0 * 1.55) # 100세만기, 1천만가입
        final_diag_100_surg = final_diag_100 + int(base_surg * ratio * 1.55) # 수술비 포함
        
        print(f"\n[Age {age} (Ratio: {ratio:.2f}x)]")
        print(f"  - 80세만기 (진단비만): {final_diag_80:,} KRW")
        print(f"  - 100세만기 (진단비만): {final_diag_100:,} KRW")
        print(f"  - 100세만기 + 수술비포함: {final_diag_100_surg:,} KRW")

else:
    print("Excel file not found")
