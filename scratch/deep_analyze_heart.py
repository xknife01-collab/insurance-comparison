import pandas as pd
import os

def analyze_keywords():
    file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_final_consolidated.xlsx'
    if not os.path.exists(file_path):
        print("File not found.")
        return

    df = pd.read_excel(file_path)
    keywords = ['진단비', '수술비', '부정맥', '심부전', '허혈성', '급성']
    
    print("="*50)
    print("심장보험 담보 키워드 전수 조사 결과")
    print("="*50)

    for kw in keywords:
        matches = df[df['주요담보리스트'].str.contains(kw, na=False) | df['상품명'].str.contains(kw, na=False)]
        print(f"\n▶ [{kw}] 관련 상품: {len(matches)}건 발견")
        if not matches.empty:
            for _, row in matches.head(3).iterrows():
                print(f"  - {row['보험회사']} | {row['상품명']}")
                print(f"    (담보: {str(row['주요담보리스트'])[:60]}...)")
        else:
            print("  - 검색된 상품이 없습니다.")

if __name__ == "__main__":
    analyze_keywords()
