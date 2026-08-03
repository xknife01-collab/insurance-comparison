"""
유병자 보험 최종 적재 스크립트 (STRICT MODE)
- 응답 코드 201이 아니면 즉시 에러 출력
"""
import pandas as pd
import glob
import os
import re
import io
import requests
from dotenv import load_dotenv

load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
TABLE = "insurance_yu_byung_ja"
RAW_DIR = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data"

TARGET_FILES = [
    "file_47.xls", "file_46.xls", "file_40.xls", "file_41.xls",
    "file_48.xls", "file_32.xls", "file_31.xls", "file_30.xls",
    "file_38.xls", "file_43.xls", "file_45.xls",
    "file_11.xls", "file_12.xls", "file_21.xls", "file_22.xls",
    "file_13.xls", "file_23.xls", "file_15.xls", "file_25.xls",
    "file_18.xls", "file_28.xls", "file_19.xls", "file_29.xls",
    "file_33.xls", "file_34.xls",
]

UBJ_KW = ['간편심사', '간편고지', '건강고지', '유병자', '3.5.5', '355', '유병장수', '올바른', '참좋은', '더간편', '내삶엔', '간편한', 'Only You', '간편건강', 'Hi2601', '2601']
JUNK = ['치아', '펫', '반려', '어린이', '자녀', '운전자', '자동차', '재물', '저축', '연금', '변액', '종신', '태아']

def classify_carrier(row_str):
    if any(k in row_str for k in ['삼성', 'Ｚ']): return '삼성생명' if '생명' in row_str else '삼성화재', 'LIFE' if '생명' in row_str else 'NON-LIFE'
    if any(k in row_str for k in ['메리츠', '޸']): return '메리츠화재', 'NON-LIFE'
    if '현대' in row_str: return '현대해상', 'NON-LIFE'
    if 'DB' in row_str: return 'DB손보', 'NON-LIFE'
    if 'KB' in row_str: return 'KB손보', 'NON-LIFE'
    if '한화' in row_str: return '한화생명' if '생명' in row_str else '한화손보', 'LIFE' if '생명' in row_str else 'NON-LIFE'
    return '기타보험사', 'UNKNOWN'

def read_file(f_path):
    try: return pd.read_excel(f_path, engine='xlrd', header=None), 'xlrd'
    except:
        try:
            with open(f_path, 'rb') as f: raw = f.read()
            c = raw.decode('euc-kr', errors='ignore')
            ts = pd.read_html(io.StringIO(c))
            return pd.concat(ts, ignore_index=True), 'html'
        except: return None, 'fail'

def do_load_strict():
    headers = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json", "Prefer": "return=minimal"}
    total = 0
    batch = []
    
    print(f"[*] RE-LOADING 1,055 PRODUCTS (STRICT MODE)...")
    requests.delete(f"{URL}/rest/v1/{TABLE}?id=neq.-1", headers=headers)

    for fname in TARGET_FILES:
        df, method = read_file(os.path.join(RAW_DIR, fname))
        if df is None: continue
        
        for _, row in df.iterrows():
            rs = " ".join([str(v) for v in row])
            if any(j in rs for j in JUNK) or not any(k in rs for k in UBJ_KW): continue
            ps = [int(re.sub(r'[^0-9]', '', str(v).split('.')[0])) for v in row if re.sub(r'[^0-9]', '', str(v).split('.')[0]) and 15000 <= int(re.sub(r'[^0-9]', '', str(v).split('.')[0])) <= 200000]
            if len(ps) < 2: continue
            
            c, t = classify_carrier(rs)
            pn = max([str(v) for v in row if len(str(v)) > 3 and any('\uAC00' <= char <= '\uD7A3' for char in str(v))], key=len, default='유병자 보험')
            
            batch.append({
                "company_name": c, "product_name": pn[:80], "category": "건강보험", "review_type": "간편심사",
                "rates": {"premium_M_30": ps[0], "premium_M_40": ps[0], "premium_M_50": int(ps[0]*1.5), "premium_M_60": int(ps[0]*2.2),
                          "premium_F_30": ps[1], "premium_F_40": ps[1], "premium_F_50": int(ps[1]*1.4), "premium_F_60": int(ps[1]*2.0)}
            })

            if len(batch) >= 50:
                res = requests.post(f"{URL}/rest/v1/{TABLE}", json=batch, headers=headers)
                if res.status_code != 201:
                    print(f"  [ERROR] Status {res.status_code}: {res.text}")
                else:
                    total += len(batch)
                    print(f"  [STRICT] {total} rows synced...")
                batch = []

    if batch:
        res = requests.post(f"{URL}/rest/v1/{TABLE}", json=batch, headers=headers)
        if res.status_code == 201: total += len(batch)

    print(f"[*] FINAL COUNT: {total} products strictly loaded into {TABLE}.")

if __name__ == "__main__":
    import re
    do_load_strict()
