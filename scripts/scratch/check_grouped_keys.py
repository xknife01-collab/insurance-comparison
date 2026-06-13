import pandas as pd
import io
import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

filepath = os.path.join("..", "보장성_상품비교_20260608162037508.xls")

with open(filepath, "rb") as f:
    raw_bytes = f.read()

def clean_num(val):
    if pd.isna(val):
        return 0
    s = str(val).strip().replace(",", "")
    s = re.sub(r'[^0-9.-]', '', s)
    if not s:
        return 0
    try:
        return float(s)
    except:
        return 0

def get_scale_factor(amount_str):
    amount_str = str(amount_str).strip().replace(",", "")
    if "1,000" in amount_str or "1000" in amount_str:
        return 10.0
    if "2,000" in amount_str or "2000" in amount_str:
        return 5.0
    if "3,000" in amount_str or "3000" in amount_str:
        return 3.333
    if "5,000" in amount_str or "5000" in amount_str:
        return 2.0
    if "10,000" in amount_str or "10000" in amount_str or "1억" in amount_str:
        return 1.0
    return 1.0

for enc in ['utf-8', 'cp949', 'euc-kr']:
    try:
        raw_text = raw_bytes.decode(enc)
        if '<table' in raw_text.lower():
            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
            if frames:
                df = frames[0]
                is_renewable = (
                    (df.iloc[:, 24].astype(str).str.strip() == "갱신형") |
                    (df.iloc[:, 1].astype(str).str.contains(r'(?<!비)갱신', na=False, regex=True))
                )
                term_df = df[~is_renewable]
                
                groups = {}
                for idx, row in term_df.iterrows():
                    company = str(row.iloc[0]).strip()
                    product_name = str(row.iloc[1]).strip()
                    
                    if company in ["보험회사", "회사명", "nan"] or not product_name or product_name == "nan":
                        continue
                    
                    key = (company, product_name)
                    if key not in groups:
                        groups[key] = {
                            "company": company,
                            "product_name": product_name,
                            "main_m": [],
                            "main_f": [],
                            "riders_m": [],
                            "riders_f": []
                        }
                    
                    gubun = str(row.iloc[2]).strip()
                    amount_str = str(row.iloc[6]).strip()
                    m_prem = clean_num(row.iloc[7])
                    f_prem = clean_num(row.iloc[8])
                    
                    is_m_annual = m_prem > 50000
                    is_f_annual = f_prem > 50000
                    
                    m_monthly = m_prem / 12.0 if is_m_annual else m_prem
                    f_monthly = f_prem / 12.0 if is_f_annual else f_prem
                    
                    if gubun == "주계약":
                        main_scale = get_scale_factor(amount_str)
                        if m_monthly > 0:
                            groups[key]["main_m"].append(m_monthly * main_scale)
                        if f_monthly > 0:
                            groups[key]["main_f"].append(f_monthly * main_scale)
                    elif gubun == "특약":
                        rider_scale = get_scale_factor(amount_str)
                        if m_monthly > 0:
                            groups[key]["riders_m"].append(m_monthly * rider_scale)
                        if f_monthly > 0:
                            groups[key]["riders_f"].append(f_monthly * rider_scale)
                
                print("All products in groups:")
                for k, g in groups.items():
                    if "흥국" in k[0] or "미래에셋" in k[0] or "헤리티지" in k[1]:
                        print(f"Product: {k} | Main M: {g['main_m']} | Riders M: {g['riders_m']}")
                        
        break
    except Exception as e:
        print(f"Error: {e}")
        continue
