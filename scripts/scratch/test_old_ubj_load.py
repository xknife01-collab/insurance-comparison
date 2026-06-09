# -*- coding: utf-8 -*-
import pandas as pd
import glob
import os
import re
import io
import requests

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

UBJ_KW = [
    '간편심사', '간편고지', '건강고지', '유병자',
    '3.5.5', '3.0.5', '3.1.0', '3.2.5', '3.4.5', '3.3.5', '3.1.5', '3.10.5',
    '355', '305', '310', '325', '345', '335', '315', '3N5',
    '유병장수', '올바른', '참좋은', '더간편', '하나더퍼스트',
    '고당플러스', '내삶엔', '간편한', 'Only You',
    '간편건강', '간편종합', '간편보험', '무고지', '무심사',
    'Hi2601', 'Hi26', '2601', '2603', '2602',
]

JUNK = ['치아', '펫', '반려', '어린이', '자녀', '운전자', '자동차',
        '재물', '저축', '연금', '변액', '종신', '화재보험', '상해보험', '태아']

LIFE_MAP = [
    ('삼성생명', ['삼성생명']),
    ('한화생명', ['한화생명']),
    ('신한라이프', ['신한라이프', '신한생명']),
    ('교보생명', ['교보생명']),
    ('동양생명', ['동양생명']),
    ('흥국생명', ['흥국생명']),
    ('ABL생명', ['ABL생명', 'ABL']),
    ('라이나생명', ['라이나생명', '라이나']),
    ('카디프생명', ['카디프']),
    ('DB생명', ['DB생명']),
    ('하나생명', ['하나생명']),
    ('미래에셋생명', ['미래에셋생명', '미래에셋']),
]
NONLIFE_MAP = [
    ('삼성화재', ['삼성화재']),
    ('메리츠화재', ['메리츠화재', '메리츠']),
    ('현대해상', ['현대해상']),
    ('DB손보', ['DB손보', 'DB손해']),
    ('KB손보', ['KB손보', 'KB손해']),
    ('한화손보', ['한화손보', '한화손해']),
    ('하나손보', ['하나손보']),
    ('흥국화재', ['흥국화재']),
    ('롯데손보', ['롯데손보', '롯데손해']),
    ('MG손보', ['MG손보']),
]

def is_premium(v):
    try:
        s = re.sub(r'[^0-9]', '', str(v).split('.')[0])
        if s and 15000 <= int(s) <= 200000:
            return int(s)
    except:
        pass
    return None

def classify_carrier(row_str):
    for name, kws in LIFE_MAP:
        if any(kw in row_str for kw in kws):
            return name, 'LIFE'
    for name, kws in NONLIFE_MAP:
        if any(kw in row_str for kw in kws):
            return name, 'NON-LIFE'
    return '기타보험사', 'UNKNOWN'

def read_file(f_path):
    try:
        return pd.read_excel(f_path, engine='xlrd', header=None), 'xlrd'
    except:
        pass
    try:
        with open(f_path, 'rb') as f:
            raw = f.read()
        content = None
        for enc in ['utf-8', 'euc-kr', 'cp949']:
            try:
                content = raw.decode(enc); break
            except:
                pass
        if content is None:
            content = raw.decode('utf-8', errors='ignore')
        tables = pd.read_html(io.StringIO(content))
        if tables:
            return pd.concat(tables, ignore_index=True), 'html'
    except:
        pass
    return None, 'fail'

def extract_rows(df):
    hits = []
    for idx, row in df.iterrows():
        row_vals = [str(v) for v in row.tolist()]
        row_str = " ".join(row_vals)

        if any(jk in row_str for jk in JUNK):
            continue
        if not any(kw in row_str for kw in UBJ_KW):
            continue

        prems = [is_premium(v) for v in row if is_premium(v)]
        if len(prems) < 2:
            continue

        carrier, ins_type = classify_carrier(row_str)

        p_name = max(
            [v for v in row_vals if len(v) > 3 and any('\uAC00' <= c <= '\uD7A3' for c in v)],
            key=len, default='유병자 간편건강보험'
        )
        p_name = p_name[:80]

        hits.append({
            'carrier': carrier,
            'ins_type': ins_type,
            'product': p_name,
            'prems': prems,
        })
    return hits

def test_load():
    total = 0
    out_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\old_ubj_results.txt"
    with open(out_path, "w", encoding="utf-8") as out:
        out.write("[*] TEST: 이전 load_ubj.py 방식으로 추출 결과 상위 50개 기록\n")
        for fname in TARGET_FILES:
            f_path = os.path.join(RAW_DIR, fname)
            if not os.path.exists(f_path):
                continue
            df, method = read_file(f_path)
            if df is None:
                continue
            rows = extract_rows(df)
            if not rows:
                continue
            for r in rows:
                prems = r['prems']
                m_prem = prems[0]
                f_prem = prems[1] if len(prems) > 1 else int(m_prem * 0.85)
                line = f"[{r['carrier']}] {r['product']} | 남: {m_prem:,}원, 여: {f_prem:,}원 (파일: {fname})\n"
                out.write(line)
                total += 1
                if total >= 50:
                    print(f"[*] Done writing {total} results to {out_path}")
                    return
        print(f"[*] Done writing {total} results to {out_path}")

if __name__ == "__main__":
    test_load()
