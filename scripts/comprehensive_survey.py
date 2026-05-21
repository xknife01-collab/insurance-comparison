"""
사용자 지정 25개 파일 대상 - 유병자 종합 보장형(40대 4만원+) 전수 조사 스크립트
- 지정된 파일만 스캔 (file_47, 46, 40, 41, 48, 32, 31, 30, 38, 43, 45, 11, 12, 21, 22, 13, 23, 15, 25, 18, 28, 19, 29, 33, 34)
"""
import pandas as pd
import os
import re
import io
import glob

RAW_DIR = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data"

# 사용자 지정 25개 파일
TARGET_FILES = [
    "file_47.xls", "file_46.xls", "file_40.xls", "file_41.xls",
    "file_48.xls", "file_32.xls", "file_31.xls", "file_30.xls",
    "file_38.xls", "file_43.xls", "file_45.xls",
    "file_11.xls", "file_12.xls", "file_21.xls", "file_22.xls",
    "file_13.xls", "file_23.xls", "file_15.xls", "file_25.xls",
    "file_18.xls", "file_28.xls", "file_19.xls", "file_29.xls",
    "file_33.xls", "file_34.xls",
]

# 유병자 종합형 핵심 키워드
CORE_KWS = ['간편심사', '간편고지', '유병자', '유병장수', '355', '3.5.5', '325', '3.2.5', '통합간편', '간편건강']
NON_COMP = ['실손', '의료비', '치아', '펫', '운전자', '자동차', '어린이', '자녀', '정기']

def read_file(f_path):
    try:
        return pd.read_excel(f_path, engine='xlrd', header=None), 'xlrd'
    except:
        try:
            with open(f_path, 'rb') as f: raw = f.read()
            c = raw.decode('euc-kr', errors='ignore')
            ts = pd.read_html(io.StringIO(c))
            return pd.concat(ts, ignore_index=True), 'html'
        except: return None, 'fail'

def survey_comprehensive():
    print(f"\n{'='*80}")
    print(f"【지정 25개 파일 대상 - 유병자 종합형(4만원+) 전수 조사 리포트】")
    print(f"{'='*80}")
    
    results = []
    
    for fname in TARGET_FILES:
        f_path = os.path.join(RAW_DIR, fname)
        if not os.path.exists(f_path): continue
        
        df, method = read_file(f_path)
        if df is None: continue
        
        file_hits = 0
        for idx, row in df.iterrows():
            row_vals = [str(v) for v in row.tolist()]
            row_str = " ".join(row_vals)
            
            # 1. 유병자 종합형 키워드 체크
            if not any(kw in row_str for kw in CORE_KWS): continue
            
            # 2. 비종합형 제외
            if any(jk in row_str for jk in NON_COMP): continue
            
            # 3. 40대 종합 보험료 프리미엄 (35,000 ~ 90,000원 사이) 타격
            ps = [int(re.sub(r'[^0-9]', '', str(v).split('.')[0])) for v in row if re.sub(r'[^0-9]', '', str(v).split('.')[0]) and 35000 <= int(re.sub(r'[^0-9]', '', str(v).split('.')[0])) <= 95000]
            if not ps: continue
            
            # 4. 상품명 추출
            p_name = max([v for v in row_vals if len(v) > 5 and any('\uAC00' <= char <= '\uD7A3' for char in v)], key=len, default='유병자 종합보험')
            
            # 5. 보험사 판별
            carrier = '기타'
            if '메리츠' in row_str: carrier = '메리츠'
            elif '삼성' in row_str: carrier = '삼성'
            elif '현대' in row_str: carrier = '현대'
            elif 'DB' in row_str: carrier = 'DB손보'
            elif 'KB' in row_str: carrier = 'KB손보'
            elif '한화' in row_str: carrier = '한화'
            elif '흥국' in row_str: carrier = '흥국'
            
            results.append({
                'carrier': carrier,
                'name': p_name[:50],
                'prem': f"{ps[0]:,}원",
                'file': fname
            })
            file_hits += 1
            
        if file_hits > 0:
            print(f"[*] {fname} ({method}): {file_hits}건 발견")

    print(f"\n{'-'*80}")
    print(f"{'No':<4} {'보험사':<8} {'상품명':<45} {'보험료':<10} {'파일명'}")
    print(f"{'-'*80}")
    
    # 중복 제거 및 출력
    unique_list = []
    seen = set()
    for r in results:
        key = (r['carrier'], r['name'], r['prem'])
        if key not in seen:
            seen.add(key)
            unique_list.append(r)
            
    for i, r in enumerate(sorted(unique_list, key=lambda x: x['prem'])):
        print(f"{i+1:<4} {r['carrier']:<8} {r['name']:<45} {r['prem']:<10} {r['file']}")
        if i >= 49: break # 너무 많으면 상위 50개만

    print(f"\n{'='*80}")
    print(f"조사 완료: 총 {len(unique_list)}개의 '진짜 4만원대' 종합 유병자 상품을 지정 25개 파일에서 색출했습니다.")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    survey_comprehensive()
