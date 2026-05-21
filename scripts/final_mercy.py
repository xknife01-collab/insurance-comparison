import pandas as pd
import os
import requests
import re
from dotenv import load_dotenv

# .env.local 로드
load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def extract_digit(v):
    s = re.sub(r'[^0-9]', '', str(v).split('.')[0])
    if s and 10000 < int(s) < 200000: return int(s)
    return None

def final_mercy_ingestion():
    headers = { "apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json" }
    
    # 1. Nuclear Wipe (모두 비우기)
    requests.delete(f"{URL}/rest/v1/insurance_yu_byung_ja?id=neq.-1", headers=headers)
    print("[*] UBJ 테이블 대청소 완료.")

    fnames = ['file_47.xls', 'file_31.xls', 'file_30.xls', 'file_48.xls']
    total = 0

    for fname in fnames:
        f = os.path.join(r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data', fname)
        if not os.path.exists(f): continue
        print(f"[*] Analyzing Golden {fname}...")
        try:
            df = pd.read_excel(f, engine='xlrd', header=None)
            for idx, row in df.iterrows():
                row_str = " ".join([str(v) for v in row.tolist()])
                prems = [extract_digit(v) for v in row if extract_digit(v)]
                
                if len(prems) >= 2:
                    is_samsung = any(k in row_str for k in ['삼성', 'Ｚ', '\uff3a'])
                    is_meritz = any(k in row_str for k in ['메리츠', '޸', '\u07b8'])
                    
                    if not (is_samsung or is_meritz): continue
                    
                    # '치아' 등이 포함되면 제외
                    if '치아' in row_str or '어린이' in row_str or '자녀' in row_str: continue

                    comp = "삼성화재" if is_samsung else "메리츠화재"
                    
                    data = {
                        "company_name": comp,
                        "product_name": str(row[2]).strip() or "유병자 종합보험",
                        "rates": { f"premium_M_{a}": int(prems[0]) for a in [30,40,50,60,70,80] },
                        "category": "건강보험",
                        "review_type": "간편심사"
                    }
                    data["rates"].update({ f"premium_F_{a}": int(prems[1]) for a in [30,40,50,60,70,80] })

                    res = requests.post(f"{URL}/rest/v1/insurance_yu_byung_ja", headers=headers, json=data)
                    if res.status_code in [200, 201, 204]:
                        total += 1
                        print(f"  [SUCC] {comp} - {data['product_name'][:30]}")
            
        except: continue

    print(f"[*] FINAL MERCY DONE: {total} Samsung/Meritz products in DB.")

if __name__ == "__main__":
    final_mercy_ingestion()
