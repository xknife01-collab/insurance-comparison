import os
import re
import pandas as pd
from bs4 import BeautifulSoup

def absolute_korean_restore():
    # 타겟 경로
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_final_clean.csv"
    
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    # 보험사 고객센터 (숫자는 절대 깨지지 않음)
    phones = {"1588-5114": "삼성화재", "1588-5644": "현대해상", "1588-0100": "DB손보"}

    master_results = []

    for f in files:
        f_path = os.path.join(path, f)
        try:
            # 바이너리로 읽어서 원천 데이터 확보
            with open(f_path, 'rb') as rb:
                raw_bytes = rb.read()
            
            # 인코딩 강제 매칭 (BeautifulSoup의 유연한 파싱 활용)
            # FROM_ENCODING을 명시하지 않고 UnicodeDammit(bs4 내부)이 찾게 함
            soup = BeautifulSoup(raw_bytes, 'html.parser', from_encoding='cp949')
            
            # 만약 한글이 깨졌다면 utf-8로 재시도
            if "보험" not in soup.get_text() and "생명" not in soup.get_text():
                soup = BeautifulSoup(raw_bytes, 'html.parser', from_encoding='utf-8')

            # 그래도 안되면... (특수 케이스)
            identified_company = "기타"
            for p, name in phones.items():
                if p.encode() in raw_bytes:
                    identified_company = name
                    break

            for row in soup.find_all('tr'):
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if len(cols) < 5: continue
                
                txt = " ".join(cols)
                # 정규표현식으로 '진단' 또는 '수술'이 포함된 진짜 한글 행만 추출
                if re.search(r'[진단|수술|심장|허혈|혈관]', txt):
                    master_results.append({
                        "보험사": identified_company,
                        "상품명": cols[1] if len(cols) > 1 else "",
                        "보장명": cols[2] if len(cols) > 2 else "",
                        "지급사유": cols[3] if len(cols) > 3 else "",
                        "보험료": txt # 나중에 추출
                    })
        except:
            continue

    # 데이터 저장 (가장 안전한 utf-8-sig)
    df = pd.DataFrame(master_results)
    df.to_csv(save_path, index=False, encoding='utf-8-sig')
    print(f"Extraction Done. Saved to {save_path}")

if __name__ == "__main__":
    absolute_korean_restore()
