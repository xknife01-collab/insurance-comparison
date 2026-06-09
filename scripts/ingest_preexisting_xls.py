# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import pandas as pd
import io, os, re
import requests
from dotenv import load_dotenv
from supabase import create_client

# ─────────────────────────────────────────────
# 설정 및 환경 변수 로드
# ─────────────────────────────────────────────
XLS_DIR = r'c:\Users\zkfnt\Desktop\insurance-comparison-main'
TABLE_NAME = "insurance_yu_byung_ja"

load_dotenv('.env')
load_dotenv('.env.local')
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 유병자 매칭을 위한 핵심 키워드
UBJ_KEYWORDS = ['간편심사', '간편고지', '유병자', '유병장수', '355', '3.5.5', '3.10.10', '3N', '325', '통합간편']

# 다른 카테고리로 넘어가야 하거나 불필요한 상품 제외 키워드
JUNK_KEYWORDS = ['치아', '펫', '반려', '어린이', '자녀', '운전자', '자동차', '재물', '저축', '연금', '변액', '종신', '태아']

# ─────────────────────────────────────────────
# 데이터 정제 및 파싱 헬퍼 함수
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
    if '삼성생명' in comp: return '삼성생명'
    if '삼성화재' in comp: return '삼성화재'
    if '메리츠' in comp: return '메리츠화재'
    if '롯데' in comp:   return '롯데손보'
    if 'KB' in comp:     return 'KB손보'
    if 'DB' in comp:     return 'DB손보'
    if '흥국' in comp:   return '흥국화재'
    if '한화생명' in comp: return '한화생명'
    if '한화손보' in comp: return '한화손보'
    if '현대해상' in comp: return '현대해상'
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

def is_preexisting_product(prod_name):
    # 유병자 간편심사 관련 키워드가 있어야 함
    if not any(k in prod_name for k in UBJ_KEYWORDS):
        return False
    # 치아, 저축, 연금, 태아 등 제외 키워드가 걸리면 탈락
    if any(k in prod_name for k in JUNK_KEYWORDS):
        return False
    return True

# ─────────────────────────────────────────────
# XLS 파서
# ─────────────────────────────────────────────
def parse_preexisting_xls(filepath, source_file):
    df = None
    try:
        df = pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception:
        try:
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
        except Exception as e:
            print(f"  [ERROR] 파일 읽기 예외: {source_file} - {e}")

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
        # 가끔 남자/여자 문구가 10~15 라인 너머에 있는 특이 케이스 대응을 위한 범위 넓히기
        for i in range(len(df)):
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

        # 상품명 기준으로 유병자 건강보험 여부 판단
        if not is_preexisting_product(cur_product):
            continue

        # 보험료가 있는 행만 처리 (모든 담보 합산)
        m_str = row[m_col] if m_col < len(row) else ''
        f_str = row[f_col] if f_col < len(row) else ''

        m_prem = clean_num(m_str)
        f_prem = clean_num(f_str)

        if m_prem == 0 and f_prem == 0:
            continue

        # 상품당 전체 담보 보험료 합산
        comp = clean_company(cur_company)
        prod = clean_product(cur_product)
        key = f"{comp}_{prod}"

        if key not in products:
            products[key] = {
                'company_name': comp,
                'product_name': prod,
                'category': '건강보험',
                'review_type': '간편심사',
                'is_renewable': '갱신형' in cur_product,
                'm_prem': 0,
                'f_prem': 0,
                'source': source_file
            }
        
        # 담보별 보험료 합산 누적
        products[key]['m_prem'] += m_prem
        products[key]['f_prem'] += f_prem

    # 합산 후 40세 최저가 임계치 필터 적용 (35,000원 이상 상품만 수용)
    filtered_products = {
        k: v for k, v in products.items()
        if v['m_prem'] >= 35000 and v['m_prem'] <= 150000
    }
    return filtered_products

# ─────────────────────────────────────────────
# 메인 실행 파이프라인
# ─────────────────────────────────────────────
def run_preexisting_pipeline():
    print("=" * 60)
    print("[유병자보험 엑셀 자동 파이프라인] 시작")
    print("=" * 60)

    # 장기보장성 및 보장성 XLS 파일 스캔
    xls_files = [
        f for f in os.listdir(XLS_DIR)
        if f.endswith('.xls') and ('장기보장성' in f or '보장성_상품비교' in f)
    ]
    if not xls_files:
        print(f"[!] 공시 XLS 파일 없음")
        return

    print(f"[*] 발견된 공시 XLS: {len(xls_files)}개")

    all_products = {}
    for fname in xls_files:
        fpath = os.path.join(XLS_DIR, fname)
        print(f"\n[*] 파싱 중: {fname}")
        prods = parse_preexisting_xls(fpath, fname)
        count = len(prods)
        if count:
            print(f"    → 유병자 건강보험 {count}개 상품 추출")
            all_products.update(prods)
        else:
            print(f"    → 유병자 상품 매칭 없음")

    if not all_products:
        print("\n[!] 추출된 유병자 상품 없음")
        return

    print(f"\n[*] 총 {len(all_products)}개 유병자 건강보험 상품 추출 완료")

    # Supabase 기존 유병자 데이터 초기화
    print("\n[*] Supabase 기존 유병자 데이터 삭제 중...")
    try:
        supabase.table(TABLE_NAME).delete().neq('id', -1).execute()
        print("  [+] 삭제 성공!")
    except Exception as e:
        print(f"  [!] 삭제 실패 또는 예외 발생: {e}")

    # 데이터 적재 준비
    inserts = []
    for key, p in all_products.items():
        m_prem = p['m_prem']
        f_prem = p['f_prem'] if p['f_prem'] > 0 else int(m_prem * 0.85)

        # [핵심] 모든 연령대 키에 40대 원천 합산 요율을 세팅하여 프론트엔드 이중계산 오류 예방
        rates = {
            "premium_M_30": m_prem,
            "premium_M_40": m_prem,
            "premium_M_50": m_prem,
            "premium_M_60": m_prem,
            "premium_M_70": m_prem,
            "premium_M_80": m_prem,
            "premium_F_30": f_prem,
            "premium_F_40": f_prem,
            "premium_F_50": f_prem,
            "premium_F_60": f_prem,
            "premium_F_70": f_prem,
            "premium_F_80": f_prem
        }

        inserts.append({
            "company_name": p['company_name'],
            "product_name": p['product_name'],
            "category": p['category'],
            "review_type": p['review_type'],
            "is_renewable": p['is_renewable'],
            "rates": rates
        })

    # Supabase 일괄 Insert (50개씩 청크 분할 적재)
    total_loaded = 0
    if inserts:
        print(f"\n[*] Supabase 일괄 적재 시작 (총 {len(inserts)}건)...")
        for i in range(0, len(inserts), 50):
            batch = inserts[i:i+50]
            try:
                supabase.table(TABLE_NAME).insert(batch).execute()
                total_loaded += len(batch)
                print(f"  [+] {total_loaded}건 적재 완료...")
            except Exception as e:
                print(f"  [!] 적재 예외 발생 청크 {i}~{i+50}: {e}")

    print(f"\n[완료] 유병자 건강보험 {total_loaded}개 상품 최종 적재 완료")
    print("=" * 60)

if __name__ == "__main__":
    run_preexisting_pipeline()
