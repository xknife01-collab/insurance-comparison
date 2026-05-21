import pandas as pd
import glob
import os
import requests
import re
from dotenv import load_dotenv

load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def extract_digit(v):
    s = re.sub(r'[^0-9]', '', str(v).split('.')[0])
    # 25,000 ~ 250,000 사이의 우량 건강보험 팩트만 엄선
    if s and 25000 < int(s) < 250000: return int(s)
    return None

def ultimate_full_carrier_load():
    headers = { "apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json", "Prefer": "return=minimal" }
    session = requests.Session()
    session.headers.update(headers)
    
    TABLE = "insurance_yu_byung_ja"
    
    # 1. DELETE
    print(f"[*] TOTAL RE-SYNC (LIFE + NON-LIFE) in {TABLE}...")
    session.delete(f"{URL}/rest/v1/{TABLE}?id=neq.-1", timeout=30)

    # 2. FILE SCAN
    raw_dir = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data'
    all_files = glob.glob(os.path.join(raw_dir, "*.xls"))
    
    total = 0
    batch = []
    
    # 필터 강화 (어린이, 치아, 상해 등 불량 팩트 제거)
    black_list = ['펫', '반려', '치아', '어린이', '자녀', '아이', '상해', '운전자', '자동차', '화재', '굿앤굿', '스타종합', '자녀플랜']
    health_dna = ['건강', '종합', '간편', '유병', '305', '355', '335', '325', '345', '심사', 'N5', 'հ', ' պ', 'ΰħ', '̷Ʈ', 'ں']

    for f_path in all_files:
        f_name = os.path.basename(f_path)
        try:
            df = pd.read_excel(f_path, engine='xlrd', header=None)
            found_in_file = 0
            for idx, row in df.iterrows():
                row_str = " ".join([str(v) for v in row.tolist()])
                prems = [extract_digit(v) for v in row if extract_digit(v)]
                
                if len(prems) >= 2:
                    p_name = str(row[2]).strip()
                    full_info = row_str + " " + p_name
                    
                    if any(k in full_info for k in black_list): continue
                    if not any(k in full_info for k in health_dna): continue

                    # [최종] 전 보험사(손보+생보) 매핑 로직 (깨진 글자 수렴)
                    comp = "기타보험사"
                    if any(k in row_str for k in ['삼성', 'Ｚ', '\uff3a']): 
                        comp = "삼성생명" if '생명' in row_str else "삼성화재"
                    elif any(k in row_str for k in ['메리츠', '޸', '\u07b8']): comp = "메리츠화재"
                    elif any(k in row_str for k in ['하나', 'ϳ', '\u03f3']): comp = "하나손보"
                    elif any(k in row_str for k in ['한화', 'ȭ', '\u023b']):
                        comp = "한화생명" if '생명' in row_str else "한화손보"
                    elif 'DB' in row_str: comp = "DB손보"
                    elif 'KB' in row_str: comp = "KB손보"
                    elif '현대' in row_str: comp = "현대해상"
                    elif '흥국' in row_str: comp = "흥국화재"
                    elif '롯데' in row_str: comp = "롯데손보"
                    elif '생명' in row_str: comp = "기타생명보험"
                    
                    data = {
                        "company_name": comp, "product_name": p_name,
                        "rates": { f"premium_M_{a}": int(prems[0]) for a in [30,40,50,60,70,80] },
                        "category": "건강보험", "review_type": "간편심사"
                    }
                    data["rates"].update({ f"premium_F_{a}": int(prems[1]) for a in [30,40,50,60,70,80] })
                    batch.append(data)

                    if len(batch) >= 50:
                        session.post(f"{URL}/rest/v1/{TABLE}", json=batch)
                        total += len(batch)
                        found_in_file += len(batch)
                        batch = []
            
            if found_in_file > 0:
                print(f"  [MARKET] {f_name}: {found_in_file} products loaded.")
            
        except: continue

    if batch:
        session.post(f"{URL}/rest/v1/{TABLE}", json=batch)
        total += len(batch)

    print(f"[*] ULTIMATE CONSOLIDATED LOAD COMPLETE: {total} total human (Life + Non-Life) UBJ products.")

if __name__ == "__main__":
    ultimate_full_carrier_load()
