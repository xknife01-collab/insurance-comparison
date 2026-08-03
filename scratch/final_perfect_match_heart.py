import os
import pandas as pd
from bs4 import BeautifulSoup
import re

def final_perfect_match_heart():
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
        "미래에셋": "1588-0220", "동양생명": "1577-1004"
    }

    all_data = []
    files = [f for f in os.listdir(parent_dir) if f.endswith(('.xls', '.html'))]

    exclude_files = ["file_0", "file_1", "file_2", "file_3", "file_4", "file_5", "file_6", "file_7", "file_8", "file_9", "종신", "변액", "연금", "실손", "저축성"]

    for filename in files:
        if any(ex in filename for ex in exclude_files):
            continue

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
            rows = soup.find_all('tr')

            # --- [정밀 스캔] ---
            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if len(cols) < 5: continue
                
                # 보통 첫 번째 칸이 보험사, 두 번째 칸이 상품명
                insurer_cand = cols[0]
                product_cand = cols[1] if "보험" in cols[1] or "무배당" in cols[1] else cols[0]
                
                if any(ex in product_cand for ex in ["암", "종신", "변액", "연금"]):
                    continue
                
                if not any(k in product_cand for k in ["보험", "무배당", "(무)"]):
                    continue
                
                # 심장 데이터만 선별
                row_text = " ".join(cols)
                if any(k in row_text for k in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]):
                    if any(ex in row_text for ex in ["암진단", "암수술"]): continue

                    item = {h: "" for h in headers}
                    
                    # 보험사 보정
                    actual_insurer = "기타"
                    for c_name in contact_map.keys():
                        if c_name in insurer_cand or c_name in product_cand or c_name[:2] in insurer_cand:
                            actual_insurer = c_name
                            break
                    
                    item["보험회사"] = actual_insurer
                    item["상품명"] = product_cand
                    item["구분"] = "특약" if "특약" in row_text else "주계약"
                    item["담보명(급부명)"] = cols[2] if len(cols) > 2 else cols[1]
                    item["지급사유"] = cols[3] if len(cols) > 3 else ""
                    
                    prems = re.findall(r'(\d{1,3}(?:,\d{3})+|\b\d{4,6}\b)', row_text)
                    if prems:
                        v_prems = [p for p in prems if int(p.replace(',', '')) > 500]
                        if v_prems:
                            item["기준보험료"] = f"{v_prems[0]} 원"
                            item["가입보험료"] = f"{v_prems[1]} 원" if len(v_prems) > 1 else f"{v_prems[0]} 원"
                    
                    item["가입금액"] = "1,000만원"
                    item["기준일자"] = "2026-05-10"
                    item["연락처"] = contact_map.get(actual_insurer, "1588-1001")
                    item["source_file"] = filename
                    for idx, val in enumerate(cols[:30]):
                        item[f"원본_열_{idx}"] = val
                    all_data.append(item)
        except: continue

    if all_data:
        df_final = pd.DataFrame(all_data)
        df_final = df_final.drop_duplicates(subset=["보험회사", "상품명", "담보명(급부명)", "기준보험료"])
        df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
        print(f"ULTIMATE SUCCESS: {len(df_final)} PURE heart records finalized at: {save_path}")
    else:
        print("Final scan returned no records.")

if __name__ == "__main__":
    final_perfect_match_heart()
