import os
import pandas as pd
from bs4 import BeautifulSoup
import re

def final_perfect_heart_standardization():
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

    # 제외 파일 패턴
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
            
            # --- [데이터 영역에서 진짜 상품명 추출] ---
            tbody = soup.find('tbody')
            if not tbody:
                # tbody가 없으면 tr 전체에서 첫 번째 데이터 행 찾기
                rows = soup.find_all('tr')
            else:
                rows = tbody.find_all('tr')

            real_prod_name = ""
            is_invalid_product = False
            
            # 1단계: 첫 번째 행에서 상품명 확정
            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if len(cols) > 2:
                    # 두 번째 또는 세 번째 칸이 보통 상품명
                    for col in cols[:4]:
                        if any(k in col for k in ["무배당", "(무)", "보험"]):
                            if 5 < len(col) < 80 and not any(x in col for x in ["보장내용", "보험가격지수", "최저해약"]):
                                real_prod_name = col
                                # [핵심] 암/종신 체크
                                if any(ex in real_prod_name for ex in ["암", "종신", "변액", "연금"]):
                                    is_invalid_product = True
                                break
                if real_prod_name or is_invalid_product:
                    break

            # 무효한 상품(암/종신)이거나 상품명을 못 찾으면 패스
            if is_invalid_product or not real_prod_name:
                continue

            # 보험사 식별
            comp_name = "기타"
            for c in contact_map.keys():
                if c in content or c in real_prod_name:
                    comp_name = c
                    break

            # 2단계: 심장 데이터 추출
            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if not cols or len(cols) < 2: continue
                
                row_text = " ".join(cols)
                if any(k in row_text for k in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]):
                    if any(ex in row_text for ex in ["암진단", "암수술"]): continue

                    item = {h: "" for h in headers}
                    item["보험회사"] = comp_name
                    item["상품명"] = real_prod_name
                    item["구분"] = "특약" if "특약" in row_text else "주계약"
                    
                    # 담보명 위치 조정 (보통 2번째 또는 3번째 칸)
                    if len(cols) > 3:
                        item["담보명(급부명)"] = cols[1] if "보험" not in cols[1] else cols[2]
                        item["지급사유"] = cols[3] if len(cols) > 3 else ""
                    else:
                        item["담보명(급부명)"] = cols[0]
                        item["지급사유"] = cols[1] if len(cols) > 1 else ""

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
        print(f"FINALLY: {len(df_final)} PURE heart records with REAL NAMES saved to: {save_path}")
    else:
        print("No valid heart records found after the most strict scan.")

if __name__ == "__main__":
    final_perfect_heart_standardization()
