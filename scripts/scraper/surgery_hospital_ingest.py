import os
import re
import requests
from bs4 import BeautifulSoup
import xlrd
from dotenv import load_dotenv

load_dotenv('.env.local')
load_dotenv('.env')

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def extract_number(val):
    if not val: return 0
    s = str(val).strip()
    if '%' in s or s == '-': return 0
    
    # 콤마만 제거하고 첫 번째 숫자 덩어리만 추출
    match = re.search(r'\d+', s.replace(',', ''))
    if not match: return 0
    
    num = int(match.group())
    if num > 2147483647: return 0 # BigInt 범위를 넘어서면 0처리 (데이터 오류 방지)
    return num

import chardet

def ingest_html_file(path):
    raw = open(path, 'rb').read()
    content = None
    
    # 한국형 인코딩 무차별 대입
    for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-16']:
        try:
            decoded = raw.decode(enc)
            # 한글이 깨지는지 간단히 체크 (특수문자 뀗쐵 등이 과도한지)
            if '보험' in decoded or '수술' in decoded:
                content = decoded
                break
        except: continue
    
    if not content:
        content = raw.decode('cp949', errors='ignore')
        
    try:
        soup = BeautifulSoup(content, 'html.parser')
    except Exception as e:
        print(f"  [!] Soup error in {path}: {e}")
        return []
    
    data = []
    last_company = ""
    last_product = ""
    
    # 1. 컬럼 매핑 (보험료 컬럼 찾기)
    header_rows = soup.find_all('tr')[:5] # 상단 5줄에서 헤더 탐색
    male_idx = 6  # Default (file_20 기준)
    female_idx = 7
    is_yearly = True # 대부분 연납 기준
    
    # 2. 로우 프로세싱
    rows = soup.find_all('tr')
    for row in rows:
        cells = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
        if len(cells) < 10: continue
        
        # 상품/회사 추출 (데이터가 한 칸 밀려있는 경우 대응)
        if not cells[0] and len(cells) > 2:
            comp = cells[1].strip()
            prod = cells[2].strip()
            rider = cells[4].strip() if len(cells) > 4 else cells[3].strip()
        else:
            comp = cells[0].strip()
            prod = cells[1].strip()
            rider = cells[3].strip()
        
        # 필터링 키워드
        EXCLUDE_PROD = ['아이', '어린이', '취미', '독감', '미니', 'mini', '펫', '골프', '여행', '운전자', '자동차']
        
        if comp and len(comp) > 1 and '남' not in comp: 
            last_company = comp
        
        # 상품명이 '선택'이거나 너무 짧으면 업데이트 안 함
        if prod and len(prod) > 2 and '선택' not in prod and '안내' not in prod: 
            last_product = prod
        elif not last_product or '선택' in last_product:
            # 주변에서라도 찾기
            candidates = [c for c in cells[:6] if len(c) > 5 and '보험' in c]
            if candidates: last_product = candidates[0]

        # 수술/입원 특약명 추출
        if not ('수술' in rider or '입원' in rider): continue
        
        # 불필요한 카테고리 상품 패스
        is_bad = any(k in last_product for k in EXCLUDE_PROD) or any(k in rider for k in EXCLUDE_PROD)
        if is_bad: continue
        
        # 보험료 추출 (남자/여자)
        # 우리 전수조사 결과 file_20 등에서 6, 7번이 보험료였음
        try:
            m_val = extract_number(cells[male_idx])
            f_val = extract_number(cells[female_idx])
            
            # 연납 -> 월납 변환 (평균적으로 특약은 100~5000원 사이임)
            # 만약 수치가 너무 크면 연납으로 간주하고 12로 나눔
            if m_val > 10000: m_val = round(m_val / 12)
            if f_val > 10000: f_val = round(f_val / 12)
            
            payout = extract_number(cells[5])
            
            if m_val > 50:
                data.append({
                    "company_name": last_company, "product_name": last_product, "rider_name": rider,
                    "category_type": category, "gender": "M", "age": 40, "premium": m_val, "payout_amount": payout
                })
            if f_val > 50:
                data.append({
                    "company_name": last_company, "product_name": last_product, "rider_name": rider,
                    "category_type": category, "gender": "F", "age": 40, "premium": f_val, "payout_amount": payout
                })
        except: pass
            
    return data

