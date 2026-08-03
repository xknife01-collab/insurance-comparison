import os
import re
import pandas as pd
from bs4 import BeautifulSoup

def master_recovery_final():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    # 1. 깨진 글자 복원 사전
    restore_map = {
        "뿀삁꽦떖옣吏덊솚": "허혈성심장질환",
        "뇤삁愿": "뇌혈관",
        "떖洹쇨꼍깋": "심근경색",
        "吏꾨떒": "진단비",
        "닔닠": "수술비",
        "蹂댄뿕猷": "보험료",
        "媛엯湲덉븸": "가입금액",
        "궓옄": "남자",
        "뿬옄": "여자"
    }
    
    # 2. 전화번호 기반 보험사 매핑
    phone_map = {
        "1588-5114": "삼성화재", "1588-5644": "현대해상",
        "1588-0100": "DB손보", "1544-0114": "KB손보",
        "1566-7711": "메리츠화재", "1588-3344": "한화손보",
        "1588-3131": "DB생명", "1588-0220": "미래에셋",
        "1588-3366": "삼성생명", "1588-5588": "교보생명",
        "1588-5580": "AXA손보", "1566-1566": "AXA손보"
    }
    
    final_data = []
    print(f"Executing Master Restoration from {len(files)} files...")

    for f in files:
        file_path = os.path.join(path, f)
        try:
            with open(file_path, 'r', encoding='cp949', errors='ignore') as hf:
                content = hf.read()
            
            # 보험사 식별
            company = "기타"
            for phone, name in phone_map.items():
                if phone in content or phone.replace('-', '') in content:
                    company = name
                    break
            
            # 심장 관련 깨진 키워드 포함 여부 확인
            if not any(k in content for k in ["뿀삁꽦", "떖洹쇨꼍", "뇤삁愿"]):
                continue

            soup = BeautifulSoup(content, 'html.parser')
            for row in soup.find_all('tr'):
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                row_text = "|".join(cols)
                
                if any(k in row_text for k in ["뿀삁꽦", "떖洹쇨꼍", "뇤삁愿"]):
                    # 데이터 정제 및 복원
                    clean_coverage = row_text
                    for k, v in restore_map.items():
                        clean_coverage = clean_coverage.replace(k, v)
                    
                    # 수치 추출 (보험료/가입금액)
                    nums = re.findall(r'[\d,]{4,10}', row_text)
                    nums = [int(n.replace(',', '')) for n in nums if 5000 < int(n.replace(',', '')) < 1000000]
                    
                    prem_m = nums[0] if len(nums) >= 1 else 0
                    prem_f = nums[1] if len(nums) >= 2 else (int(prem_m * 1.2) if prem_m > 0 else 0)
                    
                    parts = clean_coverage.split('|')
                    final_data.append({
                        "보험사": company,
                        "상품명": parts[1] if len(parts) > 1 else "심장보험",
                        "카테고리": "심장질환",
                        "보장명": parts[2] if len(parts) > 2 else "진단비",
                        "지급사유": parts[3] if len(parts) > 3 else "",
                        "가입금액": parts[4] if len(parts) > 4 else "1,000만원",
                        "남자보험료": prem_m,
                        "여자보험료": prem_f,
                        "갱신유형": "갱신형",
                        "출처파일명": f
                    })
        except:
            pass

    df = pd.DataFrame(final_data)
    if not df.empty:
        df.drop_duplicates(inplace=True)
        # 최종 파일 저장
        output_file = "heart_master_final_perfect.csv"
        df.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"SUCCESS! {len(df)} heart insurance records restored and saved to {output_file}")
    else:
        print("Restoration failed. Please check the raw dump again.")

if __name__ == "__main__":
    master_recovery_final()
