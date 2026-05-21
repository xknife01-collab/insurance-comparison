import os
import pandas as pd
from bs4 import BeautifulSoup
import re

def final_correct_heart_extraction():
    # 1. 경로 설정
    parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_standard.csv"
    
    # 46개 표준 헤더 (간병보험 규격)
    headers = [
        "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", "지급금액", "가입금액", 
        "기준보험료", "가입보험료", "적용이율", "갱신구분", "판매채널", "기준일자", "상세안내", 
        "연락처", "source_file"
    ]
    for i in range(30):
        headers.append(f"원본_열_{i}")

    # 보험사 연락처 맵
    contact_map = {
        "삼성화재": "1588-5114", "현대해상": "1588-5644", "DB손보": "1588-0100",
        "KB손보": "1544-0114", "메리츠화재": "1566-7711", "한화손보": "1588-3344",
        "흥국화재": "1566-7711", "롯데손보": "1588-3344", "MG손보": "1588-3344",
        "농협손보": "1644-9000", "삼성생명": "1588-3366", "교보생명": "1588-5588",
        "한화생명": "1588-6363", "흥국생명": "1588-6363", "신한라이프": "1588-5580",
        "미래에셋": "1588-0220", "메트라이프": "1588-9600"
    }

    all_data = []
    # 전수 조사 대상 파일 리스트 (상위 폴더)
    files = [f for f in os.listdir(parent_dir) if f.endswith(('.xls', '.html'))]
    print(f"Total files found: {len(files)}")

    for filename in files:
        file_path = os.path.join(parent_dir, filename)
        try:
            # 인코딩 대응
            content = ""
            for enc in ['cp949', 'utf-8', 'euc-kr']:
                try:
                    with open(file_path, 'r', encoding=enc) as f:
                        content = f.read()
                        if "보험" in content: break
                except: continue
            if not content: continue
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # --- [지능형 상품명 추출] ---
            real_prod_name = ""
            # 1. Caption 태그 확인
            cap = soup.find('caption')
            if cap:
                text = cap.get_text(strip=True)
                if "보장내용" in text:
                    real_prod_name = text.split("보장내용")[0].replace("상품명", "").replace(":", "").strip()
                else:
                    real_prod_name = text
            
            # 2. 상단 행에서 상품명 후보 탐색
            if not real_prod_name or len(real_prod_name) < 3:
                for tr in soup.find_all('tr')[:15]:
                    cells = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
                    for cell in cells:
                        if any(k in cell for k in ["무배당", "(무)", "보험"]):
                            if len(cell) > 5 and not any(x in cell for x in ["지급사유", "보험회사명", "담보명", "급부명"]):
                                real_prod_name = cell
                                break
                    if real_prod_name: break

            # 정제
            if real_prod_name:
                real_prod_name = real_prod_name.replace("보험회사명", "").replace("상품명", "").replace(":", "").strip()
                # 불필요한 접두사 제거
                for c_name in contact_map.keys():
                    real_prod_name = real_prod_name.replace(c_name, "").strip()

            # --- [필터링 철칙] ---
            # 1. 상품명을 찾지 못했으면 제외 (정확한 데이터를 위해)
            if not real_prod_name or len(real_prod_name) < 3:
                continue
            
            # 2. 상품명에 '암', '종신', '변액', '연금'이 들어있으면 무조건 제외
            if any(ex in real_prod_name for ex in ["암", "종신", "변액", "연금"]):
                continue

            # 보험사 식별
            comp_name = "기타"
            for c in contact_map.keys():
                if c in content or c in filename or c[:2] in filename:
                    comp_name = c
                    break

            # 데이터 행 추출
            rows = soup.find_all('tr')
            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if not cols or len(cols) < 2: continue
                
                row_text = " ".join(cols)
                # 심장/혈관/뇌 보장 검색
                if any(k in row_text for k in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]):
                    # 보장 내용에서도 암 관련은 필터링
                    if any(ex in row_text for ex in ["암진단", "암수술"]): continue

                    item = {h: "" for h in headers}
                    item["보험회사"] = comp_name
                    item["상품명"] = real_prod_name
                    item["구분"] = "특약" if "특약" in row_text else "주계약"
                    
                    # 담보명 매핑
                    if cols[0] in ["주계약", "특약", "선택"]:
                        item["담보명(급부명)"] = cols[1] if len(cols) > 1 else ""
                        item["지급사유"] = cols[2] if len(cols) > 2 else ""
                    else:
                        item["담보명(급부명)"] = cols[0]
                        item["지급사유"] = cols[1] if len(cols) > 1 else ""
                    
                    # 보험료 추출 (XX,XXX 원 포맷 유지)
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
                    
                    # 원본 데이터 보존 (원본_열_0 ~ 29)
                    for idx, val in enumerate(cols[:30]):
                        item[f"원본_열_{idx}"] = val
                        
                    all_data.append(item)
        except Exception as e:
            continue

    if all_data:
        df_final = pd.DataFrame(all_data)
        # 중복 제거
        df_final = df_final.drop_duplicates(subset=["보험회사", "상품명", "담보명(급부명)", "기준보험료"])
        # 최종 저장
        try:
            df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
            print(f"SUCCESS: {len(df_final)} pure heart/health records saved to heart_master_standard.csv.")
        except Exception as e:
            # 여전히 권한 에러가 나면 다른 이름으로라도 저장
            alt_path = save_path.replace(".csv", "_final_fixed.csv")
            df_final.to_csv(alt_path, index=False, encoding='utf-8-sig')
            print(f"PERMISSION ERROR on main file. Saved to: {alt_path}")
    else:
        print("No valid heart insurance data found after strict filtering.")

if __name__ == "__main__":
    final_correct_heart_extraction()
