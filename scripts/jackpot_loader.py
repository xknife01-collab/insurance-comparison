import pandas as pd
import requests
import os
from dotenv import load_dotenv

# .env.local 로드
load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def fast_ingest_no_delete():
    headers = { "apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json" }
    
    f = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data\file_47.xls'
    print(f"[*] RAPID Ingestion on {f} (APPEND MODE)...")
    
    df = pd.read_excel(f, engine='xlrd', header=None)
    total = 0
    
    for idx, row in df.iterrows():
        # 보험료 추출
        prems = []
        for v in row:
            try:
                s = str(v).replace(',', '').split('.')[0]
                if s.isdigit() and 20000 < int(s) < 150000:
                    prems.append(int(s))
            except: continue
        
        if len(prems) >= 2:
            row_str = " ".join([str(v) for v in row.tolist()])
            comp = "삼성화재" if any(k in row_str for k in ['Ｚ', '삼성', 'EZ']) else "메리츠화재" if any(k in row_str for k in ['޸', '메리츠']) else "기타손보"
            if comp == "기타손보" and not any(k in row_str for k in ['하나', 'DB', 'KB', '현대']): continue
            elif '하나' in row_str: comp = "하나손보"
            elif 'DB' in row_str: comp = "DB손보"

            data = {
                "company_name": comp,
                "product_name": str(row[2]).replace('nan', '').strip(),
                "rates": { f"premium_M_{a}": int(prems[0]) for a in [30,40,50,60,70,80] },
                "category": "건강보험",
                "review_type": "간편심사"
            }
            
            try:
                res = requests.post(f"{URL}/rest/v1/insurance_yu_byung_ja", headers=headers, json=data, timeout=5)
                if res.status_code in [200, 201, 204]:
                    total += 1
                    print(f"  [OK] #{total} {comp} - {data['product_name'][:15]}... ({prems[0]})")
            except: pass
            
    print(f"[*] RAPID DONE: {total} products.")

if __name__ == "__main__":
    fast_ingest_no_delete()
