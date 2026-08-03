import os
import pandas as pd
from bs4 import BeautifulSoup
import re

def extract_correct_product_names():
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
        "삼성화재": "1588-5114", "현대해상": "1588-5644", "DB손보": "1588-0100", "DB손해보험": "1588-0100",
        "KB손보": "1544-0114", "KB손해보험": "1544-0114", "메리츠화재": "1566-7711", "한화손보": "1588-3344",
        "DB생명": "1588-3131", "미래에셋": "1588-0220", "삼성생명": "1588-3366", "교보생명": "1588-5588",
        "한화생명": "1588-6363", "흥국생명": "1588-6363", "동양생명": "1577-1004", "신한라이프": "1588-5580",
        "메트라이프": "1588-9600", "처브라이프": "02-1599-4600"
    }

    all_data = []
    files = [f for f in os.listdir(parent_dir) if f.endswith(('.xls', '.html'))]

    for filename in files:
        file_path = os.path.join(parent_dir, filename)
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # 진짜 상품명 찾기
            real_prod_name = ""
            
            # 모든 텍스트 중 '보험'이 들어간 가장 긴 문장 찾기 (보통 제목임)
            # 혹은 <caption> 태그 우선
            caption = soup.find('caption')
            if caption:
                raw_cap = caption.get_text(strip=True)
                if "상품명" in raw_cap:
                    # '상품명 : 미래에셋...' 형태 대응
                    real_prod_name = raw_cap.split("상품명")[-1].replace(":", "").strip()
            
            if not real_prod_name:
                # td나 th 중 '무배당' 또는 '보험'이 들어간 첫 번째 긴 텍스트
                candidates = soup.find_all(['td', 'th', 'div', 'p'])
                for cand in candidates:
                    txt = cand.get_text(strip=True)
                    if ("무배당" in txt or "보험" in txt) and len(txt) > 5 and "지급사유" not in txt:
                        real_prod_name = txt
                        break
            
            # 정제
            if real_prod_name:
                real_prod_name = real_prod_name.split("보장내용")[0].replace("보험회사명", "").replace("상품명", "").strip()
                real_prod_name = re.sub(r'^[ :]+', '', real_prod_name)

            comp_name = "기타"
            for c in contact_map.keys():
                if c in content or c in filename:
                    comp_name = c
                    break

            rows = soup.find_all('tr')
            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if not cols or len(cols) < 2: continue
                
                text = " ".join(cols)
                if "보험회사명" in text or "상품명" in text: continue # 헤더 행 건너뜀

                if any(k in text for k in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]):
                    if any(ex in text for ex in ["암진단", "치매", "요양"]): continue
                    
                    item = {h: "" for h in headers}
                    item["보험회사"] = comp_name
                    item["상품명"] = real_prod_name if real_prod_name else filename
                    item["구분"] = "특약" if "특약" in text else "주계약"
                    item["담보명(급부명)"] = cols[1] if len(cols) > 1 else ""
                    item["지급사유"] = cols[2] if len(cols) > 2 else ""
                    
                    prems = re.findall(r'(\d{1,3}(?:,\d{3})+|\b\d{4,6}\b)', text)
                    if prems:
                        item["기준보험료"] = f"{prems[0]} 원"
                        item["가입보험료"] = f"{prems[1]} 원" if len(prems) > 1 else f"{prems[0]} 원"
                    
                    item["가입금액"] = "1,000만원"
                    item["기준일자"] = "2026-05-10"
                    item["연락처"] = contact_map.get(comp_name, "1588-1001")
                    item["source_file"] = filename
                    
                    for idx, val in enumerate(cols[:30]):
                        item[f"원본_열_{idx}"] = val
                        
                    all_data.append(item)
        except:
            continue

    if all_data:
        df_final = pd.DataFrame(all_data)
        df_final = df_final.drop_duplicates(subset=["보험회사", "상품명", "담보명(급부명)", "기준보험료"])
        df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
        print(f"SUCCESS: {len(df_final)} rows saved with CORRECTED PRODUCT NAMES.")
    else:
        print("No data found.")

if __name__ == "__main__":
    extract_correct_product_names()
