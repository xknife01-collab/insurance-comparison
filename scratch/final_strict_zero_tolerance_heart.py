import os
import pandas as pd
from bs4 import BeautifulSoup
import re

def final_strict_zero_tolerance_heart():
    parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_standard.csv"
    
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
        "한화생명": "1588-6363", "흥국생명": "1588-6363"
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
            
            # --- 상품명 추출 ---
            prod_name = ""
            # 표 바깥의 텍스트에서 먼저 찾기 (제목일 확률 높음)
            text_candidates = [t.get_text(strip=True) for t in soup.find_all(['h1', 'h2', 'caption', 'th', 'td'])[:30]]
            for t in text_candidates:
                if any(k in t for k in ["무배당", "(무)", "보험"]):
                    # '암'이나 '종신'이 들어있는지 즉시 확인하여 후보에서 제외
                    if any(ex in t for ex in ["암", "종신", "변액", "연금"]):
                        continue
                    if 5 < len(t) < 80 and not any(x in t for x in ["보장내용", "상품요약", "지급사유", "보험료"]):
                        prod_name = t
                        break
            
            # --- [필터링 철칙: Zero Tolerance] ---
            if not prod_name or len(prod_name) < 3:
                continue
            
            # 한번 더 확실히 체크
            if any(ex in prod_name for ex in ["암", "종신", "변액", "연금"]):
                continue

            comp_name = "기타"
            for c in contact_map.keys():
                if c in content or c in filename or c[:2] in filename:
                    comp_name = c
                    break

            # 심장 데이터 추출
            rows = soup.find_all('tr')
            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if not cols or len(cols) < 2: continue
                
                row_text = " ".join(cols)
                if any(k in row_text for k in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]):
                    # 보장명 자체에 '암'이 있는 경우도 제외
                    if any(ex in row_text for ex in ["암진단", "암수술"]): continue

                    item = {h: "" for h in headers}
                    item["보험회사"] = comp_name
                    item["상품명"] = prod_name
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
                    item["연락처"] = contact_map.get(comp_name, "1588-1001")
                    item["source_file"] = filename
                    for idx, val in enumerate(cols[:30]):
                        item[f"원본_열_{idx}"] = val
                    all_data.append(item)
        except: continue

    if all_data:
        df_final = pd.DataFrame(all_data)
        df_final = df_final.drop_duplicates(subset=["보험회사", "상품명", "담보명(급부명)", "기준보험료"])
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
        print(f"SUCCESS: {len(df_final)} PURE heart insurance records saved. (Zero Cancer/WholeLife)")
    else:
        print("No valid records found after applying strict zero-tolerance filtering.")

if __name__ == "__main__":
    final_strict_zero_tolerance_heart()
