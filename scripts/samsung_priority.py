import pandas as pd
import glob
import os
import requests
from dotenv import load_dotenv

# .env.local 로드
load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def clean_pure_txt(val):
    if not isinstance(val, str): return ""
    return "".join([c for c in val if c.isalnum() or c in '() ._-,']).strip()

def samsung_priority_ingestion():
    headers = { "apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json" }
    
    # 삼성/메리츠의 정품 팩트가 가장 많은 파일들
    priority_files = ['file_47.xls', 'file_31.xls', 'file_30.xls', 'file_48.xls']
    total = 0
    
    ban_kws = ['치아', '어린이', '자녀', '아이', '꿈나무', '상해', '운전자', '자동차', '화재', '재물', '펫', '반려', '저축', '연금', '사망', '종신']

    for fname in priority_files:
        f = os.path.join(r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data', fname)
        if not os.path.exists(f): continue
        print(f"[*] PRIORITY SCAN on {fname}...")
        try:
            df = pd.read_excel(f, engine='xlrd', header=None)
            for idx, row in df.iterrows():
                row_str = " ".join([str(v) for v in row.tolist()])
                
                # 보험료 추출
                prems = []
                for v in row:
                    try:
                        s = str(v).replace(',', '').split('.')[0]
                        val = int(s)
                        if 10000 < val < 200000: prems.append(val)
                    except: continue
                
                if len(prems) >= 2:
                    is_samsung = '삼성' in row_str or 'Ｚ' in row_str
                    is_meritz = '메리츠' in row_str or '޸' in row_str
                    
                    if not (is_samsung or is_meritz): continue
                    if any(k in row_str for k in ban_kws): continue

                    comp = "삼성화재" if is_samsung else "메리츠화재"
                    p_name = clean_pure_txt(str(row[2]))
                    
                    data = {
                        "company_name": comp,
                        "product_name": p_name or "유병자 종합보험",
                        "rates": { f"premium_M_{a}": int(prems[0]) for a in [30,40,50,60,70,80] },
                        "category": "건강보험",
                        "review_type": "간편심사"
                    }
                    data["rates"].update({ f"premium_F_{a}": int(prems[1]) for a in [30,40,50,60,70,80] })

                    res = requests.post(f"{URL}/rest/v1/insurance_yu_byung_ja", headers=headers, json=data)
                    if res.status_code in [200, 201, 204]:
                        total += 1
                        print(f"  [PRIORITY] {comp} - {p_name[:30]}")
            
        except: continue

    print(f"[*] PRIORITY DONE: {total} Samsung/Meritz products added.")

if __name__ == "__main__":
    samsung_priority_ingestion()
