import os
import pandas as pd
from bs4 import BeautifulSoup
import re

def final_decoded_product_names():
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
            # 인코딩 시도 (CP949 -> UTF-8 순서)
            content = ""
            for enc in ['cp949', 'utf-8', 'euc-kr']:
                try:
                    with open(file_path, 'r', encoding=enc) as f:
                        content = f.read()
                        if "보험" in content or "무배당" in content:
                            break
                except:
                    continue
            
            if not content:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # 상품명 추출
            real_prod_name = ""
            # 깨진 글자가 섞여있을 수 있으므로 유연하게 탐색
            all_texts = [t.get_text(strip=True) for t in soup.find_all(['caption', 'th', 'td', 'div', 'p', 'h1'])]
            
            for t in all_texts:
                if any(k in t for k in ["무배당", "(무)", "보험", "종신", "변액", "정기", "유니버설", "간편"]):
                    if len(t) > 5 and "지급사유" not in t and "보험회사명" not in t and "급부" not in t:
                        real_prod_name = t
                        break
            
            # 정제
            if real_prod_name:
                real_prod_name = real_prod_name.split("보장내용")[0].replace("상품명", "").replace(":", "").strip()
            
            if not real_prod_name or real_prod_name.endswith(".xls") or len(real_prod_name) < 3:
                # 파일명 기반 유추 (파일명에 보험사명이 들어간 경우 대응)
                real_prod_name = filename.split(".")[0]
                if "mirae" in filename.lower(): real_prod_name = "미래에셋생명 변액종신보험"
                elif "samsung" in filename.lower(): real_prod_name = "삼성화재 다이렉트 건강보험"
                # 기타 파일명 패턴 대응...

            # 보험사 식별
            comp_name = "기타"
            for c in contact_map.keys():
                if c in content or c in filename or c[:2] in filename: # '삼성'만 있어도 매칭
                    comp_name = c
                    break

            rows = soup.find_all('tr')
            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if not cols or len(cols) < 2: continue
                
                text = " ".join(cols)
                if any(k in text for k in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]):
                    if any(ex in text for ex in ["암진단", "치매", "요양"]): continue

                    item = {h: "" for h in headers}
                    item["보험회사"] = comp_name
                    item["상품명"] = real_prod_name
                    item["구분"] = "특약" if "특약" in text else "주계약"
                    
                    if cols[0] in ["주계약", "특약"]:
                        item["담보명(급부명)"] = cols[1] if len(cols) > 1 else ""
                        item["지급사유"] = cols[2] if len(cols) > 2 else ""
                    else:
                        item["담보명(급부명)"] = cols[0]
                        item["지급사유"] = cols[1] if len(cols) > 1 else ""
                    
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
        print(f"COMPLETE: {len(df_final)} rows recovered with encoding fixes.")

if __name__ == "__main__":
    final_decoded_product_names()
