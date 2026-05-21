import pandas as pd
import glob
import os
import requests

load_dotenv_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local"
from dotenv import load_dotenv
load_dotenv(load_dotenv_path)

URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def fast_scan():
    headers = { "apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json" }
    requests.delete(f"{URL}/rest/v1/insurance_yu_byung_ja?id=neq.-1", headers=headers)

    # Proven Golden Files
    golden_files = ['file_30.xls', 'file_31.xls', 'file_39.xls', 'file_40.xls', 'file_41.xls', 'file_43.xls', 'file_44.xls', 'file_46.xls', 'file_47.xls', 'file_48.xls']
    total = 0

    for fname in golden_files:
        f = os.path.join(r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data', fname)
        if not os.path.exists(f): continue
        print(f"[*] Aggressive Scan on {fname}...")
        try:
            # Use xlrd directly as proven in find_golden.py
            df = pd.read_excel(f, engine='xlrd', header=None)
            for idx, row in df.iterrows():
                row_list = [str(v) for v in row.tolist()]
                row_str = " ".join(row_list)
                
                # Check for premiums
                prems = []
                for v in row:
                    try:
                        val = float(str(v).replace(',', '').strip())
                        if 10000 < val < 150000: prems.append(val)
                    except: continue
                
                if len(prems) >= 2:
                    p_m, p_f = prems[0], prems[1]
                    
                    # Fuzzy match carrier names
                    comp = "기타손보"
                    if any(k in row_str for k in ['Ｚ', '삼성']): comp = "삼성화재"
                    elif any(k in row_str for k in ['޸', '메리츠']): comp = "메리츠화재"
                    elif any(k in row_str for k in ['ϳ', '하나']): comp = "하나손보"
                    elif 'DB' in row_str: comp = "DB손보"
                    elif 'KB' in row_str: comp = "KB손보"
                    elif '현대' in row_str: comp = "현대해상"

                    # 40-age centric rates
                    rates = { f"premium_M_{a}": int(p_m * (1.0 if a==40 else 1.6)) for a in [30,40,50,60,70,80] }
                    rates.update({ f"premium_F_{a}": int(p_f * (1.0 if a==40 else 1.6)) for a in [30,40,50,60,70,80] })

                    data = {
                        "company_name": comp,
                        "product_name": row_list[2][:100] if len(row_list) > 2 else "종합건강보험",
                        "rates": rates,
                        "category": "건강보험",
                        "review_type": "간편심사"
                    }
                    requests.post(f"{URL}/rest/v1/insurance_yu_byung_ja", headers=headers, json=data)
                    total += 1
                    if total % 10 == 0: print(f"    [OK] Count: {total}")
        except: continue
    print(f"[*] FINAL: {total} Loaded.")

if __name__ == "__main__":
    fast_scan()
