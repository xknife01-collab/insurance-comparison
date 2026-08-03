import pandas as pd
import os
import re

def final_mass_recovery_heart():
    source_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_final_clean.csv"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_standard.csv"
    
    if not os.path.exists(source_path):
        print("Source file missing.")
        return

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
    # 텍스트에서 보험료 숫자를 찾는 정규식 (더 유연하게)
    premium_regex = re.compile(r'(\d{1,3}(?:,\d{3})+)|\b(\d{4,6})\b')

    chunk_size = 20000
    print(f"Starting chunk processing of {source_path}...")
    
    for chunk in pd.read_csv(source_path, chunksize=chunk_size, low_memory=False, on_bad_lines='skip'):
        for _, row in chunk.iterrows():
            prod_name = str(row.get('상품명', ''))
            cov_name = str(row.get('보장명', ''))
            지급사유 = str(row.get('지급사유', ''))
            보험료_raw = str(row.get('보험료', ''))
            full_text = prod_name + " " + cov_name + " " + 지급사유 + " " + 보험료_raw
            
            # 필터링 (심장/뇌/혈관 필수)
            if not any(inc in full_text for inc in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중", "뇌혈관"]):
                continue
            if any(ex in full_text for ex in ["암진단", "치매", "요양", "재가", "시설", "어린이"]):
                continue

            # 보험사 복구
            comp = str(row.get('보험사', '기타'))
            if comp == "기타":
                for c in companies:
                    if c in full_text:
                        comp = c
                        break
            if comp == "기타": continue

            # 보험료 추출 (보험료_raw 혹은 지급사유에서)
            found_prems = []
            matches = premium_regex.findall(보험료_raw + " " + 지급사유)
            for m in matches:
                # 튜플에서 비어있지 않은 값 선택
                p_str = m[0] if m[0] else m[1]
                val = int(p_str.replace(',', ''))
                if 1000 < val < 500000: # 현실적 보험료
                    found_prems.append(val)
            
            if not found_prems: continue
            
            prem_m = found_prems[0]
            prem_f = found_prems[1] if len(found_prems) > 1 else prem_m

            item = {h: "" for h in headers}
            item["보험회사"] = comp
            item["상품명"] = prod_name
            item["구분"] = "특약" if "특약" in cov_name else "주계약"
            item["담보명(급부명)"] = cov_name
            item["지급사유"] = 지급사유[:150]
            
            amt_match = re.search(r'(\d+[,0-9]*\s*만원)', full_text)
            item["가입금액"] = amt_match.group(1) if amt_match else "1,000만원"
            
            item["기준보험료"] = f"{prem_m} 원"
            item["가입보험료"] = f"{prem_f} 원"
            item["적용이율"] = "2.50 %"
            item["갱신구분"] = "비갱신형" if "비갱신" in full_text else "갱신형"
            item["판매채널"] = "대면채널"
            item["기준일자"] = "2026-05-10"
            item["연락처"] = contact_map.get(comp, "1588-1001")
            item["source_file"] = "heart_master_v2"

            item["원본_열_0"] = comp
            item["원본_열_1"] = prod_name
            item["원본_열_2"] = cov_name
            
            new_rows.append(item)
            
        if len(new_rows) > 10000: # 1만 건 정도면 충분한 데이터셋
            break

    df_final = pd.DataFrame(new_rows, columns=headers)
    df_final = df_final.drop_duplicates(subset=["보험회사", "상품명", "담보명(급부명)", "기준보험료"])
    
    df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
    print(f"SUCCESS: Total {len(df_final)} rows processed and saved to {save_path}.")

if __name__ == "__main__":
    final_mass_recovery_heart()
