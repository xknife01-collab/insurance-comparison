"""
나머지 39개 HTML 형식 파일 전용 - 유병자 종합 보장형(4만원+) 전수 조사 스크립트
- 지정된 25개 이외의 모든 파일 스캔
- HTML 파싱 및 35,000원 ~ 95,000원 필터 적용
"""
import pandas as pd
import os
import re
import io
import glob

RAW_DIR = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data"

# 이미 스캔한 25개 제외 (나머지 31~39개 타격)
EXCLUDED = [f"file_{n}.xls" for n in [47, 46, 40, 41, 48, 32, 31, 30, 38, 43, 45, 11, 12, 21, 22, 13, 23, 15, 25, 18, 28, 19, 29, 33, 34]]

CORE_KWS = ['간편심사', '간편고지', '유병자', '유병장수', '355', '3.5.5', '325', '3.2.5', '통합간편', '간편건강']
JUNK = ['치아', '펫', '반려', '어린이', '자녀', '운전자', '자동차', '재물', '저축', '연금', '변액', '종신', '태아']

def read_html_force(f_path):
    try:
        with open(f_path, 'rb') as f: raw = f.read()
        for enc in ['utf-8', 'euc-kr', 'cp949']:
            try:
                content = raw.decode(enc)
                if '<table' in content.lower():
                    tables = pd.read_html(io.StringIO(content))
                    return pd.concat(tables, ignore_index=True), 'html'
                else:
                    return None, 'no_table'
            except: continue
    except: pass
    return None, 'fail'

def hunter_final():
    all_files = sorted(glob.glob(os.path.join(RAW_DIR, "*.xls")))
    target_files = [f for f in all_files if os.path.basename(f) not in EXCLUDED]
    
    print(f"\n{'='*80}")
    print(f"【나머지 {len(target_files)}개 HTML 형식 파일 대상 - 진짜 4만원대 전수 조사】")
    print(f"{'='*80}")
    
    results = []
    
    for f_path in target_files:
        fname = os.path.basename(f_path)
        if os.path.getsize(f_path) < 3000: continue
        
        df, method = read_html_force(f_path)
        if df is None: continue
        
        file_hits = 0
        for idx, row in df.iterrows():
            row_vals = [str(v) for v in row.tolist()]
            row_str = " ".join(row_vals)
            
            if not any(kw in row_str for kw in CORE_KWS): continue
            if any(jk in row_str for jk in JUNK): continue
            
            # 35,000원 ~ 100,000원 사이의 보험료 필터
            ps = [int(re.sub(r'[^0-9]', '', str(v).split('.')[0])) for v in row if re.sub(r'[^0-9]', '', str(v).split('.')[0]) and 35000 <= int(re.sub(r'[^0-9]', '', str(v).split('.')[0])) <= 100000]
            if not ps: continue
            
            p_name = max([v for v in row_vals if len(v) > 5 and any('\uAC00' <= char <= '\uD7A3' for char in v)], key=len, default='유병자 종합보험')
            
            carrier = '기타'
            for kw, cn in [('삼성', '삼성'), ('메리츠', '메리츠'), ('현대', '현대'), ('DB', 'DB손보'), ('KB', 'KB손보'), ('한화', '한화'), ('흥국', '흥국')]:
                if kw in row_str:
                    carrier = cn; break
            
            results.append({'carrier': carrier, 'name': p_name[:50], 'prem': ps[0], 'file': fname})
            file_hits += 1
            
        if file_hits > 0:
            print(f"[*] {fname}: {file_hits}건 발견")

    print(f"\n{'-'*80}")
    print(f"{'No':<4} {'보험사':<8} {'보험료':<10} {'상품명 (나머지)'}")
    print(f"{'-'*80}")
    
    unique_list = sorted([dict(t) for t in {tuple(d.items()) for d in results}], key=lambda x: x['prem'])
    for i, r in enumerate(unique_list[:30]):
        print(f"{i+1:<4} {r['carrier']:<8} {r['prem']:,}원 {r['name']:<40} ({r['file']})")

    print(f"\n{'='*80}")
    print(f"조사 완료: 나머지 39개 파일에서 총 {len(unique_list)}개의 '진짜 4만원대' 종합 유병자 상품을 추가 발굴했습니다.")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    hunter_final()
