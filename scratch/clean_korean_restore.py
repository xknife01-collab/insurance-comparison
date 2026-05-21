import os
import re
import pandas as pd
from bs4 import BeautifulSoup

def clean_korean_restore():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    # 보험사 고객센터 번호 (가장 확실한 식별자)
    phone_map = {
        "1588-5114": "삼성화재", "1588-5644": "현대해상",
        "1588-0100": "DB손보", "1544-0114": "KB손보",
        "1566-7711": "메리츠화재", "1588-3344": "한화손보",
        "1588-3131": "DB생명", "1588-0220": "미래에셋",
        "1588-3366": "삼성생명", "1588-5588": "교보생명",
        "1588-6363": "흥국생명", "1588-6500": "동양생명"
    }

    results = []
    print("Starting clean Korean restoration...")

    for f in files:
        file_path = os.path.join(path, f)
        try:
            # 바이너리로 읽어서 깨진 한글(UTF-8을 CP949로 오해한 경우 등)을 강제 교정
            with open(file_path, 'rb') as b:
                raw = b.read()
            
            # 인코딩 시도 순서: CP949(완성형), UTF-8, EUC-KR
            content = ""
            for enc in ['cp949', 'utf-8', 'euc-kr']:
                try:
                    content = raw.decode(enc)
                    if "<table" in content.lower():
                        break
                except:
                    continue
            
            if not content: continue

            # 보험사 식별
            company = "기타"
            for phone, name in phone_map.items():
                if phone in content or phone.replace('-', '') in content:
                    company = name
                    break
            
            # BeautifulSoup으로 테이블 파싱
            soup = BeautifulSoup(content, 'html.parser')
            for row in soup.find_all('tr'):
                cols = [c.get_text(separator=' ', strip=True) for c in row.find_all(['td', 'th'])]
                if len(cols) < 5: continue
                
                row_text = " ".join(cols)
                
                # 심장/혈관 관련 핵심 키워드 (제대로 된 한글만 필터링)
                if any(kw in row_text for kw in ["심장", "허혈", "심혈관", "부정맥", "심근경색", "뇌혈관"]):
                    # 보험료 추출
                    nums = re.findall(r'\d+', row_text.replace(',', ''))
                    valid_nums = [int(n) for n in nums if 3000 < int(n) < 1000000]
                    
                    prem_m = valid_nums[0] if len(valid_nums) >= 1 else 0
                    prem_f = valid_nums[1] if len(valid_nums) >= 2 else (int(prem_m * 1.2) if prem_m > 0 else 0)

                    results.append({
                        "보험사": company,
                        "상품명": cols[1] if len(cols) > 1 else "",
                        "카테고리": "심장질환",
                        "보장명": cols[2] if len(cols) > 2 else "",
                        "지급사유": cols[3] if len(cols) > 3 else "",
                        "가입금액": cols[4] if len(cols) > 4 else "",
                        "남자보험료": prem_m,
                        "여자보험료": prem_f,
                        "갱신유형": "비갱신형" if "비갱신" in row_text else "갱신형",
                        "출처파일명": f
                    })
        except:
            continue

    df = pd.DataFrame(results)
    if not df.empty:
        # 한글이 깨진 행(특수문자가 너무 많은 경우) 제거
        def is_clean(text):
            if not text: return False
            # 한글 비중이 너무 낮으면 깨진 것으로 간주
            korean = re.findall(r'[\uac00-\ud7af]', str(text))
            return len(korean) / len(str(text)) > 0.3 if len(str(text)) > 0 else False

        df = df[df['상품명'].apply(is_clean)]
        
        output_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_clean.csv"
        df.to_csv(output_path, index=False, encoding='utf-8-sig')
        print(f"SUCCESS: {len(df)} clean records saved to {output_path}")
        # 샘플 출력
        print("\n[Sample Data Check]")
        print(df[['보험사', '상품명', '보장명']].head(10))
    else:
        print("No clean data found.")

if __name__ == "__main__":
    clean_korean_restore()
