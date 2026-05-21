import pandas as pd
import glob
import os
import re

def final_total_mapping():
    all_files = glob.glob(r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data\*.xls')
    
    # 잡다 보험 완전 배제
    black_list = ['치아', '펫', '반려', '강아지', '고양이', '어린이', '자녀', '아이', '상해', '운전자', '자동차', '화재', '저축', '연금']
    
    print(f"{'Rank':<8} | {'File Name':<15} | {'Detected Carrier':<30} | {'Count'}")
    print("-" * 75)

    report = []

    for f_path in all_files:
        f_name = os.path.basename(f_path)
        try:
            df = pd.read_excel(f_path, engine='xlrd', header=None)
            found_count = 0
            carriers = set()
            
            for idx, row in df.iterrows():
                row_str = " ".join([str(v) for v in row.tolist()])
                
                # 보험료 추출
                prems = []
                for v in row:
                    try:
                        s = re.sub(r'[^0-9]', '', str(v).split('.')[0])
                        if s and 10000 < int(s) < 250000: prems.append(int(s))
                    except: continue
                
                if len(prems) >= 2:
                    # 유병자 증거 (매우 완화된 조건으로 성격 파악)
                    is_health = any(k in row_str for k in ['간편', '유병', '심사', '335', '355', '311', '321', '305', 'N5', 'հ', ' պ', 'ΰħ', '̷Ʈ', 'ں'])
                    is_junk = any(k in row_str for k in black_list)
                    
                    if is_health and not is_junk:
                        found_count += 1
                        if any(k in row_str for k in ['삼성', 'Ｚ']): carriers.add('삼성')
                        elif any(k in row_str for k in ['메리츠', '޸']): carriers.add('메리츠')
                        elif 'DB' in row_str: carriers.add('DB')
                        elif 'KB' in row_str: carriers.add('KB')
                        elif '현대' in row_str: carriers.add('현대')
                        elif '하나' in row_str: carriers.add('하나')
                        elif '한화' in row_str: carriers.add('한화')
                        elif '농협' in row_str: carriers.add('농협')

            if found_count > 0:
                rank = "GOLD" if found_count > 50 else "SILVER" if found_count > 10 else "BRONZE"
                report.append((found_count, f_name, "/".join(carriers) or "기타", rank))
            
        except: continue

    # 상품 수 기준으로 정렬
    report.sort(key=lambda x: x[0], reverse=True)
    
    for count, f_name, carrier, rank in report:
        print(f"{rank:<8} | {f_name:<15} | {carrier:<30} | {count} items")

    print("-" * 75)
    print(f"[*] TOTAL SCAN COMPLETE: {len(report)} folders identified as valid sources.")

if __name__ == "__main__":
    final_total_mapping()
