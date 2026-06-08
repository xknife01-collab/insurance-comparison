import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import pandas as pd
import io
import os
import re
from dotenv import load_dotenv
from supabase import create_client

# ─────────────────────────────────────────────
# 설정
# ─────────────────────────────────────────────
BASE_DIR = r'c:\Users\zkfnt\Desktop\insurance-comparison-main'  # XLS 파일이 들어오는 폴더

load_dotenv('.env')
load_dotenv('.env.local')
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

EXCLUDE_KEYWORDS = ['유병력자', '유병자', '반려견', '반려묘', '펫', '동물', '강아지', '고양이']


# ─────────────────────────────────────────────
# 유틸
# ─────────────────────────────────────────────
def clean_num(val):
    if not val: return 0
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    try:
        m = re.search(r'\d+', s)
        return int(m.group()) if m else 0
    except:
        return 0


def clean_val(v):
    if pd.isna(v): return ''
    return str(v).replace('\n', ' ').strip()


def clean_company(comp):
    comp = comp.strip()
    comp = comp.replace('해상보험', '').replace('손해보험', '손보').replace('생명보험', '생명').strip()
    if '메리츠' in comp:    return '메리츠화재'
    if '롯데' in comp:      return '롯데손보'
    if 'KB' in comp:        return 'KB손보'
    if 'DB' in comp:        return 'DB손보'
    if '흥국' in comp:      return '흥국화재'
    if 'MG' in comp:        return 'MG손보'
    if '한화' in comp:      return '한화손보'
    if '농협' in comp or 'NH' in comp: return 'NH농협손보'
    if '현대해상' in comp:  return '현대해상'
    if '삼성화재' in comp:  return '삼성화재'
    return comp


def clean_product_name(name):
    n = name
    for pat in [r'\(무배당\)', r'\(무\)', r'\[무배당\]', r'\[무\]',
                r'\(갱신형\)', r'갱신형', r'\(무,갱\)', r'\(무/갱\)', r'\(보장성\)']:
        n = re.sub(pat, '', n)
    n = re.sub(r'\d{4}\.\d+', '', n)
    n = re.sub(r'\d{2}\.\d{2}', '', n)
    n = re.sub(r'\d{4}', '', n)
    n = n.replace('()', '').replace('[]', '').replace('【】', '')
    n = re.sub(r'^\s*무배당\s*', '', n)
    n = re.sub(r'^\s*무\s*', '', n)
    n = re.sub(r'\s+', ' ', n).strip().strip('-_ ')
    return n


def get_category(prod_name, raw_prod):
    combined = prod_name + raw_prod
    if '노후' in combined:
        return '노후_의료실비'
    if ('5세대' in combined or '2605' in combined or '26.05' in combined):
        return '5세대_의료실비'
    return '실속_의료실비'


def make_prod_code(comp, prod, category):
    code = f"{comp}_{prod}"[:48]
    code = re.sub(r'[^a-zA-Z0-9가-힣\_]', '_', code)
    if category == '5세대_의료실비':
        code = f"{code}_v5"[:48]
    return code


def get_sort_key(c):
    m = re.search(r'\d{8,}', c['source_file'])
    timestamp = int(m.group()) if m else 0
    has_premium = 1 if (c['m_total'] > 0 and c['f_total'] > 0) else 0
    return (has_premium, timestamp, len(c['coverages']))


# ─────────────────────────────────────────────
# 핵심: XLS 파일 하나를 파싱
# 공시자료 컬럼 구조:
#   col1=회사명, col2=상품명, col3=담보명,
#   col4=지급사유, col5=지급금액,
#   col6=남자 보험료, col7=여자 보험료,
#   col8=남자 가격지수(%), col9=여자 가격지수(%)
# ─────────────────────────────────────────────
def parse_xls(filepath, source_file):
    df = None
    try:
        df = pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception:
        raw = open(filepath, 'rb').read()
        for enc in ['cp949', 'euc-kr', 'utf-8']:
            try:
                text = raw.decode(enc)
                if '<table' in text.lower():
                    frames = pd.read_html(io.StringIO(text), flavor='bs4')
                    if frames:
                        df = frames[0]
                        break
            except Exception:
                continue

    if df is None:
        print(f"  [SKIP] 읽기 실패: {source_file}")
        return {}

    # ── 헤더 행 탐색: '남자'와 '여자'가 함께 있는 행 찾기
    header_row_idx = -1
    m_col = f_col = comp_col = prod_col = -1

    for i in range(min(20, len(df))):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        male_cols   = [j for j, v in enumerate(row) if v.strip() == '남자' or v.strip() == '남자 ']
        female_cols = [j for j, v in enumerate(row) if v.strip() == '여자' or v.strip() == '여자 ']
        if male_cols and female_cols:
            header_row_idx = i
            m_col = male_cols[0]
            f_col = female_cols[0]
            break

    if header_row_idx == -1 or m_col == -1:
        print(f"  [SKIP] 헤더 인식 실패: {source_file}")
        return {}

    # 회사명/상품명 컬럼: 헤더 바로 위 행에서 '회사명' 찾기
    if header_row_idx > 0:
        prev = [clean_val(v) for v in df.iloc[header_row_idx - 1].tolist()]
        for j, v in enumerate(prev):
            if '회사명' in v or '보험회사' in v:
                comp_col = j
            elif '상품명' in v:
                prod_col = j

    # 기본값 (공시 엑셀 표준 위치)
    if comp_col == -1: comp_col = 1
    if prod_col == -1: prod_col = 2

    # ── 데이터 행 순회
    groups = {}
    cur_company = ''
    cur_product = ''

    for i in range(header_row_idx + 1, len(df)):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        if not any(row):
            continue

        # 회사명/상품명 carry-forward (병합셀 처리)
        if comp_col < len(row) and row[comp_col]:
            cur_company = row[comp_col]
        if prod_col < len(row) and row[prod_col]:
            cur_product = row[prod_col]

        if not cur_company or not cur_product:
            continue

        # 제외 키워드 체크
        combined_text = cur_company + cur_product + ' '.join(row)
        if any(k in combined_text for k in EXCLUDE_KEYWORDS):
            continue

        # 보험료 읽기
        m_prem = clean_num(row[m_col]) if m_col < len(row) else 0
        f_prem = clean_num(row[f_col]) if f_col < len(row) else 0

        if m_prem == 0 and f_prem == 0:
            continue

        # 담보명 (m_col 바로 앞 컬럼들에서 첫 번째 non-empty)
        coverage_name = ''
        for j in range(max(comp_col, prod_col) + 1, m_col):
            if j < len(row) and row[j]:
                coverage_name = row[j]
                break

        # 정제
        comp = clean_company(cur_company)
        prod_raw = cur_product
        prod = clean_product_name(prod_raw)
        category = get_category(prod, prod_raw)
        prod_code = make_prod_code(comp, prod, category)
        display_name = f"{prod} (5세대)" if category == '5세대_의료실비' else prod

        key = (prod_code, source_file)
        if key not in groups:
            groups[key] = {
                'product_code': prod_code,
                'company_name': comp,
                'display_name': display_name,
                'category': category,
                'm_total': 0,
                'f_total': 0,
                'coverages': [],
                'source_file': source_file
            }

        groups[key]['m_total'] += m_prem
        groups[key]['f_total'] += f_prem
        groups[key]['coverages'].append({
            'name': coverage_name,
            'm_prem': m_prem,
            'f_prem': f_prem
        })

    return groups


