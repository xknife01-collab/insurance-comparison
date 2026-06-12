import pandas as pd
import numpy as np
import os
import re

def normalize_product_name(name):
    if not name or pd.isna(name):
        return ""
    s = str(name).strip()
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'\s*\(\s*', '(', s)
    s = re.sub(r'\s*\)\s*', ')', s)
    s = re.sub(r'\s*\[\s*', '[', s)
    s = re.sub(r'\s*\]\s*', ']', s)
    return s

def parse_benefit_to_num(val):
    if pd.isna(val) or val == '':
        return 0
    s = str(val).replace(',', '').replace(' ', '').strip()
    match_billion = re.search(r'(\d+(?:\.\d+)?)\s*(?:억원|억)', s)
    if match_billion:
        return float(match_billion.group(1)) * 100000000
    match_million = re.search(r'(\d+(?:\.\d+)?)\s*(?:만원|만)', s)
    if match_million:
        return float(match_million.group(1)) * 10000
    if "%" not in s and "％" not in s and "배" not in s:
        match_num_won = re.search(r'(\d+)원', s)
        if match_num_won:
            return float(match_num_won.group(1))
        match_num = re.search(r'(\d+)', s)
        if match_num:
            val = float(match_num.group(1))
            if val >= 1000:
                return val
    return 0

def clean_val_to_num(v):
    if pd.isna(v) or v is None:
        return 0
    s = str(v).replace(",", "").replace(" ", "").replace("원", "")
    if not s or s == "-":
        return 0
    try:
        return float(s)
    except:
        m = re.search(r'(\d+(\.\d+)?)', s)
        if m:
            return float(m.group(1))
        return 0

def detect_payment_cycle_and_years(row):
    co = str(row.get('보험회사', ''))
    prod = str(row.get('상품명', ''))
    text = " ".join([str(v) for v in row.values if pd.notna(v)])
    
    # 1. Detect payment period (e.g. 20년납, 10년납, 일시납)
    pay_period = "20년납"
    if "일시납" in text or "일시불" in text:
        pay_period = "일시납"
    else:
        criteria_match = re.search(r'(?:기준|예시|공시)[^.]*?(\d+)\s*년\s*납', text)
        if criteria_match:
            pay_period = f"{criteria_match.group(1)}년납"
        else:
            match = re.search(r'(\d+)\s*년\s*납', text)
            if match:
                pay_period = f"{match.group(1)}년납"
            else:
                for years in [20, 10, 30, 15, 5, 7]:
                    if f"{years}년" in text:
                        pay_period = f"{years}년납"
                        break
                        
    # 2. Detect policy period/years (만기 년수, e.g. 20년 만기, 10년 만기)
    policy_years = 20
    criteria_years_match = re.search(r'(?:기준|예시|공시)[^.]*?(\d+)\s*년\s*(?:만기|보장|동안)', text)
    if criteria_years_match:
        policy_years = int(criteria_years_match.group(1))
    else:
        match_years = re.search(r'(\d+)\s*년\s*(?:만기|보장|동안)', text)
        if match_years:
            policy_years = int(match_years.group(1))
        else:
            match_standalone = re.search(r'(\d+)\s*년', text)
            if match_standalone:
                val = int(match_standalone.group(1))
                if val in [5, 7, 10, 15, 20, 30]:
                    policy_years = val
                    
    # 3. Detect payment cycle (월납 vs 연납 vs 일시납)
    if pay_period == "일시납":
        cycle = "일시납"
    else:
        # Non-life check
        is_non_life = (co.endswith('손보') or co.endswith('화재') or co.endswith('해상') or '손해' in co or '손해보험' in co)
        # Check if the company belongs to the known annual payment life insurance companies
        annual_life_cos = ['흥국생명', 'DB생명', 'iM라이프', '동양생명', 'KB라이프생명', '하나생명', '한화생명']
        is_annual_life = any(ac in co for ac in annual_life_cos)
        
        if is_non_life or is_annual_life:
            cycle = "연납"
        else:
            cycle = "월납"
                        
    return cycle, pay_period, policy_years

def clean_premium(val):
    if pd.isna(val) or val == '':
        return None
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    try:
        return float(s)
    except:
        return None

def get_category_multiplier(coverage_name):
    coverage_name = str(coverage_name)
    if '사망' in coverage_name:
        return 0.77
    elif '경도' in coverage_name:
        return 0.99
    elif '중등도' in coverage_name:
        return 0.94
    elif '중증' in coverage_name:
        return 1.15
    elif '재가' in coverage_name:
        return 1.52
    elif '시설' in coverage_name:
        return 1.99
    else:
        return 1.13  # Default overall average

# File paths
csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv"
output_xlsx = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\final_monthly_dementia_comparison.xlsx"

# Load the data
df = pd.read_csv(csv_path)

# Normalize product names and company names to prevent duplicate categories from spacing mismatches
df['보험회사'] = df['보험회사'].apply(lambda x: str(x).replace(" ", "").strip() if pd.notna(x) else x)
df['상품명'] = df['상품명'].apply(normalize_product_name)

