import pandas as pd
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def parse_benefit_amount(val):
    if pd.isna(val) or val == '':
        return 0
    s = str(val).replace(',', '').replace(' ', '').strip()
    
    # Check for "억원" or "억"
    match_billion = re.search(r'(\d+(?:\.\d+)?)\s*(?:억원|억)', s)
    if match_billion:
        return float(match_billion.group(1)) * 100000000
        
    # Check for "만원" or "만"
    match_million = re.search(r'(\d+(?:\.\d+)?)\s*(?:만원|만)', s)
    if match_million:
        return float(match_million.group(1)) * 10000
        
    # Only if it contains "원" and looks like a raw number (e.g. "1000000원" or "1000000")
    if "%" not in s and "％" not in s and "배" not in s:
        match_num_won = re.search(r'(\d+)원', s)
        if match_num_won:
            return float(match_num_won.group(1))
        # standalone digits only if it's large enough (e.g. > 1000)
        match_num = re.search(r'(\d+)', s)
        if match_num:
            val = float(match_num.group(1))
            if val >= 1000:
                return val
            
    return 0

def extract_number(val_str):
    if pd.isna(val_str) or val_str is None:
        return 0
    s = str(val_str).replace(",", "").replace(" ", "").replace("원", "")
    if not s or s == "-":
        return 0
    try:
        return float(s)
    except:
        m = re.search(r'(\d+(\.\d+)?)', s)
        if m:
            return float(m.group(1))
        return 0

def detect_payment_cycle_row(row):
    co = str(row.get('보험회사', ''))
    prod = str(row.get('상품명', ''))
    text = " ".join([str(v) for v in row.values if pd.notna(v)])
    
    # 1. Non-life check
    is_non_life = (co.endswith('손보') or co.endswith('화재') or co.endswith('해상') or '손해' in co or '손해보험' in co)
    if is_non_life:
        return "연납"
        
    # 2. Check explicitly for lump sum (일시납)
    if "일시납" in text or "일시불" in text:
        return "일시납"
        
    # 3. Monthly-only life insurers check
    is_monthly_only_life = co in ['라이나생명', '교보생명', '미래에셋생명', 'NH농협생명', '신한라이프생명', '메트라이프생명']
    if is_monthly_only_life:
        return "월납"
        
    # 4. Company & Product Whitelist for other life insurers
    is_life_annual_whitelist = (co in ['흥국생명', 'DB생명', 'iM라이프', '동양생명', 'KB라이프생명', '하나생명', '한화생명']) and \
                               any(k in prod for k in ['안심보험', '골든라이프', 'TOP3', '엔젤안심', '든든한인생', '프리미엄안심', '치매담은'])
    if is_life_annual_whitelist:
        return "연납"
        
    # 5. Premium-to-benefit ratio check fallback (for other life insurers)
    pm_raw = row.get('남성보험료', 0)
    pf_raw = row.get('여성보험료', 0)
    pm = extract_number(pm_raw)
    pf = extract_number(pf_raw)
    p = pm if pm > 0 else pf
    
    benefit_raw = row.get('지급금액', '')
    benefit = parse_benefit_amount(benefit_raw)
    if benefit == 0:
        benefit = parse_benefit_amount(row.get('가입금액', ''))
        
    if p > 0 and benefit > 0:
        ratio = (p * 240) / benefit
        if ratio > 1.5:
            return "연납"
            
    # Default to 월납
    return "월납"

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv"
df = pd.read_csv(csv_path)

print(f"{'Company':<12} | {'Product':<40} | {'Raw':<8} | {'Normalized':<8} | {'Cycle':<6}")
print("-" * 100)

printed_co = set()
for idx, row in df.iterrows():
    co = str(row.get('보험회사', ''))
    prod = str(row.get('상품명', ''))
    pm_raw = row.get('남성보험료', 0)
    
    pm = extract_number(pm_raw)
    if pm == 0:
        continue
        
    is_non_life = (co.endswith('손보') or co.endswith('화재') or co.endswith('해상') or '손해' in co or '손해보험' in co)
    if is_non_life:
        continue
        
    cycle = detect_payment_cycle_row(row)
    
    normalized_pm = pm
    if cycle == "연납":
        normalized_pm = pm / 12.0
    elif cycle == "일시납":
        normalized_pm = pm / 240.0
        
    key = (co, prod)
    if key not in printed_co:
        printed_co.add(key)
        print(f"{co:<12} | {prod[:40]:<40} | {int(pm):<8} | {int(round(normalized_pm)):<8} | {cycle:<6}")
