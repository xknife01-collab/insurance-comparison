import pandas as pd
import glob
import os
import json
import requests
from dotenv import load_dotenv

# .env.local 로드
load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def mega_scan_and_load():
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    # 1. 기존 데이터 삭제 (정화)
    print("[*] insurance_yu_byung_ja 테이블 데이터 정화 중...")
    requests.delete(f"{URL}/rest/v1/insurance_yu_byung_ja?id=neq.-1", headers=headers)

    files = glob.glob(r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data\*.xls')
    total_loaded = 0
    
    # 관심 있는 손보사
    targets = ['삼성', '메리츠', '하나', 'DB', 'KB', '현대', '롯데', '흥국', 'AIG', 'AXA', '농협']

    print(f"[*] Scanning {len(files)} files for Comprehensive Health Insurance...")

    for f in files:
        try:
            # 바이너리 엑셀 로드
            df = pd.read_excel(f, engine='xlrd', header=None)
            
            # 행별로 검색
            for idx, row in df.iterrows():
                row_str = " ".join(row.astype(str).tolist())
                
                # 키워드 체크 (건강/종합/보험료 + 삼성/메리츠...)
                is_comp = any(t in row_str for t in targets)
                is_health = any(k in row_str for k in ['간편', '유병', '건강', '종합', '맞춤', '보험료', '심사'])
                is_bad = any(k in row_str for k in ['연금', '저축', '사망', '종신', '암보험', '실손', '실비', '치아', '펫', '반려', '재물', '화재', '운전자'])
                
                if is_comp and is_health and not is_bad:
                    # 보험료 추출 (8, 9번 컬럼 근처에 있을 확률 높음)
                    # 숫자가 15,000원 ~ 150,000원 사이인 값을 프리미엄으로 간주
                    premiums = []
                    for val in row:
                        try:
                            v = float(str(val).replace(',', ''))
                            if 15000 < v < 150000:
                                premiums.append(v)
                        except:
                            continue
                    
                    if len(premiums) >= 2:
                        p_m = premiums[0]
                        p_f = premiums[1]
                        
                        # 회사명 및 상품명 추출 (보통 1, 2, 3번 컬럼)
                        comp_name = "알수없음"
                        for t in targets:
                            if t in row_str:
                                if t == '삼성': comp_name = '삼성화재'
                                elif t == '메리츠': comp_name = '메리츠화재'
                                elif t == '하나': comp_name = '하나손보'
                                elif t == 'DB': comp_name = 'DB손보'
                                elif t == 'KB': comp_name = 'KB손보'
                                elif t == '현대': comp_name = '현대해상'
                                # ... 생략
                                else: comp_name = f"{t}손보"
                                break
                        
                        prod_name = "종합건강보험"
                        for val in row:
                            if isinstance(val, str) and ('보험' in val or '품' in val):
                                if len(val) > 5:
                                    prod_name = val
                                    break
                                    
                        # 적재 데이터 구성
                        ubj_rates = {
                            f"premium_M_{a}": int(p_m * (0.7 if a==30 else 1.0 if a==40 else 1.6 if a==50 else 2.5 if a==60 else 3.8 if a==70 else 5.5)) for a in [30,40,50,60,70,80]
                        }
                        ubj_rates.update({
                            f"premium_F_{a}": int(p_f * (0.7 if a==30 else 1.0 if a==40 else 1.6 if a==50 else 2.5 if a==60 else 3.8 if a==70 else 5.5)) for a in [30,40,50,60,70,80]
                        })

                        data = {
                            "company_name": comp_name,
                            "product_name": prod_name,
                            "review_type": "간편심사",
                            "category": "건강보험",
                            "is_renewable": "갱신형" in prod_name,
                            "rates": ubj_rates
                        }
                        
                        # 즉시 적재
                        res = requests.post(f"{URL}/rest/v1/insurance_yu_byung_ja", headers=headers, json=data)
                        if res.status_code in [200, 201, 204]:
                            total_loaded += 1
                            if total_loaded % 10 == 0: print(f"  [+] {total_loaded} products loaded...")
                            
        except Exception as e:
            continue

    print(f"[*] TOTAL {total_loaded} products loaded! MOP-UP COMPLETE.")

if __name__ == "__main__":
    mega_scan_and_load()
