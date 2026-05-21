import pandas as pd
import os
import re
import io
import json
import xlrd

def clean_num(v):
    if pd.isna(v): return 0
    s = str(v).replace(',', '').replace('원', '').replace('"', '').strip()
    try:
        return int(float(s))
    except:
        return 0

def ingest_file(f):
    results = []
    df = None
    try:
        try:
            df = pd.read_excel(f, engine='xlrd')
        except:
            raw_bytes = open(f, 'rb').read()
            raw_clean = ""
            for enc in ['utf-8', 'cp949', 'euc-kr']:
                try:
                    raw_clean = raw_bytes.decode(enc)
                    if '<table' in raw_clean.lower(): break
                except: continue
            if raw_clean:
                raw_clean = re.sub(r'<p.*?>.*?</p>', '', raw_clean, flags=re.DOTALL)
                frames = pd.read_html(io.StringIO(raw_clean), flavor='bs4')
                if frames: df = frames[0]
        
        if df is None or len(df) < 3: return []
        
        df_comp, df_prod = "알수없음", "알수없음"
        filename = os.path.basename(f)
        
        for i, row in df.iterrows():
            rv = [str(x).strip() for x in row.values]
            if len(rv) < 9: continue
            
            c_val, p_val = rv[1], rv[2]
            is_gen = any(k in str(p_val) for k in ['주계약', '소계', '합계', 'Unnamed', '상품명', 'NaN', 'nan'])
            if len(str(c_val)) > 1 and 'Unnamed' not in str(c_val) and '회사' not in str(c_val):
                df_comp = c_val
            if len(str(p_val)) > 2 and not is_gen:
                df_prod = p_val
            
            # [지능형 무결성 필터] 상속된 상품명과 현재 행 텍스트 모두에서 불하 키워드 검사
            full_context = (df_comp + df_prod + "".join(rv)).replace(" ", "")
            bad_keywords = ['유병', '노후', '간편', '3.0', '3.5', '3.2', '3.3', '고령', '심사', '실버']
            if any(k in full_context for k in bad_keywords):
                continue
                
            if df_prod == "알수없음": continue

            try:
                m_tot = clean_num(rv[7])
                f_tot = clean_num(rv[8])
                if m_tot > 5 or f_tot > 5:
                    results.append({
                        "company": df_comp, "product": df_prod, "age": 40,
                        "m": m_tot, "f": f_tot, "file": filename
                    })
            except: continue
            
        return results
    except Exception as e:
        print(f"[ERR] {os.path.basename(f)}: {e}")
        return []

def main():
    aggregated = {}
    target_files = [
        "scripts/scraper/raw_data/file_32.xls", "scripts/scraper/raw_data/file_34.xls",
        "scripts/scraper/raw_data/file_38.xls", "scripts/scraper/raw_data/file_39.xls",
        "scripts/scraper/raw_data/file_49.xls", "scripts/scraper/raw_data/file_50.xls"
    ]
    for f in target_files:
        if os.path.exists(f):
            rows = ingest_file(f)
            for r in rows:
                key = (r['company'], r['product'], r['age'])
                if key not in aggregated:
                    aggregated[key] = { "company": r['company'], "product": r['product'], "age": r['age'], "m": 0, "f": 0 }
                if r['m'] > aggregated[key]['m']: aggregated[key]['m'] = r['m']
                if r['f'] > aggregated[key]['f']: aggregated[key]['f'] = r['f']

    # [14,000원 무결성 가드]
    final = [v for v in aggregated.values() if v['m'] >= 14000 or v['f'] >= 14000]
    print(f"[*] FINISHED. TOTAL AGGREGATED PRODUCTS: {len(final)}")
    with open("scripts/scraper/extracted_dump.json", "w", encoding="utf-8") as f:
        json.dump(final, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
