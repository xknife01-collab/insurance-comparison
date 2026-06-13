import pandas as pd
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv"
df = pd.read_csv(csv_path)

def clean_premium(val):
    if pd.isna(val) or val == '':
        return 0
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    try:
        return float(s)
    except:
        return 0

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
        
    # Check for raw number
    match_num = re.search(r'(\d+)', s)
    if match_num:
        return float(match_num.group(1))
        
    return 0

# Group by company and product to determine the product-level cycle
product_groups = df.groupby(['보험회사', '상품명'])
product_cycles = {}

for (co, prod), group in product_groups:
    max_benefit = 0
    corresponding_premium = 0
    
    # Find the row in the group with the largest benefit amount (which has a premium)
    for idx, row in group.iterrows():
        p_male = clean_premium(row.get('남성보험료', 0))
        p_female = clean_premium(row.get('여성보험료', 0))
        p = p_male if p_male > 0 else p_female
        
        if p > 0:
            b_val = max(parse_benefit_amount(row.get('지급금액', '')), parse_benefit_amount(row.get('가입금액', '')))
            if b_val > max_benefit:
                max_benefit = b_val
                corresponding_premium = p
                
    # If no benefit amount could be parsed, check by max premium
    if max_benefit == 0:
        for idx, row in group.iterrows():
            p_male = clean_premium(row.get('남성보험료', 0))
            p_female = clean_premium(row.get('여성보험료', 0))
            p = p_male if p_male > 0 else p_female
            if p > corresponding_premium:
                corresponding_premium = p
        max_benefit = 10000000  # Default to 1000만원
        
    is_non_life = (co.endswith('손보') or co.endswith('화재') or co.endswith('해상') or '손해' in co)
    
    is_life_annual = False
    if not is_non_life:
        if corresponding_premium > 70000:
            is_life_annual = True
            
    if is_non_life or is_life_annual:
        cycle = "연납"
    else:
        # Also check ratio just in case
        if corresponding_premium > 0 and max_benefit > 0:
            total_premium_monthly = corresponding_premium * 240
            ratio = total_premium_monthly / max_benefit
            if ratio > 1.5:
                cycle = "연납"
            else:
                cycle = "월납"
        else:
            cycle = "월납"
            
    product_cycles[(co, prod)] = {
        'cycle': cycle,
        'max_benefit': max_benefit,
        'premium': corresponding_premium
    }

# Print classification of all products
print(f"{'Company':<15} | {'Product Name':<50} | {'Cycle':<5} | {'Benefit':<10} | {'Premium':<8}")
print("-" * 105)
for (co, prod), info in sorted(product_cycles.items()):
    print(f"{co:<15} | {prod[:50]:<50} | {info['cycle']:<5} | {info['max_benefit']:<10} | {info['premium']:<8}")
