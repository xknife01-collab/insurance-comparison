import os
import pandas as pd
import warnings
from bs4 import BeautifulSoup
import argparse
import sys

# 인코딩 문제 방지
import io
if sys.stdout is not None:
    sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')

warnings.filterwarnings('ignore')

def run_scraper(category, keywords):
    """
    범용 보험 데이터 스크래퍼
    :param category: 보험 카테고리 이름 (예: cancer, silbi, dental)
    :param keywords: 검색할 키워드 리스트 (예: ['암', '진단비'])
    """
    root_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main'
    target_dir = os.path.join(root_path, 'insurance-comparison-main', 'insurance_data', '1_guaranteed', category)
    output_file = os.path.join(target_dir, 'extracted_data.csv')
    
    all_files = [f for f in os.listdir(root_path) if f.lower().endswith('.xls')]
    all_extracted_rows = []
    
    print(f"--- [{category.upper()}] 데이터 추출 시작 (키워드: {', '.join(keywords)}) ---")
    print(f"--- 총 {len(all_files)}개 원본 파일 스캔 중 ---")

    for idx, filename in enumerate(all_files):
        file_path = os.path.join(root_path, filename)
        content = ""
        
        # 1. 최적의 인코딩 시도
        for enc in ['utf-8', 'cp949', 'euc-kr']:
            try:
                with open(file_path, 'r', encoding=enc, errors='ignore') as f:
                    content = f.read()
                    if any(kw in content for kw in keywords):
                        break
            except:
                continue
        
        if not content: continue

        try:
            # 2. BeautifulSoup 정밀 파싱
            soup = BeautifulSoup(content, 'html.parser')
            rows = soup.find_all('tr')
            
            for tr in rows:
                cells = [td.get_text(separator=' ').strip() for td in tr.find_all(['td', 'th'])]
                if not cells: continue
                
                row_text = " ".join(cells)
                if any(kw in row_text for kw in keywords):
                    data = {f"원본_열_{i}": val for i, val in enumerate(cells)}
                    data['source_file'] = filename
                    data['보험회사'] = cells[0] if len(cells) > 0 else ""
                    data['상품명'] = cells[1] if len(cells) > 1 else ""
                    
                    target_cells = [c for c in cells if any(kw in c for kw in keywords)]
                    if target_cells:
                        data['담보명(급부명)'] = max(target_cells, key=len)
                    
                    all_extracted_rows.append(data)
        except Exception as e:
            print(f"Error in {filename}: {e}")

    # 3. 결과 저장
    if all_extracted_rows:
        df_final = pd.DataFrame(all_extracted_rows)
        df_final.drop_duplicates(inplace=True)
        os.makedirs(target_dir, exist_ok=True)
        df_final.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"\n--- 완료! 총 {len(df_final)}건의 [{category}] 데이터를 '{output_file}'에 저장했습니다. ---")
    else:
        print(f"\n--- 결과 없음: 키워드에 부합하는 [{category}] 데이터를 찾지 못했습니다. ---")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Incar 보험 데이터 범용 스크래퍼')
    parser.add_argument('--category', required=True, help='보험 카테고리 (예: cancer, brain, dental)')
    parser.add_argument('--keywords', required=True, help='검색 키워드 (쉼표로 구분, 예: 암,진단비,표적항암)')
    
    args = parser.parse_args()
    kw_list = [k.strip() for k in args.keywords.split(',')]
    
    run_scraper(args.category, kw_list)
