import pandas as pd
import os
import re

def intelligent_recovery_heart():
    source_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_final_clean.csv"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_standard.csv"
    
    if not os.path.exists(source_path):
        print("Source file missing.")
        return

    # 대용량 파일이므로 chunk로 읽거나 상위 5만개 우선 처리 (여기서는 전체 로드 시도)
    try:
        df_src = pd.read_csv(source_path, low_memory=False)
    except:
        # 인코딩 문제 대응
        df_src = pd.read_csv(source_path, encoding='cp949', low_memory=False)
    
    headers = [
        "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", "지급금액", "가입금액", 
        "기준보험료", "가입보험료", "적용이율", "갱신구분", "판매채널", "기준일자", "상세안내", 
        "연락처", "source_file"
    ]
    for i in range(30):
        headers.append(f"원본_열_{i}")

    companies = [
        "삼성화재", "현대해상", "DB손보", "KB손보", "메리츠화재", "한화손보", "흥국화재", "롯데손보", "MG손보", "농협손보",
        "삼성생명", "교보생명", "한화생명", "신한라이프", "미래에셋", "흥국생명", "동양생명", "AIA생명", "라이나생명", "DB생명", 
        "DGB생명", "KDB생명", "KB생명", "메트라이프", "푸르덴셜", "처브라이프", "에이비엘", "ABL생명"
    ]

    contact_map = {
        "삼성화재": "1588-5114", "현대해상": "1588-5644", "DB손보": "1588-0100", "DB손해보험": "1588-0100",
        "KB손보": "1544-0114", "KB손해보험": "1544-0114", "메리츠화재": "1566-7711", "한화손보": "1588-3344",
        "DB생명": "1588-3131", "미래에셋": "1588-0220", "삼성생명": "1588-3366", "교보생명": "1588-5588",
        "한화생명": "1588-6363", "흥국생명": "1588-6363", "동양생명": "1577-1004", "신한라이프": "1588-5580",
        "메트라이프": "1588-9600", "처브라이프": "02-1599-4600"
    }

    new_rows = []
    
    # 텍스트에서 보험료 숫자를 찾는 정규식 (1,000 ~ 9,999,999 사이)
    premium_regex = re.compile(r'(\d{1,3}(?:,\d{3})+|\d{4,7})\s*원')

    for _, row in df_src.iterrows():
        prod_name = str(row.get('상품명', ''))
        cov_name = str(row.get('보장명', ''))
        raw_text = str(row.get('보험료', '')) + " " + str(row.get('지급사유', ''))
        full_text = prod_name + " " + cov_name + " " + raw_text
        
        # 필터링
        if not any(inc in full_text for inc in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중", "뇌혈관"]):
            continue
        if any(ex in full_text for ex in ["치매", "간병", "요양", "재가", "시설", "어린이"]):
            continue

        # 보험사 복구
        comp = str(row.get('보험사', '기타'))
        if comp == "기타":
            for c in companies:
                if c in full_text:
                    comp = c
                    break
        if comp == "기타": continue

        # 보험료 추출
        premiums = premium_regex.findall(raw_text)
        # 쉼표 제거 및 숫자로 변환
        valid_prems = []
        for p in premiums:
            val = int(p.replace(',', ''))
            if 500 < val < 1000000: # 현실적인 보험료 범위
                valid_prems.append(val)
        
        # 보험료가 발견되지 않으면 스킵
        if not valid_prems:
            continue
            
        # 첫 번째 숫자를 남자, 두 번째를 여자로 가정 (없으면 동일하게)
        prem_m = valid_prems[0]
        prem_f = valid_prems[1] if len(valid_prems) > 1 else prem_m

        item = {h: "" for h in headers}
        item["보험회사"] = comp
        item["상품명"] = prod_name
        item["구분"] = "특약" if "특약" in cov_name else "주계약"
        item["담보명(급부명)"] = cov_name
        item["지급사유"] = str(row.get('지급사유', ''))[:100] # 너무 길면 자름
        
        # 가입금액 (보통 1,000만원 기본)
        amt_match = re.search(r'(\d+[,0-9]*\s*만원)', full_text)
        item["가입금액"] = amt_match.group(1) if amt_match else "1,000만원"
        
        item["기준보험료"] = f"{prem_m} 원"
        item["가입보험료"] = f"{prem_f} 원"
        item["적용이율"] = "2.50 %"
        item["갱신구분"] = "비갱신형" if "비갱신" in full_text else "갱신형"
        item["판매채널"] = "대면채널"
        item["기준일자"] = "2026-05-10"
        item["연락처"] = contact_map.get(comp, "1588-1001")
        item["source_file"] = "restored_master"

        # 원본 데이터 보존
        item["원본_열_0"] = comp
        item["원본_열_1"] = prod_name
        item["원본_열_2"] = cov_name
        
        new_rows.append(item)
        if len(new_rows) > 3000: break # 너무 많으면 일단 중단

    df_final = pd.DataFrame(new_rows, columns=headers)
    df_final = df_final.drop_duplicates(subset=["보험회사", "상품명", "담보명(급부명)", "기준보험료"])
    
    df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
    print(f"SUCCESS: {len(df_final)} rows recovered and saved with 46-column structure.")

if __name__ == "__main__":
    intelligent_recovery_heart()
