import os
import pandas as pd
from bs4 import BeautifulSoup
import re
import xlrd

def final_extract_from_parent():
    parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_standard.csv"
    
    headers = [
        "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", "지급금액", "가입금액", 
        "기준보험료", "가입보험료", "적용이율", "갱신구분", "판매채널", "기준일자", "상세안내", 
        "연락처", "source_file"
    ]
    for i in range(30):
        headers.append(f"원본_열_{i}")

    # 보험사별 연락처
    contact_map = {
        "삼성화재": "1588-5114", "현대해상": "1588-5644", "DB손보": "1588-0100", "DB손해보험": "1588-0100",
        "KB손보": "1544-0114", "KB손해보험": "1544-0114", "메리츠화재": "1566-7711", "한화손보": "1588-3344",
        "DB생명": "1588-3131", "미래에셋": "1588-0220", "삼성생명": "1588-3366", "교보생명": "1588-5588",
        "한화생명": "1588-6363", "흥국생명": "1588-6363", "동양생명": "1577-1004", "신한라이프": "1588-5580",
        "메트라이프": "1588-9600", "처브라이프": "02-1599-4600"
    }
    
    companies = list(contact_map.keys())

    all_data = []

    files = [f for f in os.listdir(parent_dir) if f.endswith(('.xls', '.html'))]
    print(f"Found {len(files)} potential files in {parent_dir}")

    for filename in files:
        file_path = os.path.join(parent_dir, filename)
        try:
            # HTML (XLS가 사실 HTML인 경우가 많음)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            rows = soup.find_all('tr')
            
            # 파일에서 보험사명 찾기
            comp_name = "기타"
            for c in companies:
                if c in content or c in filename:
                    comp_name = c
                    break

            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if not cols: continue
                
                text = " ".join(cols)
                # 심장 관련 필터
                if any(k in text for k in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]):
                    # 암/치매 제외
                    if any(ex in text for ex in ["암진단", "치매", "요양", "재가", "시설"]): continue
                    
                    item = {h: "" for h in headers}
                    item["보험회사"] = comp_name
                    item["상품명"] = filename # 일단 파일명으로
                    item["구분"] = "특약" if "특약" in text else "주계약"
                    item["담보명(급부명)"] = cols[1] if len(cols) > 1 else ""
                    item["지급사유"] = cols[2] if len(cols) > 2 else ""
                    
                    # 가입금액 및 보험료 추출
                    prems = re.findall(r'(\d{1,3}(?:,\d{3})+|\b\d{4,6}\b)', text)
                    if prems:
                        item["기준보험료"] = f"{prems[0]} 원"
                        item["가입보험료"] = f"{prems[1]} 원" if len(prems) > 1 else f"{prems[0]} 원"
                    
                    item["가입금액"] = "1,000만원" # 기본값
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
        df_final = df_final.drop_duplicates(subset=["보험회사", "담보명(급부명)", "기준보험료"])
        df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
        print(f"SUCCESS: {len(df_final)} heart insurance records extracted and standardized.")
    else:
        print("No heart insurance data found.")

if __name__ == "__main__":
    final_extract_from_parent()
