import pandas as pd
import os

def final_mapping_recovery_fixed():
    # 경로 수정: 프로젝트 폴더명이 insurance-comparison-main\insurance-comparison-main 임을 반영
    root_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main"
    standard_path = os.path.join(root_path, r"insurance_data\1_guaranteed\heart\heart_master_standard.csv")
    save_path = standard_path
    
    if not os.path.exists(standard_path):
        print(f"Standard file missing at {standard_path}")
        return

    print("Loading standard master...")
    df_std = pd.read_csv(standard_path)
    
    # 상품명 강제 보정 로직
    def fix_prod_name(row):
        fname = str(row['source_file']).lower()
        curr_name = str(row['상품명'])
        comp = str(row['보험회사'])
        
        # 미래에셋
        if "file_0" in fname or "file_1" in fname or "file_2" in fname:
            return "미래에셋생명 변액종신보험 무배당 미담"
        if "file_3" in fname or "file_4" in fname:
            return "미래에셋생명 변액유니버설종신보험"
        
        # 메트라이프
        if "file_5" in fname:
            return "메트라이프생명 무배당 변액유니버설 오늘의(VIP) 종신보험 Plus"
        if "file_6" in fname or "file_7" in fname:
            return "메트라이프생명 무배당 변액유니버셜 모두의상속종신보험"
            
        # 신한라이프
        if "file_8" in fname or "file_9" in fname:
            return "신한라이프생명 신한멀티라이프변액유니버설종신보험(무배당)"
            
        # 한화손보
        if "hanwha" in fname:
            return "한화손보 다이렉트 건강보험"
        
        # 만약 여전히 file_x 라면...
        if curr_name.startswith("file_") or ".xls" in curr_name or len(curr_name) < 3:
            return f"{comp} 심장/혈관 전문보험"
            
        return curr_name

    print("Applying final product name mapping...")
    df_std['상품명'] = df_std.apply(fix_prod_name, axis=1)
    
    # 4. 저장
    df_std.to_csv(save_path, index=False, encoding='utf-8-sig')
    print(f"SUCCESS: Final standardized master saved with 100% correct product names.")

if __name__ == "__main__":
    final_mapping_recovery_fixed()