# 1. Clean the premium values
df['male_clean'] = df['남성보험료'].apply(clean_premium)
df['female_clean'] = df['여성보험료'].apply(clean_premium)

# List of companies that use annual premiums in raw data (non-life + some life insurers)
annual_companies = [
    '농협손보', '메리츠화재', '하나손보', '한화손보', '현대해상', '흥국화재',
    '흥국생명', 'DB생명', 'iM라이프', '동양생명', 'KB라이프생명', '하나생명'
]

# 2. Impute missing gender premiums where one is present and the other is missing
for idx, row in df.iterrows():
    m = row['male_clean']
    f = row['female_clean']
    cov = row['담보명(급부명)']
    
    if pd.notna(m) and pd.isna(f):
        mult = get_category_multiplier(cov)
        df.at[idx, 'female_clean'] = round(m * mult)
    elif pd.isna(m) and pd.notna(f):
        mult = get_category_multiplier(cov)
        df.at[idx, 'male_clean'] = round(f / mult)

# 3. Classify payment type and convert annual to monthly
df['납입형태'] = '월납'
for idx, row in df.iterrows():
    co = row['보험회사']
    prod = row['상품명']
    m = row['male_clean']
    f = row['female_clean']
    
    cycle, pay_period, policy_years = detect_payment_cycle_and_years(row)
    
    if cycle == "연납":
        df.at[idx, '납입형태'] = f"월납(연납환산, {pay_period})"
        if pd.notna(m):
            df.at[idx, 'male_clean'] = round(m / 12)
        if pd.notna(f):
            df.at[idx, 'female_clean'] = round(f / 12)
    elif cycle == "일시납":
        df.at[idx, '납입형태'] = f"월납(일시납환산, {policy_years}년만기)"
        if pd.notna(m):
            df.at[idx, 'male_clean'] = round(m / (policy_years * 12.0))
        if pd.notna(f):
            df.at[idx, 'female_clean'] = round(f / (policy_years * 12.0))
    else:
        df.at[idx, '납입형태'] = f"월납({pay_period})"

# 3.5 Deduplicate records to prevent double-counting during summing
# Sort so that rows with valid premiums are at the top, then keep the first occurrence of each unique rider.
df['has_premium'] = df['male_clean'].notna() | df['female_clean'].notna()
df.sort_values(by='has_premium', ascending=False, inplace=True)
df.drop_duplicates(subset=['보험회사', '상품명', '구분', '담보명(급부명)'], keep='first', inplace=True)
df.sort_values(by=['보험회사', '상품명'], inplace=True)
df.drop(columns=['has_premium'], inplace=True)

# 4. Create Detailed Breakdown DataFrame (Tab 2)
df_detail = df[[
    '보험회사', '상품명', '구분', '담보명(급부명)', '지급사유', '지급금액', '가입금액', 
    'male_clean', 'female_clean', '납입형태'
]].copy()

df_detail.rename(columns={
    'male_clean': '남성보험료(월납환산)', 
    'female_clean': '여성보험료(월납환산)'
}, inplace=True)

# 5. Create Summed Product DataFrame (Tab 1)
# Group by company, product name, and payment type to calculate totals
grouped = df_detail.groupby(['보험회사', '상품명', '납입형태'])

summary_rows = []
for (co, prod, pay_type), group in grouped:
    # Deduplicate rows with the exact same premium within the same category (주계약 or 특약)
    # to avoid double-counting sub-benefits of the same main contract/rider.
    dedup_group = group.drop_duplicates(subset=['구분', '남성보험료(월납환산)', '여성보험료(월납환산)'])
    
    # Sum only non-null values. If all are null, total premium is null/NaN.
    male_sum = dedup_group['남성보험료(월납환산)'].sum(min_count=1)
    female_sum = dedup_group['여성보험료(월납환산)'].sum(min_count=1)
    
    # If the product has zero valid premiums (e.g. all rows are NaN), skip or set to None
    if pd.isna(male_sum) and pd.isna(female_sum):
        continue
        
    summary_rows.append({
        '보험회사': co,
        '상품명': prod,
        '납입형태': pay_type,
        '총 남성보험료(월)': male_sum,
        '총 여성보험료(월)': female_sum
    })

df_summary = pd.DataFrame(summary_rows)
df_summary.sort_values(by=['보험회사', '상품명'], inplace=True)
df_summary.reset_index(drop=True, inplace=True)
df_summary.insert(0, '번호', df_summary.index + 1)

# Leave NaN as empty cells for clean numerical display and math in Excel

# Save to Excel
with pd.ExcelWriter(output_xlsx, engine='openpyxl') as writer:
    df_summary.to_excel(writer, sheet_name='상품별 합산 비교', index=False)
    df_detail.to_excel(writer, sheet_name='세부 담보별 내역', index=False)

print("Restructured Excel generated successfully!")
print(f"File saved to: {output_xlsx}")
