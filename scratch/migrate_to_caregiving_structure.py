import pandas as pd
import os

def migrate_to_caregiving_structure():
    # 1. 소스 데이터 로드 (심장 정제 데이터)
    source_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_final_clean.csv"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_standard.csv"
    
    if not os.path.exists(source_path):
        print("Source data not found. Please run the extraction first.")
        return

    df_src = pd.read_csv(source_path)
    
    # 2. 타겟 구조 정의 (간병보험 엑셀 열 46개)
    target_columns = [
        "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", "지급금액", "가입금액", 
        "기준보험료", "가입보험료", "적용이율", "갱신구분", "판매채널", "기준일자", "상세안내", 
        "연락처", "source_file"
    ]
    # 원본 열 0~29 추가
    for i in range(30):
        target_columns.append(f"원본_열_{i}")

    # 3. 데이터 매핑 및 변환
    new_rows = []
    
    # 보험사별 연락처 매핑 (간병보험 엑셀 기준)
    contact_map = {
        "삼성화재": "1588-5114", "현대해상": "1588-5644", "DB손보": "1588-0100",
        "KB손보": "1544-0114", "메리츠화재": "1566-7711", "한화손보": "1588-3344",
        "DB생명": "1588-3131", "미래에셋": "1588-0220", "삼성생명": "1588-3366", "교보생명": "1588-5588"
    }

    for _, row in df_src.iterrows():
        # 심장보험 데이터 필터링 (암/치매 제외)
        text = str(row['상품명']) + " " + str(row['보장명'])
        if any(ex in text for ex in ["암", "치매", "간병", "요양", "재가", "시설"]):
            continue
        if not any(inc in text for inc in ["심장", "허혈", "혈관", "부정맥", "심근"]):
            continue

        # 46개 열 생성
        new_data = {col: "" for col in target_columns}
        
        # 핵심 매핑
        new_data["보험회사"] = row['보험사']
        new_data["상품명"] = row['상품명']
        new_data["구분"] = "특약" if "특약" in str(row['보장명']) else "주계약"
        new_data["담보명(급부명)"] = row['보장명']
        new_data["지급사유"] = row['지급사유']
        new_data["가입금액"] = row['보험료'] # 원본 텍스트에 포함된 경우
        new_data["기준보험료"] = f"{row.get('남자보험료', 0)} 원"
        new_data["가입보험료"] = f"{row.get('여자보험료', 0)} 원"
        new_data["갱신구분"] = row.get('갱신유형', '갱신형')
        new_data["기준일자"] = "2026-05-10"
        new_data["연락처"] = contact_map.get(row['보험사'], "1588-1001")
        new_data["source_file"] = row.get('출처파일명', '')
        
        # 원본 열에 데이터 백업 (나중에 필요할 수 있음)
        new_data["원본_열_0"] = row['보험사']
        new_data["원본_열_1"] = row['상품명']
        new_data["원본_열_2"] = row['보장명']
        
        new_rows.append(new_data)

    # 4. 저장
    df_final = pd.DataFrame(new_rows, columns=target_columns)
    df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
    
    print(f"SUCCESS: Created standardized CSV with {len(df_final)} rows and {len(target_columns)} columns.")
    print(f"Location: {save_path}")

if __name__ == "__main__":
    migrate_to_caregiving_structure()
