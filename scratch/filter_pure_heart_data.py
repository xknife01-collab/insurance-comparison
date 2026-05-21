import pandas as pd
import os

def filter_pure_heart_data():
    input_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_final_clean.csv"
    output_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_pure_heart.csv"
    
    if not os.path.exists(input_path):
        print("Source file not found.")
        return

    # 데이터 로드
    df = pd.read_csv(input_path)
    
    # 1. 제외 키워드 (암, 치매, 간병 관련)
    exclude_keywords = ["암", "치매", "간병", "요양", "재가", "시설", "어린이", "태아"]
    
    # 2. 포함 키워드 (심장, 혈관 관련)
    include_keywords = ["심장", "허혈", "심혈관", "부정맥", "심부전", "심판막", "심근", "뇌혈관", "뇌출혈", "뇌졸중", "관상"]

    # 필터링 로직
    def is_heart_only(row):
        text = str(row['상품명']) + " " + str(row['보장명'])
        # 제외 키워드가 있으면 탈락 (단, '뇌혈관'이나 '허혈성'이 포함된 경우 예외처리 할 수 있으나 여기선 엄격하게 제거)
        if any(ex in text for ex in exclude_keywords):
            # 만약 암보험인데 심장 특약이 있는 경우를 살리고 싶다면 여기서 조정 가능
            # 현재는 '순수 심장보험'을 위해 엄격하게 제거
            return False
        # 포함 키워드가 하나라도 있어야 함
        return any(inc in text for include_keywords in include_keywords if (inc := include_keywords) in text)

    # 필터 적용
    pure_df = df[df.apply(is_heart_only, axis=1)]
    
    # 중복 제거 및 저장
    pure_df = pure_df.drop_duplicates()
    pure_df.to_csv(output_path, index=False, encoding='utf-8-sig')
    
    print(f"Filter Complete: {len(pure_df)} heart-specific records saved.")
    print("\n[Excluded Sample (removed 암/치매)]")
    print(df[~df.index.isin(pure_df.index)][['상품명', '보장명']].head(5))

if __name__ == "__main__":
    filter_pure_heart_data()
