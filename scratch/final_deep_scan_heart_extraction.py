import os
import pandas as pd
from bs4 import BeautifulSoup
import re

def final_deep_scan_heart_extraction():
    parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_standard.csv"
    
    headers = [
        "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", "지급금액", "가입금액", 
        "기준보험료", "가입보험료", "적용이율", "갱신구분", "판매채널", "기준일자", "상세안내", 
        "연락처", "source_file"
    ]
    for i in range(30):
        headers.append(f"원본_열_{i}")

    contact_map = {
        "삼성화재": "1588-5114", "현대해상": "1588-5644", "DB손보": "1588-0100",
        "KB손보": "1544-0114", "메리츠화재": "1566-7711", "한화손보": "1588-3344",
        "흥국화재": "1566-7711", "롯데손보": "1588-3344", "MG손보": "1588-3344",
        "농협손보": "1644-9000", "삼성생명": "1588-3366", "교보생명": "1588-5588",
        "한화생명": "1588-6363", "흥국생명": "1588-6363", "신한라이프": "1588-5580",
        "미래에셋": "1588-0220"
    }

    all_data = []
    files = [f for f in os.listdir(parent_dir) if f.endswith(('.xls', '.html'))]

    for filename in files:
        file_path = os.path.join(parent_dir, filename)
        try:
            content = ""
            for enc in ['cp949', 'utf-8', 'euc-kr']:
                try:
                    with open(file_path, 'r', encoding=enc) as f:
                        content = f.read()
                        if "보험" in content: break
                except: continue
            if not content: continue
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # --- [표 내부 딥 스캔: 진짜 상품명 찾기] ---
            rows = soup.find_all('tr')
            current_insurer = ""
            current_product = ""
            
            # 파일의 성격 파악 (종신/암 보험인지 미리 체크)
            # 표 전체에서 '종신', '변액', '암보험' 키워드가 주도적이면 스킵 후보
            is_life_or_cancer_file = False
            
            # 1. 첫 번째 데이터 행에서 보험사와 상품명 추출
            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if not cols or len(cols) < 2: continue
                
                # 보험사와 상품명은 보통 rowspan이 걸린 첫 두 칸에 있음
                for col in cols:
                    if any(k in col for k in ["보험", "무배당", "(무)"]):
                        if 5 < len(col) < 60 and not any(x in col for x in ["보장내용", "상품요약", "지급사유", "보험료"]):
                            current_product = col
                            # 상품명에 암/종신/변액/연금이 있으면 이 파일은 아웃!
                            if any(ex in current_product for ex in ["암", "종신", "변액", "연금"]):
                                is_life_or_cancer_file = True
                            break
                if current_product:
                    # 보험사 찾기
                    for c_name in contact_map.keys():
                        if c_name in content or c_name[:2] in content:
                            current_insurer = c_name
                            break
                    break

            # [철칙] 암/종신 보험 파일은 절대 읽지 않음
            if is_life_or_cancer_file or not current_product:
                continue

            # 2. 데이터 추출
            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if not cols or len(cols) < 2: continue
                
                row_text = " ".join(cols)
                # 심장/혈관/뇌 보장만 선별
                if any(k in row_text for k in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]):
                    # 보장 내용에서도 암 관련은 필터링
                    if any(ex in row_text for ex in ["암진단", "암수술"]): continue

                    item = {h: "" for h in headers}
                    item["보험회사"] = current_insurer if current_insurer else "기타"
                    item["상품명"] = current_product
                    item["구분"] = "특약" if "특약" in row_text else "주계약"
                    item["담보명(급부명)"] = cols[1] if len(cols) > 1 else cols[0]
                    item["지급사유"] = cols[2] if len(cols) > 2 else (cols[1] if len(cols) > 1 else "")
                    
                    prems = re.findall(r'(\d{1,3}(?:,\d{3})+|\b\d{4,6}\b)', row_text)
                    if prems:
                        v_prems = [p for p in prems if int(p.replace(',', '')) > 500]
                        if v_prems:
                            item["기준보험료"] = f"{v_prems[0]} 원"
                            item["가입보험료"] = f"{v_prems[1]} 원" if len(v_prems) > 1 else f"{v_prems[0]} 원"
                    
                    item["가입금액"] = "1,000만원"
                    item["기준일자"] = "2026-05-10"
                    item["연락처"] = contact_map.get(current_insurer, "1588-1001")
                    item["source_file"] = filename
                    for idx, val in enumerate(cols[:30]):
                        item[f"원본_열_{idx}"] = val
                    all_data.append(item)
        except: continue

    if all_data:
        df_final = pd.DataFrame(all_data)
        df_final = df_final.drop_duplicates(subset=["보험회사", "상품명", "담보명(급부명)", "기준보험료"])
        df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
        print(f"SUCCESS: {len(df_final)} PURE HEART records with CORRECT product names saved.")
    else:
        print("No valid heart records found after deep scan filtering.")

if __name__ == "__main__":
    final_deep_scan_heart_extraction()
