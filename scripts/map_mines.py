import pandas as pd
import glob
import os
import re

def map_ubj_gold_mines():
    # 모든 XLS 파일 검색
    all_files = glob.glob(r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data\*.xls')
    
    # 잡다 보험 완전 배제
    black_list = ['치아', '펫', '반려', '강아지', '고양이', '어린이', '자녀', '아이', '상해', '운전자', '화재', '자동차', '저축', '연금']
    # 유병자 건강보험 전용 키워드
    white_list = ['간편', '유병', '305', '355', '335', '325', '345', '심사', 'NX5', 'N5', 'հ', 'պ', 'ΰħ', '̷Ʈ', 'ں']

    print(f"{'File Name':<15} | {'Status':<30} | {'Products Found'}")
    print("-" * 65)

    gold_mines = []

    for f_path in all_files:
        f_name = os.path.basename(f_path)
        try:
            df = pd.read_excel(f_path, engine='xlrd', header=None)
            found_count = 0
            carriers = set()
            
            for idx, row in df.iterrows():
                row_str = " ".join([str(v) for v in row.tolist()])
                
                # 보험료 형태의 숫자 2개 이상 발견 확인
                prems = []
                for v in row:
                    try:
                        s = re.sub(r'[^0-9]', '', str(v).split('.')[0])
                        if s and 10000 < int(s) < 250000: prems.append(int(s))
                    except: continue
                
                if len(prems) >= 2:
                    # 유병자 증거 및 지뢰 배제
                    is_ubj = any(k in row_str for k in white_list)
                    is_junk = any(k in row_str for k in black_list)
                    
                    if is_ubj and not is_junk:
                        found_count += 1
                        # 대략적인 회사명 파악
                        if any(k in row_str for k in ['삼성', 'Ｚ']): carriers.add('삼성')
                        elif any(k in row_str for k in ['메리츠', '޸']): carriers.add('메리츠')
                        elif 'DB' in row_str: carriers.add('DB')
                        elif 'KB' in row_str: carriers.add('KB')
                        elif '현대' in row_str: carriers.add('현대')

            if found_count > 0:
                gold_mines.append(f_name)
                carrier_str = "/".join(list(carriers)) or "기타"
                print(f"{f_name:<15} | {carrier_str:<30} | {found_count} items")
            
        except: continue

    print("-" * 65)
    print(f"[*] MAP COMPLETE: {len(gold_mines)} Gold Mines identified as GENUINE UBJ sources.")

if __name__ == "__main__":
    map_ubj_gold_mines()
