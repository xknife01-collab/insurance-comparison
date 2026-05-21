import os
import pandas as pd
from bs4 import BeautifulSoup
import re

def final_perfect_heart_extraction():
    # 1. 경로 설정
    parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_standard.csv"
    
    # 46개 표준 헤더 정의 (간병보험 규격)
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
        "한화생명": "1588-6363", "흥국생명": "1588-6363", "동양생명": "1577-1004",
        "신한라이프": "1588-5580", "미래에셋": "1588-0220", "메트라이프": "1588-9600"
    }

    all_data = []
    files = [f for f in os.listdir(parent_dir) if f.endswith(('.xls', '.html'))]
    print(f"Total files found for scanning: {len(files)}")

    for filename in files:
        file_path = os.path.join(parent_dir, filename)
        try:
            # 인코딩 대응 (다양한 인코딩 시도)
            content = ""
            for enc in ['cp949', 'utf-8', 'euc-kr']:
                try:
                    with open(file_path, 'r', encoding=enc) as f:
                        content = f.read()
                        if "보험" in content or "내용" in content: break
                except: continue
            
            if not content:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # [핵심] 실제 상품명 추출
            real_prod_name = ""
            # 1순위: caption 태그
            caption = soup.find('caption')
            if caption:
                real_prod_name = caption.get_text(strip=True).split("보장내용")[0].replace("상품명", "").replace(":", "").strip()
            
            # 2순위: 텍스트 덩어리 분석
            if not real_prod_name or len(real_prod_name) < 3:
                candidates = [t.get_text(strip=True) for t in soup.find_all(['th', 'td', 'div', 'p', 'h1', 'h2'])]
                for t in candidates:
                    if any(k in t for k in ["무배당", "(무)", "보험", "건강", "종합", "변액", "종신"]):
                        if len(t) > 5 and "지급사유" not in t and "보험회사명" not in t:
                            real_prod_name = t
                            break
            
            # 정제
            if real_prod_name:
                real_prod_name = real_prod_name.split("보장내용")[0].replace("상품명", "").replace("보험회사명", "").replace(":", "").strip()
            
            if not real_prod_name or len(real_prod_name) < 3:
                real_prod_name = filename.split(".")[0] # 최후의 수단

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
                
                text = " ".join(cols)
                # 심장 질환 관련 핵심 필터
                if any(k in text for k in ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]):
                    # 암/치매만 있는 행은 제외 (심장 보장이 같이 있으면 포함)
                    if "암진단" in text and not any(k in text for k in ["심장", "허혈", "혈관", "부정맥"]):
                        continue

                    item = {h: "" for h in headers}
                    item["보험회사"] = comp_name
                    item["상품명"] = real_prod_name
                    item["구분"] = "특약" if "특약" in text else "주계약"
                    
                    # 담보명 및 지급사유 매핑 (일반적인 엑셀 구조 대응)
                    if cols[0] in ["주계약", "특약", "선택"]:
                        item["담보명(급부명)"] = cols[1] if len(cols) > 1 else ""
                        item["지급사유"] = cols[2] if len(cols) > 2 else ""
                    else:
                        item["담보명(급부명)"] = cols[0]
                        item["지급사유"] = cols[1] if len(cols) > 1 else ""
                    
                    # 보험료 추출 및 정규화
                    prems = re.findall(r'(\d{1,3}(?:,\d{3})+|\b\d{4,6}\b)', text)
                    if prems:
                        # 숫자가 1000 이상인 것들 중 가장 큰 것을 남자, 그 다음을 여자로 가정 (대략적)
                        valid_prems = [p for p in prems if int(p.replace(',', '')) > 500]
                        if valid_prems:
                            item["기준보험료"] = f"{valid_prems[0]} 원"
                            item["가입보험료"] = f"{valid_prems[1]} 원" if len(valid_prems) > 1 else f"{valid_prems[0]} 원"
                    
                    item["가입금액"] = "1,000만원" # 기본값
                    item["기준일자"] = "2026-05-10"
                    item["연락처"] = contact_map.get(comp_name, "1588-1001")
                    item["source_file"] = filename
                    
                    # 원본 데이터 백업
                    for idx, val in enumerate(cols[:30]):
                        item[f"원본_열_{idx}"] = val
                        
                    all_data.append(item)
        except Exception as e:
            # print(f"Error processing {filename}: {e}")
            continue

    if all_data:
        df_final = pd.DataFrame(all_data)
        # 중복 제거 (보험사, 상품명, 담보명, 보험료 기준)
        df_final = df_final.drop_duplicates(subset=["보험회사", "상품명", "담보명(급부명)", "기준보험료"])
        
        # 파일 저장 (UTF-8-SIG로 엑셀 호환성 확보)
        df_final.to_csv(save_path, index=False, encoding='utf-8-sig')
        print(f"SUCCESS: {len(df_final)} heart insurance records standardized and saved.")
    else:
        print("CRITICAL: No heart insurance records found after full scan.")

if __name__ == "__main__":
    final_perfect_heart_extraction()
