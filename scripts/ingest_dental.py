import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import pandas as pd
import io, os, re
from dotenv import load_dotenv
from supabase import create_client

# ─────────────────────────────────────────────
# 설정
# ─────────────────────────────────────────────
XLS_DIR = r'c:\Users\zkfnt\Desktop\insurance-comparison-main'

load_dotenv('.env')
load_dotenv('.env.local')
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

DENTAL_KEYWORDS = ['치아', '덴탈', 'Dental']
EXCLUDE_PRODUCT_KEYWORDS = ['종합', '종신', '건강보험', '건강보장', '암', '상해', '운전자', '화재',
                            '어린이', '자녀', '태아', '영유아']
MAX_MONTHLY_PREMIUM = 99999999  # 필터 없음 - 모든 상품 포함

DENTAL_PRODUCT_TABLE = 'dental_products'
DENTAL_RATE_TABLE = 'dental_rates'


# ─────────────────────────────────────────────
# 유틸
# ─────────────────────────────────────────────
def clean_num(val):
    if not val: return 0
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    try:
        return int(float(s))
    except:
        return 0

def clean_val(v):
    if pd.isna(v): return ''
    return str(v).strip()

def clean_company(comp):
    comp = comp.strip()
    if '메리츠' in comp: return '메리츠화재'
    if '롯데' in comp:   return '롯데손보'
    if 'KB' in comp:     return 'KB손보'
    if 'DB' in comp:     return 'DB손보'
    if '흥국' in comp:   return '흥국화재'
    if '한화' in comp:   return '한화손보'
    if '현대해상' in comp: return '현대해상'
    if '삼성화재' in comp: return '삼성화재'
    if 'NH' in comp or '농협' in comp: return 'NH농협손보'
    if '라이나' in comp: return '라이나생명'
    if '교보' in comp:   return '교보생명'
    if 'AIA' in comp:    return 'AIA생명'
    if '신한' in comp:   return '신한생명'
    return comp.replace('손해보험', '손보').replace('생명보험', '생명').strip()

def clean_product(name):
    n = name
    for pat in [r'\(무배당\)', r'\(무\)', r'\[무배당\]', r'\[무\]',
                r'\(갱신형\)', r'갱신형', r'\(자동갱신형\)']:
        n = re.sub(pat, '', n)
    n = re.sub(r'\d{4}\.\d+', '', n)
    n = re.sub(r'\d{4}', '', n)
    n = n.replace('()', '').replace('[]', '')
    n = re.sub(r'\s+', ' ', n).strip().strip('-_ ')
    return n

def is_dental_product(prod_name):
    """상품명 자체에 치아 키워드가 있어야 함 (종합보험/종신보험 제외)"""
    if not any(k in prod_name for k in DENTAL_KEYWORDS):
        return False
    if any(k in prod_name for k in EXCLUDE_PRODUCT_KEYWORDS):
        return False
    return True


# ─────────────────────────────────────────────
# XLS 파서
# ─────────────────────────────────────────────
def parse_dental_xls(filepath, source_file):
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

    # 헤더 행 탐색 (남자/여자 컬럼 위치 찾기)
    header_row_idx = m_col = f_col = -1
    for i in range(min(15, len(df))):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        male_cols   = [j for j, v in enumerate(row) if v.strip() in ['남자', '남자 ']]
        female_cols = [j for j, v in enumerate(row) if v.strip() in ['여자', '여자 ']]
        if male_cols and female_cols:
            header_row_idx = i
            m_col = male_cols[0]
            f_col = female_cols[0]
            break

    if header_row_idx == -1:
        print(f"  [SKIP] 헤더 인식 실패: {source_file}")
        return {}

    comp_col, prod_col = 1, 2  # 공시 표준 위치

    products = {}
    cur_company = ''
    cur_product = ''

    for i in range(header_row_idx + 1, len(df)):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        if not any(row):
            continue

        # 회사명/상품명 carry-forward
        if comp_col < len(row) and row[comp_col]:
            cur_company = row[comp_col]
        if prod_col < len(row) and row[prod_col]:
            cur_product = row[prod_col]

        if not cur_company or not cur_product:
            continue

        # 상품명 기준으로 치아보험 여부 판단
        if not is_dental_product(cur_product):
            continue

        # 보험료가 있는 행만 (첫 번째 행 = 총 보험료)
        m_str = row[m_col] if m_col < len(row) else ''
        f_str = row[f_col] if f_col < len(row) else ''

        m_prem = clean_num(m_str)
        f_prem = clean_num(f_str)

        if m_prem == 0 and f_prem == 0:
            continue

        # 상품당 첫 번째 유효 보험료만 사용
        comp = clean_company(cur_company)
        prod = clean_product(cur_product)
        key = f"{comp}_{prod}"

        if key not in products:
            products[key] = {
                'company_name': comp,
                'display_name': prod,
                'product_code': f"DENT_{re.sub(r'[^a-zA-Z0-9가-힣]', '_', key)[:48]}",
                'category': '치아_보험',
                'm_prem': m_prem,
                'f_prem': f_prem,
                'source': source_file
            }

    return products


