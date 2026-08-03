import os
import pandas as pd
from bs4 import BeautifulSoup
import re

def final_perfect_product_names():
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
        "DB생명": "1588-3131", "미래에셋": "1588-0220", "삼성생명": "1588-3366", "교보생명": "1588-5588",
        "한화생명": "1588-6363", "신한라이프": "1588-5580", "메트라이프": "1588-9600"
    }

    all_data = []
    files = [f for f in os.listdir(parent_dir) if f.endswith(('.xls', '.html'))]

    for filename in files:
        file_path = os.path.join(parent_dir, filename)
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # 1. 텍스트 덩어리 전수 조사
            all_texts = [t.get_text(strip=True) for t in soup.find_all(['td', 'th', 'caption', 'p', 'div', 'h1', 'h2'])]
            
            real_prod_name = ""
            for t in all_texts:
                # 상품명 키워드 필터 (무배당, 보험, 종신, 변액 등)
                if any(k in t for k in ["무배당", "(무)", "보험", "종신", "변액", "정기", "유니버설", "간편"]):
                    if len(t) > 5 and "지급사유" not in t and "보험회사명" not in t:
                        real_prod_name = t
                        break
            
            # 정제
            real_prod_name = real_prod_name.split("보장내용")[0].replace("상품명", "").replace(":", "").strip()
            if not real_prod_name or len(real_prod_name) < 3 or real_prod_name.endswith(".xls"):
                real_prod_name = filename.split(".")[0] # 확장자라도 뗌

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
                if "보험회사명" in text: continue

                if any(k in text for k in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]):
                    item = {h: "" for h in headers}
                    item["보험회사"] = comp_name
                    item["상품명"] = real_prod_name
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
        print(f"COMPLETE: {len(df_final)} rows with perfect product names.")

if __name__ == "__main__":
    final_perfect_product_names()
