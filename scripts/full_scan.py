"""
전수 스캔 v3: 더 넓은 기준으로 유병자 보험 탐색
- 보험료 숫자가 있는 모든 행의 키워드를 수집해서 패턴 파악
- 놓친 파일 없는지 확인
"""
import pandas as pd
import glob
import os
import re
import io
from collections import Counter

RAW_DIR = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data"

# 유병자 관련 키워드 - 넓게 탐색
UBJ_WIDE = [
    # 유병자 심사 등급 (핵심)
    '간편심사', '간편고지', '건강고지', '유병자',
    '3.5.5', '3.0.5', '3.1.0', '3.2.5', '3.4.5', '3.3.5', '3.1.5', '3.10.5',
    '355', '305', '310', '325', '345', '335', '315', '3N5',
    # 실제 보험사 브랜드명 (웹 조사 결과)
    '유병장수',        # 삼성화재
    '올바른',          # 메리츠화재
    '참좋은',          # DB손보
    '더간편',          # 한화
    '하나더퍼스트',    # 하나손보
    '고당플러스',      # 흥국생명
    '내삶엔',          # 현대해상
    '간편한',          # 현대해상
    'Only You',        # 메리츠
    '올바른간편',
    # 상품 형태 키워드
    '간편건강', '간편종합', '간편보험',
    '무고지', '무심사',
    # 상품코드 패턴
    'Hi2601', 'Hi26', '2601', '2603', '2602',
]

# 제거 키워드 (치아/펫/자녀 등)
JUNK = ['치아', '펫', '반려', '어린이', '자녀', '운전자', '자동차',
        '재물', '저축', '연금', '변액', '종신', '화재보험', '상해보험',
        '태아', '신생아']

# 생명보험사
LIFE_KW = ['삼성생명', '한화생명', '신한라이프', '교보생명', '동양생명',
           '흥국생명', '미래에셋', 'ABL생명', 'DB생명', 'KDB생명',
           '메트라이프', '푸본현대생명', '라이나생명', '하나생명',
           '처브라이프', '카디프', '교보', '신한', '동양']

# 손해보험사
NONLIFE_KW = ['삼성화재', '메리츠화재', '현대해상', 'DB손보', 'KB손보',
              '하나손보', '한화손보', '롯데손보', '흥국화재', 'MG손보',
              '캐롯', '카카오손보', '현대해상']

def is_premium(v):
    try:
        s = re.sub(r'[^0-9]', '', str(v).split('.')[0])
        if s and 15000 <= int(s) <= 200000:
            return int(s)
    except:
        pass
    return None

def classify_carrier(row_str):
    for kw in LIFE_KW:
        if kw in row_str:
            return 'LIFE', kw
    for kw in NONLIFE_KW:
        if kw in row_str:
            return 'NON-LIFE', kw
    return 'UNKNOWN', ''

def read_file(f_path):
    """xlrd 먼저, 실패시 HTML"""
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
                content = raw.decode(enc)
                break
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

def scan_deep():
    all_files = sorted(glob.glob(os.path.join(RAW_DIR, "*.xls")))
    print(f"총 {len(all_files)}개 파일 심층 스캔...\n")

    results = []
    zero_files = []  # 아무것도 못 찾은 파일

    for f_path in all_files:
        f_name = os.path.basename(f_path)
        if os.path.getsize(f_path) < 3000:
            continue

        df, method = read_file(f_path)
        if df is None:
            print(f"  [FAIL] {f_name}")
            continue

        hits = []
        for idx, row in df.iterrows():
            row_vals = [str(v) for v in row.tolist()]
            row_str = " ".join(row_vals)

            # 잡동사니 완전 제거
            if any(jk in row_str for jk in JUNK):
                continue

            # 보험료 숫자 확인
            prems = [is_premium(v) for v in row if is_premium(v)]
            if len(prems) < 2:
                continue

            # 넓은 유병자 키워드 탐색
            matched_kws = [kw for kw in UBJ_WIDE if kw in row_str]
            if not matched_kws:
                continue

            ins_type, carrier = classify_carrier(row_str)

            # 상품명 추출
            p_name = max(
                [v for v in row_vals if len(v) > 3 and any('\uAC00' <= c <= '\uD7A3' for c in v)],
                key=len, default=''
            )

            hits.append({
                'row': idx, 'type': ins_type, 'carrier': carrier,
                'product': p_name[:50], 'prems': prems[:4],
                'keywords': matched_kws[:3]
            })

        if hits:
            results.append((f_name, method, hits))
        else:
            zero_files.append((f_name, method))

    # 정렬 출력
    print("=" * 70)
    print("【심층 유병자 보험 위치 리포트】")
    print("=" * 70)

    life_files, nonlife_files = [], []

    for f_name, method, hits in sorted(results, key=lambda x: -len(x[2])):
        life_cnt = sum(1 for h in hits if h['type'] == 'LIFE')
        nonlife_cnt = sum(1 for h in hits if h['type'] == 'NON-LIFE')
        unk_cnt = sum(1 for h in hits if h['type'] == 'UNKNOWN')

        tag = "★GOLD★  " if len(hits) > 50 else ("◆SILVER◆" if len(hits) > 15 else "▷BRONZE◁")
        print(f"\n{tag} [{f_name}]({method}) {len(hits)}건 | 생보:{life_cnt} 손보:{nonlife_cnt} 미분류:{unk_cnt}")

        for h in hits[:5]:
            print(f"  Row{h['row']:4d} [{h['type']:8s}|{h['carrier']:12s}] {h['product'][:38]:<38} prems:{h['prems']} kw:{h['keywords']}")

        if life_cnt > 0: life_files.append(f_name)
        if nonlife_cnt > 0: nonlife_files.append(f_name)

    print("\n" + "=" * 70)
    print("【데이터 없는 파일 (건강보험 관련 없음)】")
    for f_name, method in zero_files:
        print(f"  {f_name} ({method})")

    print("\n" + "=" * 70)
    print("【최종 SUMMARY】")
    print(f"  생명보험 파일 ({len(life_files)}): {life_files}")
    print(f"  손해보험 파일 ({len(nonlife_files)}): {nonlife_files}")
    print(f"  유효 파일 합계: {len(results)}개")
    print("=" * 70)

if __name__ == "__main__":
    scan_deep()