def ingest_binary_file(path):
    data = []
    try:
        wb = xlrd.open_workbook(path)
        sheet = wb.sheet_by_index(0)
        last_company = ""
        last_product = ""
        for r in range(4, sheet.nrows):
            row = [str(sheet.cell_value(r, c)) for c in range(sheet.ncols)]
            if len(row) < 8: continue
            
            # 상품/회사 추출 (데이터가 한 칸 밀려있는 경우 대응)
            if not row[0].strip() and len(row) > 2:
                comp = str(row[1]).strip()
                prod = str(row[2]).strip()
                rider = str(row[4]).strip() if len(row) > 4 else str(row[3]).strip()
            else:
                comp = str(row[0]).strip()
                prod = str(row[1]).strip()
                rider = str(row[3]).strip()
            
            # 필터링 키워드
            EXCLUDE_PROD = ['아이', '어린이', '취미', '독감', '미니', 'mini', '펫', '골프', '여행', '운전자', '자동차', '암', '간병', '실손', '상해', '재해', '비즈니스', 'CEO', '재물', '재산', '화재', '치매', '요양', '장기요양']
            
            if comp and len(comp) > 1: last_company = comp
            
            # 상품명이 '선택'이거나 너무 짧으면 업데이트 안 함
            if prod and len(prod) > 2 and '선택' not in prod and '안내' not in prod: 
                last_product = prod
            elif not last_product or '선택' in last_product:
                # 주변에서라도 찾기
                for cell in row[:6]:
                    c_str = str(cell)
                    if len(c_str) > 5 and '보험' in c_str:
                        last_product = c_str
                        break
            
            # 모든 담보 수용 (상품 자체가 relevant하다면)
            if len(row) > 7:
                # 불필요한 카테고리 상품 패스
                is_bad = any(k in (last_product or '') for k in EXCLUDE_PROD) or any(k in (rider or '') for k in EXCLUDE_PROD)
                if is_bad: continue

                category = 'surgery' if '수술' in rider else 'hospitalization'
                m_val = extract_number(row[6])
                f_val = extract_number(row[7])
                
                # 현실적인 연납 환산
                if m_val > 10000: m_val = round(m_val / 12)
                if f_val > 10000: f_val = round(f_val / 12)
                
                payout = extract_number(row[5]) if len(row) > 5 else 0
                
                if m_val > 100:
                    data.append({
                        "company_name": last_company, "product_name": (last_product or 'Unknown'), "rider_name": rider,
                        "category_type": category, "gender": "M", "age": 40, "premium": m_val, "payout_amount": payout
                    })
                if f_val > 100:
                    data.append({
                        "company_name": last_company, "product_name": (last_product or 'Unknown'), "rider_name": rider,
                        "category_type": category, "gender": "F", "age": 40, "premium": f_val, "payout_amount": payout
                    })
    except Exception as e:
        print(f"  [Error in Binary Ingest] {e}")
    return data

def save(batch):
    if not batch: return
    r = requests.post(f"{SUPABASE_URL}/rest/v1/insurance_surgery_hospital_rates", headers=HEADERS, json=batch)
    if r.status_code >= 200 and r.status_code < 300:
        print(f"  [OK] Saved {len(batch)} records.")
    else:
        print(f"  [ERR] {r.status_code}: {r.text}")

if __name__ == "__main__":
    root = 'scripts/scraper/raw_data'
    all_data = []
    seen = set()
    
    # 1. 테이블 초기화
    requests.delete(f"{SUPABASE_URL}/rest/v1/insurance_surgery_hospital_rates?id=not.is.null", headers=HEADERS)
    print("[*] Table truncated.")

    # 2. 전수 조사 시작
    for f in sorted(os.listdir(root)):
        if not f.endswith('.xls'): continue
        path = os.path.join(root, f)
        
        res = []
        with open(path, 'rb') as f_bin:
            header = f_bin.read(512)
            # BIFF(Excel Binary)는 \xD0\xCF\x11\xE0 로 시작함
            is_binary = header.startswith(b'\xd0\xcf\x11\xe0')
            
            if not is_binary:
                res = ingest_html_file(path)
            else:
                res = ingest_binary_file(path)
        
        if res:
            new_recs = []
            for r in res:
                # Truncate strings
                r['product_name'] = r['product_name'][:250]
                r['rider_name'] = r['rider_name'][:250]
                
                key = (r['company_name'], r['product_name'], r['rider_name'], r['gender'], r['age'])
                if key not in seen:
                    seen.add(key)
                    new_recs.append(r)
            
            if new_recs:
                print(f"[*] Extracting {len(new_recs)} valid records from {f}")
                all_data.extend(new_recs)
                if len(all_data) >= 200:
                    save(all_data)
                    all_data = []
    
    if all_data:
        save(all_data)
    print(f"[*] Final Check Complete. Total {len(seen)} precise records loaded into DB.")
