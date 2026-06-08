import sys, os, io, re
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env'); load_dotenv('.env.local')
supabase = create_client(os.getenv("VITE_SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

XLS_DIR = r'c:\Users\zkfnt\Desktop\insurance-comparison-main'
TABLE   = 'insurance_surgery_hospital_rates'

SURGERY_KWS   = ['수술비', '수술치료', '관혈수술', '수술보장', '입원일당', '입원비']
PAYOUT_TARGET = ['1,000만원', '1천만원', '1000만원']
EXCLUDE_PROD  = ['반려', '펫', '어린이', '자녀', '치아', '운전자', '자동차',
                 '골프', '여행', '태아', '종신', '연금', '저축', '변액', '치매', '간병']
EXCLUDE_RIDER = ['반려', '펫', '어린이', '골프', '진단비', '통원', '암진단', '뇌출혈진단', '심근경색진단']


def clean_num(val):
    s = str(val).replace(',', '').strip()
    try: return int(float(s))
    except: return 0

def cv(v): return '' if pd.isna(v) else str(v).strip()

def clean_company(c):
    c = c.strip()
    for k, r in [('삼성화재','삼성화재'),('메리츠','메리츠화재'),('현대해상','현대해상'),
                 ('DB','DB손보'),('KB','KB손보'),('흥국화재','흥국화재'),('흥국생명','흥국생명'),
                 ('흥국','흥국화재'),('한화손','한화손보'),('한화생','한화생명'),('한화','한화손보'),
                 ('하나','하나손보'),('NH','NH농협손보'),('농협','NH농협손보'),
                 ('라이나','라이나생명'),('교보','교보생명'),('AIA','AIA생명'),
                 ('신한','신한생명'),('롯데','롯데손보'),('AIG','AIG손보'),
                 ('AXA','AXA손보'),('흥국','흥국화재')]:
        if k in c: return r
    return c.replace('손해보험','손보').replace('생명보험','생명').strip()

def clean_product(n):
    for pat in [r'\(무배당\)',r'\(무\)',r'\[무배당\]',r'갱신형',r'\(자동갱신형\)',r'\(연만기\)']:
        n = re.sub(pat,'',n)
    n = re.sub(r'\d{4}\.\d+','',n)
    return re.sub(r'\s+',' ',n).strip().strip('-_ ')


def parse_xls(filepath):
    df = None
    try:
        df = pd.read_excel(filepath, engine='xlrd', header=None)
    except:
        try:
            raw = open(filepath,'rb').read()
            for enc in ['cp949','euc-kr','utf-8']:
                try:
                    text = raw.decode(enc)
                    if '<table' in text.lower():
                        frames = pd.read_html(io.StringIO(text), flavor='bs4')
                        if frames: df = frames[0]; break
                except: continue
        except: pass
    if df is None: return []

    m_col = f_col = -1
    for i in range(min(15, len(df))):
        row = [cv(v) for v in df.iloc[i]]
        mc = [j for j,c in enumerate(row) if c.strip() in ['남자','남자 ']]
        fc = [j for j,c in enumerate(row) if c.strip() in ['여자','여자 ']]
        if mc and fc: m_col, f_col = mc[0], fc[0]; break
    if m_col == -1: return []

    results, seen, cur_comp, cur_prod = [], set(), '', ''
    for i in range(6, len(df)):
        row = [cv(v) for v in df.iloc[i]]
        if not any(row): continue
        if len(row) > 1 and row[1]: cur_comp = row[1]
        if len(row) > 2 and row[2]: cur_prod = row[2]
        if not cur_comp or not cur_prod: continue
        if any(k in cur_prod for k in EXCLUDE_PROD): continue

        rider  = row[3] if len(row) > 3 else ''
        payout = row[5] if len(row) > 5 else ''
        if any(k in rider for k in EXCLUDE_RIDER): continue
        if not any(k in rider for k in SURGERY_KWS): continue
        if not any(p in payout for p in PAYOUT_TARGET): continue

        m_prem = clean_num(row[m_col] if m_col < len(row) else '')
        f_prem = clean_num(row[f_col] if f_col < len(row) else '')
        if m_prem == 0 and f_prem == 0: continue

        comp = clean_company(cur_comp)
        prod = clean_product(cur_prod)
        key  = (comp, prod, rider[:50])
        if key in seen: continue
        seen.add(key)

        cat = 'hospitalization' if '입원' in rider else 'surgery'
        if m_prem > 0:
            results.append({'company_name': comp, 'product_name': prod[:250],
                'rider_name': rider[:250], 'category_type': cat,
                'gender': 'M', 'age': 40, 'premium': m_prem, 'payout_amount': 10000000})
        if f_prem > 0:
            results.append({'company_name': comp, 'product_name': prod[:250],
                'rider_name': rider[:250], 'category_type': cat,
                'gender': 'F', 'age': 40, 'premium': f_prem, 'payout_amount': 10000000})
    return results


def run():
    print('='*60)
    print('[수술/입원 보험 파이프라인] 시작')
    print('='*60)

    xls_files = [f for f in os.listdir(XLS_DIR) if f.endswith('.xls') and '장기보장성' in f]
    print(f'[*] 장기보장성 XLS: {len(xls_files)}개')

    all_records = []
    for fname in xls_files:
        recs = parse_xls(os.path.join(XLS_DIR, fname))
        print(f'  {fname}: {len(recs)}건') if recs else print(f'  {fname}: 없음')
        all_records.extend(recs)

    if not all_records:
        print('[!] 추출된 데이터 없음'); return

    print(f'\n[*] 총 {len(all_records)}건 추출 (1,000만원 기준)')
    print(f'\n{"회사":<12} {"담보":<35} {"성별":>4} {"보험료":>8}')
    print('-'*65)
    for r in sorted(all_records, key=lambda x: x['premium'])[:30]:
        print(f"{r['company_name']:<12} {r['rider_name'][:33]:<35} {r['gender']:>4} {r['premium']:>8,}")

    m = [r['premium'] for r in all_records if r['gender']=='M']
    if m: print(f'\n[*] 남자 범위: {min(m):,}~{max(m):,}원 (평균 {sum(m)//len(m):,}원)')

    print('\n[*] 기존 데이터 삭제...')
    supabase.table(TABLE).delete().neq('id', -1).execute()
    for i in range(0, len(all_records), 100):
        supabase.table(TABLE).insert(all_records[i:i+100]).execute()

    print(f'\n[완료] {len(all_records)}건 적재 완료')
    print('='*60)


if __name__ == '__main__':
    run()