# ─────────────────────────────────────────────
# 메인 파이프라인
# ─────────────────────────────────────────────
def run_pipeline():
    print("=" * 60)
    print("[실손보험 자동 파이프라인] 시작")
    print("=" * 60)

    # 1. 지정 폴더에서 실손 관련 XLS 파일 탐색
    xls_files = [
        f for f in os.listdir(BASE_DIR)
        if f.endswith('.xls') and '실손' in f
    ]
    if not xls_files:
        print(f"[!] '{BASE_DIR}' 폴더에 실손 XLS 파일이 없습니다.")
        return

    print(f"[*] 발견된 XLS 파일 {len(xls_files)}개:")
    for f in xls_files:
        print(f"    - {f}")

    # 2. 전체 XLS 파싱 및 그룹화
    all_groups = {}
    for fname in xls_files:
        fpath = os.path.join(BASE_DIR, fname)
        print(f"\n[*] 파싱 중: {fname}")
        groups = parse_xls(fpath, fname)
        print(f"    → {len(groups)}개 (상품×파일) 그룹 추출")
        all_groups.update(groups)

    # 3. 상품별 최적 파일 선택 (중복 제거)
    unique_products = {}
    for (prod_code, source_file), g in all_groups.items():
        unique_products.setdefault(prod_code, []).append(g)

    products = {}
    for prod_code, candidates in unique_products.items():
        candidates.sort(key=get_sort_key, reverse=True)
        best = candidates[0]
        products[prod_code] = best

    print(f"\n[*] 중복 제거 후 최종 상품 수: {len(products)}개")

    # 4. 검증 출력 (사용자가 터미널에서 확인 가능)
    print("\n[*] 적재 예정 보험료 목록 (40세 기준):")
    print(f"{'회사':<12} {'카테고리':<16} {'상품명':<35} {'남자':>8} {'여자':>8} {'출처파일'}")
    print("-" * 110)
    for code, p in sorted(products.items(), key=lambda x: x[1]['category']):
        if p['m_total'] < 100:
            continue
        print(f"{p['company_name']:<12} {p['category']:<16} {p['display_name'][:33]:<35} "
              f"{p['m_total']:>8,} {p['f_total']:>8,}  {p['source_file'][:40]}")

    # 5. Supabase 적재
    print("\n[*] Supabase 기존 데이터 삭제 중...")
    supabase.table('medical_silson_rates').delete().neq('product_code', 'NONE').execute()
    supabase.table('medical_silson_products').delete().neq('product_code', 'NONE').execute()

    prod_inserts = []
    rate_inserts = []

    for code, p in products.items():
        if p['m_total'] < 100 and p['f_total'] < 100:
            continue

        prod_inserts.append({
            'product_code': p['product_code'],
            'company_name': p['company_name'],
            'display_name': p['display_name'],
            'category': p['category']
        })
        rate_inserts.append({
            'product_code': p['product_code'],
            'gender': 'M',
            'age': 40,
            'rate_data': {'premium': p['m_total'], 'coverages': p['coverages']}
        })
        rate_inserts.append({
            'product_code': p['product_code'],
            'gender': 'F',
            'age': 40,
            'rate_data': {'premium': p['f_total'], 'coverages': p['coverages']}
        })

    if prod_inserts:
        for i in range(0, len(prod_inserts), 100):
            supabase.table('medical_silson_products').insert(prod_inserts[i:i+100]).execute()

    if rate_inserts:
        for i in range(0, len(rate_inserts), 100):
            supabase.table('medical_silson_rates').insert(rate_inserts[i:i+100]).execute()

    print(f"\n[완료] 상품 {len(prod_inserts)}개 / 요율 {len(rate_inserts)}건 적재 완료")
    print("=" * 60)


if __name__ == "__main__":
    run_pipeline()
