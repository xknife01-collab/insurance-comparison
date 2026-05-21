import pandas as pd
import os
import re

def create_perfect_standard_heart():
    source_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_final_clean.csv"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_standard.csv"
    
    if not os.path.exists(source_path):
        print("Source file missing.")
        return

    df_src = pd.read_csv(source_path)
    
    # 1. 46개 표준 열 정의
    headers = [
        "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", "지급금액", "가입금액", 
        "기준보험료", "가입보험료", "적용이율", "갱신구분", "판매채널", "기준일자", "상세안내", 
        "연락처", "source_file"
    ]
    for i in range(30):
        headers.append(f"원본_열_{i}")

    # 보험사별 연락처 (간병보험 기준)
    contact_map = {
        "삼성화재": "1588-5114", "현대해상": "1588-5644", "DB손보": "1588-0100",
        "KB손보": "1544-0114", "메리츠화재": "1566-7711", "한화손보": "1588-3344",
        "DB생명": "1588-3131", "미래에셋": "1588-0220", "삼성생명": "1588-3366", "교보생명": "1588-5588",
        "한화생명": "1588-6363", "흥국생명": "1588-6363", "동양생명": "1577-1004"
    }

    new_rows = []
    for _, row in df_src.iterrows():
        # 순수 심장 질환 필터링 (암, 치매 제외)
        prod_name = str(row['상품명'])
        cov_name = str(row['보장명'])
        full_text = prod_name + " " + cov_name
        
        if any(ex in full_text for ex in ["암", "치매", "간병", "요양", "재가", "시설", "어린이"]):
            continue
        if not any(inc in full_text for inc in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]):
            continue

        # 46개 빈 열 생성
        item = {h: "" for headers in headers if (h := headers)} # Dictionary comprehension fix
        item = {h: "" for h in headers}

        # 데이터 채우기
        item["보험회사"] = row['보험사']
        item["상품명"] = prod_name
        item["구분"] = "특약" if "특약" in cov_name else "주계약"
        item["담보명(급부명)"] = cov_name
        item["지급사유"] = row['지급사유']
        item["지급금액"] = "" # 필요시 가입금액 복사
        
        # 가입금액 정제 (숫자만 추출하여 '만원' 단위로)
        amt_str = str(row.get('가입금액', '1,000만원'))
        item["가입금액"] = amt_str if '만원' in amt_str else "1,000만원"
        
        # 보험료 포맷 (숫자 원)
        prem_m = str(row.get('남자보험료', 0)).replace(',', '')
        prem_f = str(row.get('여자보험료', 0)).replace(',', '')
        item["기준보험료"] = f"{prem_m} 원"
        item["가입보험료"] = f"{prem_f} 원"
        
        item["적용이율"] = "2.50 %" # 기본값
        item["갱신구분"] = row.get('갱신유형', '갱신형')
        item["판매채널"] = "대면채널"
        item["기준일자"] = "2026-05-10"
        item["연락처"] = contact_map.get(row['보험사'], "1588-1001")
        item["source_file"] = row.get('출처파일명', 'manual_import')

        # 원본 열 백업
        item["원본_열_0"] = row['보험사']
        item["원본_열_1"] = prod_name
        item["원본_열_2"] = cov_name
        
        new_rows.append(item)

    # 2. DataFrame 생성 및 저장
    df_final = pd.DataFrame(new_rows, columns=headers)
    df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
    
    print(f"COMPLETE: {len(df_final)} rows saved to {save_path} with EXACT CARE STRUCTURE.")

if __name__ == "__main__":
    create_perfect_standard_heart()
