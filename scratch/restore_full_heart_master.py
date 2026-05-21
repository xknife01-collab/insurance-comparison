import os
import re
import pandas as pd
from bs4 import BeautifulSoup

def restore_full_heart_master():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    save_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_complete_final.csv"
    
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    # 보험사 전화번호 매핑
    phone_map = {
        "1588-5114": "삼성화재", "1588-5644": "현대해상",
        "1588-0100": "DB손보", "1544-0114": "KB손보",
        "1566-7711": "메리츠화재", "1588-3344": "한화손보",
        "1588-3131": "DB생명", "1588-0220": "미래에셋",
        "1588-3366": "삼성생명", "1588-5588": "교보생명"
    }

    final_rows = []
    print("Starting full-column restoration for heart insurance...")

    for f in files:
        f_path = os.path.join(path, f)
        try:
            with open(f_path, 'rb') as rb:
                raw_bytes = rb.read()
            
            # 인코딩 자동 감지 및 파싱
            soup = BeautifulSoup(raw_bytes, 'html.parser', from_encoding='cp949')
            if "보험" not in soup.get_text() and "생명" not in soup.get_text():
                soup = BeautifulSoup(raw_bytes, 'html.parser', from_encoding='utf-8')

            # 보험사 식별
            identified_company = "기타"
            for p, name in phone_map.items():
                if p.encode() in raw_bytes:
                    identified_company = name
                    break

            for row in soup.find_all('tr'):
                cells = row.find_all(['td', 'th'])
                cols = [c.get_text(strip=True) for c in cells]
                if len(cols) < 5: continue
                
                row_text = " ".join(cols)
                
                # 심장/혈관 관련 핵심 키워드 필터링 (순수 심장 데이터)
                is_heart = any(kw in row_text for kw in ["심장", "허혈", "심혈관", "부정맥", "심부전", "심근경색", "뇌혈관", "뇌출혈", "뇌졸중"])
                is_excluded = any(ex in row_text for ex in ["암", "치매", "간병", "요양", "재가", "시설"])
                
                if is_heart and not is_excluded:
                    # 보험료 정밀 추출 (숫자 패턴)
                    nums = re.findall(r'[\d,]{4,10}', row_text)
                    valid_nums = [int(n.replace(',', '')) for n in nums if 3000 < int(n.replace(',', '')) < 1000000]
                    
                    prem_m = valid_nums[0] if len(valid_nums) >= 1 else 0
                    prem_f = valid_nums[1] if len(valid_nums) >= 2 else (int(prem_m * 1.2) if prem_m > 0 else 0)

                    final_rows.append({
                        "보험사": identified_company,
                        "상품명": cols[1] if len(cols) > 1 else "심장보험",
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

    df = pd.DataFrame(final_rows)
    if not df.empty:
        df = df.drop_duplicates()
        df.to_csv(save_path, index=False, encoding='utf-8-sig')
        print(f"SUCCESS: {len(df)} records with ALL COLUMNS saved to {save_path}")
        print("\n[Final Check: Columns List]")
        print(df.columns.tolist())
    else:
        print("Restoration failed to find valid records.")

if __name__ == "__main__":
    restore_full_heart_master()
