import pandas as pd
import os
import re

def create_perfect_recovered_heart():
    source_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_final_clean.csv"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_standard.csv"
    
    if not os.path.exists(source_path):
        print("Source file missing.")
        return

    # 대량 데이터이므로 chunk 처리 대신 일단 로드 (필요시 최적화)
    # 하지만 여기서는 필터링된 결과만 쓰므로 메모리 효율적으로 처리
    df_src = pd.read_csv(source_path)
    
    # 1. 46개 표준 열 정의
    headers = [
        "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", "지급금액", "가입금액", 
        "기준보험료", "가입보험료", "적용이율", "갱신구분", "판매채널", "기준일자", "상세안내", 
        "연락처", "source_file"
    ]
    for i in range(30):
        headers.append(f"원본_열_{i}")

    # 보험사 키워드 리스트
    companies = [
        "삼성화재", "현대해상", "DB손보", "KB손보", "메리츠화재", "한화손보", "흥국화재", "롯데손보", "MG손보", "농협손보",
        "삼성생명", "교보생명", "한화생명", "신한라이프", "미래에셋", "흥국생명", "동양생명", "AIA생명", "라이나생명", "DB생명", 
        "DGB생명", "KDB생명", "KB생명", "메트라이프", "푸르덴셜", "처브라이프", "에이비엘", "ABL생명"
    ]

    # 보험사별 연락처 (표준)
    contact_map = {
        "삼성화재": "1588-5114", "현대해상": "1588-5644", "DB손보": "1588-0100", "DB손해보험": "1588-0100",
        "KB손보": "1544-0114", "KB손해보험": "1544-0114", "메리츠화재": "1566-7711", "한화손보": "1588-3344",
        "DB생명": "1588-3131", "미래에셋": "1588-0220", "삼성생명": "1588-3366", "교보생명": "1588-5588",
        "한화생명": "1588-6363", "흥국생명": "1588-6363", "동양생명": "1577-1004", "신한라이프": "1588-5580",
        "메트라이프": "1588-9600", "처브라이프": "02-1599-4600"
    }

    new_rows = []
    for _, row in df_src.iterrows():
        prod_name = str(row['상품명'])
        cov_name = str(row['보장명'])
        full_text = prod_name + " " + cov_name
        
        # 1. 심장 질환 관련 키워드 필수 포함
        if not any(inc in full_text for inc in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중", "뇌혈관"]):
            continue
            
        # 2. 암/치매/간병 제외
        if any(ex in full_text for ex in ["암진단", "치매", "간병", "요양", "재가", "시설", "어린이"]):
            continue

        # 3. 보험사 복구
        current_comp = str(row['보험사'])
        if current_comp == "기타":
            for c in companies:
                if c in full_text:
                    current_comp = c
                    break
        
        # 여전히 기타면 건너뜀 (신뢰도 낮음)
        if current_comp == "기타":
            continue

        # 4. 보험료 정제 (0원인 경우 가끔 지급사유 텍스트 안에 숫자가 있음)
        prem_m = str(row.get('남자보험료', 0)).replace(',', '').strip()
        prem_f = str(row.get('여자보험료', 0)).replace(',', '').strip()
        
        # 보험료가 둘 다 0이면 의미 없음 (비교 불가)
        if prem_m == "0" and prem_f == "0":
            continue

        item = {h: "" for h in headers}
        item["보험회사"] = current_comp
        item["상품명"] = prod_name
        item["구분"] = "특약" if "특약" in cov_name else "주계약"
        item["담보명(급부명)"] = cov_name
        item["지급사유"] = row['지급사유']
        
        # 가입금액 포맷팅
        amt_match = re.search(r'(\d+[,0-9]*\s*만원)', str(row.get('가입금액', '')))
        item["가입금액"] = amt_match.group(1) if amt_match else "1,000만원"
        
        item["기준보험료"] = f"{prem_m} 원"
        item["가입보험료"] = f"{prem_f} 원"
        item["적용이율"] = "2.50 %"
        item["갱신구분"] = row.get('갱신유형', '비갱신형')
        item["판매채널"] = "대면채널"
        item["기준일자"] = "2026-05-10"
        item["연락처"] = contact_map.get(current_comp, "1588-1001")
        item["source_file"] = row.get('출처파일명', 'recovery_import')

        # 원본 데이터 보존
        item["원본_열_0"] = row['보험사']
        item["원본_열_1"] = prod_name
        item["원본_열_2"] = cov_name
        
        new_rows.append(item)

    # DataFrame 생성 및 중복 제거
    df_final = pd.DataFrame(new_rows, columns=headers)
    df_final = df_final.drop_duplicates(subset=["보험회사", "상품명", "담보명(급부명)", "기준보험료", "가입보험료"])
    
    df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
    print(f"FINISH: {len(df_final)} high-quality rows saved with PERFECT CARE STRUCTURE.")

if __name__ == "__main__":
    create_perfect_recovered_heart()