# ─────────────────────────────────────────────
# 메인 파이프라인
# ─────────────────────────────────────────────
def run_dental_pipeline():
    print("=" * 60)
    print("[치아보험 자동 파이프라인] 시작")
    print("=" * 60)

    # 장기보장성 XLS 파일 스캔
    xls_files = [
        f for f in os.listdir(XLS_DIR)
        if f.endswith('.xls') and '장기보장성' in f
    ]
    if not xls_files:
        print(f"[!] 장기보장성 XLS 파일 없음")
        return

    print(f"[*] 발견된 장기보장성 XLS: {len(xls_files)}개")

    all_products = {}
    for fname in xls_files:
        fpath = os.path.join(XLS_DIR, fname)
        print(f"\n[*] 파싱 중: {fname}")
        prods = parse_dental_xls(fpath, fname)
        dental_count = len(prods)
        if dental_count:
            print(f"    → 치아보험 {dental_count}개 상품 추출")
            all_products.update(prods)
        else:
            print(f"    → 치아보험 없음")

    if not all_products:
        print("\n[!] 추출된 치아보험 상품 없음")
        return

    print(f"\n[*] 총 {len(all_products)}개 치아보험 상품 추출")

    # 보험료 검증 출력
    print("\n[*] 적재 예정 목록 (40세 기준):")
    print(f"{'회사':<12} {'상품명':<35} {'남자':>8} {'여자':>8}")
    print("-" * 70)
    for key, p in sorted(all_products.items()):
        print(f"{p['company_name']:<12} {p['display_name'][:33]:<35} "
              f"{p['m_prem']:>8,} {p['f_prem']:>8,}")

    # 시장가 범위 체크
    prems = [p['m_prem'] for p in all_products.values() if p['m_prem'] > 0]
    if prems:
        avg = sum(prems) // len(prems)
        print(f"\n[*] 보험료 범위: {min(prems):,}~{max(prems):,}원 (평균 {avg:,}원)")
        if avg > 60000:
            print("[!] 평균이 6만원 이상 → 장기보장성 XLS 치아보험 고가 상품 위주")
            print("    시장가(30,000~45,000원)와 차이 있음. 기존 하드코딩 데이터 유지 권장")
            return

    # Supabase 적재
    print("\n[*] Supabase 기존 데이터 삭제...")
    supabase.table(DENTAL_RATE_TABLE).delete().neq('id', -1).execute()
    supabase.table(DENTAL_PRODUCT_TABLE).delete().neq('id', -1).execute()

    prod_inserts = []
    rate_inserts = []

    for key, p in all_products.items():
        prod_inserts.append({
            'product_code': p['product_code'],
            'company_name': p['company_name'],
            'display_name': p['display_name'],
            'category': p['category']
        })
        rate_inserts.append({
            'product_code': p['product_code'],
            'gender': 'M', 'age': 40,
            'rate_data': {'premium': p['m_prem'], 'basis': 'XLS 비교공시'}
        })
        rate_inserts.append({
            'product_code': p['product_code'],
            'gender': 'F', 'age': 40,
            'rate_data': {'premium': p['f_prem'], 'basis': 'XLS 비교공시'}
        })

    if prod_inserts:
        for i in range(0, len(prod_inserts), 100):
            supabase.table(DENTAL_PRODUCT_TABLE).insert(prod_inserts[i:i+100]).execute()
    if rate_inserts:
        for i in range(0, len(rate_inserts), 100):
            supabase.table(DENTAL_RATE_TABLE).insert(rate_inserts[i:i+100]).execute()

    print(f"\n[완료] 상품 {len(prod_inserts)}개 / 요율 {len(rate_inserts)}건 적재 완료")
    print("=" * 60)


if __name__ == "__main__":
    run_dental_pipeline()
