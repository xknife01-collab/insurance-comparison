import pandas as pd
import os
from bs4 import BeautifulSoup
import re

# 설정
root_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
output_dir = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'

# 핵심 키워드 (뇌/혈관만!)
include_keywords = ['뇌혈관', '뇌졸중', '뇌출혈', '뇌경색']
# 제외 키워드 (심장, 치매 등 잡다한 것들 차단!)
exclude_keywords = ['심장', '허혈성', '심근경색', '치매', '간병', '치아', '유병자', '수술/입원', '암보험', '사망']

columns = [
    '보험회사', '상품명', '구분', '담보명(급부명)', '지급사유', '지급금액', 
    '가입금액', '기준보험료', '가입보험료', '적용이율', '갱신구분', 
    '판매채널', '기준일자', '상세안내', '연락처', 'source_file'
]

def clean_text(text):
    if not text: return ""
    return re.sub(r'\s+', ' ', str(text)).strip()

def extract_pure_brain_data():
    all_data = []
    files = [f for f in os.listdir(root_dir) if f.endswith('.xls')]
    
    for file_name in files:
        file_path = os.path.join(root_dir, file_name)
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                soup = BeautifulSoup(f, 'html.parser')
            
            # 회사명 추출
            company_match = re.search(r'([가-힣]+(?:생명|화재|해상|보험))', soup.get_text())
            current_company = company_match.group(1) if company_match else ""

            for tr in soup.find_all('tr'):
                cells = [clean_text(td.get_text()) for td in tr.find_all(['td', 'th'])]
                if not cells: continue
                
                row_str = " ".join(cells)
                
                # 1. 포함 키워드 체크
                if any(kw in row_str for kw in include_keywords):
                    # 2. 제외 키워드 체크 (매우 중요!)
                    if any(ekw in row_str for ekw in exclude_keywords):
                        continue
                        
                    data = {col: "" for col in columns}
                    data['보험회사'] = current_company
                    
                    # 담보명(급부명)이 포함된 셀 찾기
                    dam_bo = ""
                    for c in cells:
                        if any(kw in c for kw in include_keywords):
                            dam_bo = c
                            break
                    
                    if not dam_bo: continue
                    
                    data['담보명(급부명)'] = dam_bo
                    data['상품명'] = cells[1] if len(cells) > 1 else ""
                    data['지급사유'] = cells[4] if len(cells) > 4 else ""
                    data['지급금액'] = cells[5] if len(cells) > 5 else ""
                    data['가입금액'] = cells[6] if len(cells) > 6 else ""
                    data['source_file'] = file_name
                    
                    all_data.append(data)
                    
        except: continue

    if all_data:
        df = pd.DataFrame(all_data).drop_duplicates()
        df.to_csv(os.path.join(output_dir, 'extracted_data.csv'), index=False, encoding='utf-8-sig')
        df.to_excel(os.path.join(output_dir, 'extracted_data.xlsx'), index=False, engine='openpyxl')
        print(f"완료: {len(df)}건의 순수 뇌혈관 데이터 추출")
    else:
        print("데이터 없음")

if __name__ == "__main__":
    extract_pure_brain_data()
