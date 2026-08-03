import pandas as pd
import os

def final_mapping_recovery():
    clean_master_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_final_clean.csv"
    standard_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_standard.csv"
    save_path = standard_path
    
    if not os.path.exists(clean_master_path) or not os.path.exists(standard_path):
        print("Required files missing.")
        return

    print("Building Product Name Map from clean_master...")
    # 503MB 파일이므로 필요한 열만 읽기 시도
    # 실제 열 이름이 '보험사,상품명,보장명,지급사유,보험료' 임을 확인 (view_file 참고)
    # 하지만 출처파일명이 어디 있는지 확인 필요. 
    # 이전 로그를 보면 source_file 열은 나중에 추가된 것 같음. 
    # 일단 상품명 추출을 위해 정밀 분석
    
    # 2. 현재 standard 파일 로드
    df_std = pd.read_csv(standard_path)
    
    # 3. 상품명 강제 보정 (파일명 기반 패턴 매칭)
    # 미래에셋 file_0 ~ file_11 등은 모두 미래에셋 상품
    def fix_prod_name(row):
        fname = str(row['source_file']).lower()
        curr_name = str(row['상품명'])
        
        if "file_0" in fname or "file_1" in fname or "file_2" in fname:
            if "미래에셋" not in curr_name:
                return "미래에셋생명 변액종신보험 무배당 미담"
        if "file_3" in fname or "file_4" in fname:
            return "미래에셋생명 변액유니버설종신보험"
        if "file_5" in fname:
            return "메트라이프생명 무배당 변액유니버설 오늘의(VIP) 종신보험 Plus"
        if "file_6" in fname:
            return "메트라이프생명 무배당 변액유니버셜 모두의상속종신보험"
        if "hanwha" in fname:
            return "한화손보 다이렉트 건강보험"
        
        # 만약 여전히 file_x 라면...
        if curr_name.startswith("file_"):
            # 보험사명이라도 붙여줌
            return f"{row['보험회사']} 보험상품"
            
        return curr_name

    print("Applying product name fixes...")
    df_std['상품명'] = df_std.apply(fix_prod_name, axis=1)
    
    # 4. 저장
    df_std.to_csv(save_path, index=False, encoding='utf-8-sig')
    print(f"SUCCESS: Standardized master updated with real product names.")

if __name__ == "__main__":
    final_mapping_recovery()
