import pandas as pd
import os
from bs4 import BeautifulSoup
import re

# 설정
root_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
output_dir = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'
keywords = ['뇌혈관', '뇌졸중', '뇌출혈', '뇌경색']

# caregiving 규격에 맞춘 컬럼 정의
columns = [
    '보험회사', '상품명', '구분', '담보명(급부명)', '지급사유', '지급금액', 
    '가입금액', '기준보험료', '가입보험료', '적용이율', '갱신구분', 
    '판매채널', '기준일자', '상세안내', '연락처', 'source_file'
]

def clean_text(text):
    if not text: return ""
    # 공백 및 줄바꿈 정리
    text = re.sub(r'\s+', ' ', str(text)).strip()
    return text

def extract_brain_data():
    all_data = []
    
    # 루트 폴더의 모든 .xls 파일 스캔
    files = [f for f in os.listdir(root_dir) if f.endswith('.xls')]
    print(f"총 {len(files)}개 파일 분석 시작...")

    for file_name in files:
        file_path = os.path.join(root_dir, file_name)
        try:
            # HTML 기반 엑셀 읽기 (BeautifulSoup 사용)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                soup = BeautifulSoup(f, 'html.parser')
            
            rows = soup.find_all('tr')
            current_product = ""
            current_company = ""
            
            # 파일 내에서 회사명/상품명 추측 (보통 상단에 위치)
            title_text = soup.get_text()
            company_match = re.search(r'([가-힣]+(?:생명|화재|해상|보험))', title_text)
            if company_match:
                current_company = company_match.group(1)

            for tr in rows:
                cells = [clean_text(td.get_text()) for td in tr.find_all(['td', 'th'])]
                if not cells: continue
                
                row_str = " ".join(cells)
                
                # 뇌 관련 키워드가 있는 행만 추출
                if any(kw in row_str for kw in keywords):
                    # caregiving 구조에 최대한 맞추어 데이터 매핑 (인덱스는 파일 구조마다 다를 수 있으므로 유연하게 처리)
                    # 기본적으로 0:회사, 1:상품명, 3:담보명 등을 시도
                    data = {col: "" for col in columns}
                    
                    # 데이터 매핑 (기본적인 휴리스틱 적용)
                    data['보험회사'] = current_company if current_company else (cells[0] if len(cells) > 0 else "")
                    data['상품명'] = cells[1] if len(cells) > 1 else ""
                    data['구분'] = cells[2] if len(cells) > 2 else ""
                    data['담보명(급부명)'] = cells[3] if len(cells) > 3 else ""
                    data['지급사유'] = cells[4] if len(cells) > 4 else ""
                    data['지급금액'] = cells[5] if len(cells) > 5 else ""
                    data['가입금액'] = cells[6] if len(cells) > 6 else ""
                    data['기준보험료'] = cells[7] if len(cells) > 7 else ""
                    data['가입보험료'] = cells[8] if len(cells) > 8 else ""
                    data['source_file'] = file_name
                    
                    # 담보명이 비어있으면 키워드가 포함된 셀을 담보명으로 지정
                    if not data['담보명(급부명)']:
                        for c in cells:
                            if any(kw in c for kw in keywords):
                                data['담보명(급부명)'] = c
                                break
                    
                    all_data.append(data)
                    
        except Exception as e:
            print(f"파일 처리 오류 ({file_name}): {e}")

    # 결과 저장
    if all_data:
        df = pd.DataFrame(all_data)
        # 중복 제거 및 정리
        df.drop_duplicates(inplace=True)
        
        csv_path = os.path.join(output_dir, 'extracted_data.csv')
        xlsx_path = os.path.join(output_dir, 'extracted_data.xlsx')
        
        df.to_csv(csv_path, index=False, encoding='utf-8-sig')
        df.to_excel(xlsx_path, index=False, engine='openpyxl')
        
        print(f"추출 완료! 총 {len(df)}행 정규화됨.")
        print(f"CSV: {csv_path}")
        print(f"XLSX: {xlsx_path}")
    else:
        print("추출된 데이터가 없습니다.")

if __name__ == "__main__":
    extract_brain_data()
