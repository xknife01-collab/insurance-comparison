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
    amount_str = str(amount_str).strip().replace(" ", "").replace(",", "")
    num_match = re.match(r'^[0-9.]+', amount_str)
    if not num_match:
        return 1.0
    num_val = float(num_match.group(0))
    if num_val <= 0:
        return 1.0
    
    if '억' in amount_str:
        return 1.0 / num_val
    if '만원' in amount_str or '만' in amount_str:
        return 10000.0 / num_val
    return 100000.0 / num_val

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
                term_df = df[
                    (~is_renewable) &
                    (df.iloc[:, 1].astype(str).str.contains("정기보험", na=False))
                ]
                
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
                    
                    # Apply strict standard:
                    # '주계약' is ALWAYS annual -> divide by 12.
                    # '특약' is ALWAYS monthly -> do NOT divide by 12.
                    if gubun == "주계약":
                        main_scale = get_scale_factor(amount_str)
                        # Always divide by 12
                        m_monthly = (m_prem * main_scale) / 12.0
                        f_monthly = (f_prem * main_scale) / 12.0
                        if m_monthly > 0:
                            groups[key]["main_m"].append(m_monthly)
                        if f_monthly > 0:
                            groups[key]["main_f"].append(f_monthly)
                    elif gubun == "특약":
                        rider_scale = get_scale_factor(amount_str)
                        m_monthly = m_prem * rider_scale
                        f_monthly = f_prem * rider_scale
                        if m_monthly > 0:
                            groups[key]["riders_m"].append(m_monthly)
                        if f_monthly > 0:
                            groups[key]["riders_f"].append(f_monthly)
                
                results_m1 = []
                results_m2 = []
                
                age_factor = 1.36049
                
                for key, grp in groups.items():
                    base_main_m = min(grp["main_m"]) if grp["main_m"] else 0
                    total_riders_m = sum(grp["riders_m"])
                    
                    if base_main_m == 0:
                        continue
                    
                    # Method 1: Clamp at age 44 (after age factor)
                    scaled_main_m1 = base_main_m * age_factor
                    clamped_main_m1 = max(10000.0, scaled_main_m1)
                    scaled_riders_m1 = total_riders_m * age_factor
                    total_m1 = clamped_main_m1 + scaled_riders_m1
                    final_m1 = total_m1 * 1.35
                    final_m1_rounded = round(final_m1 / 100) * 100
                    
                    # Method 2: Clamp at age 40 (before age factor)
                    clamped_main_m2 = max(10000.0, base_main_m)
                    scaled_main_m2 = clamped_main_m2 * age_factor
                    scaled_riders_m2 = total_riders_m * age_factor
                    total_m2 = scaled_main_m2 + scaled_riders_m2
                    final_m2 = total_m2 * 1.35
                    final_m2_rounded = round(final_m2 / 100) * 100
                    
                    results_m1.append({
                        "company": grp["company"],
                        "product_name": grp["product_name"],
                        "base_main_m": base_main_m,
                        "total_riders_m": total_riders_m,
                        "final_prem": final_m1_rounded,
                        "main_part": clamped_main_m1,
                        "rider_part": scaled_riders_m1
                    })
                    
                    results_m2.append({
                        "company": grp["company"],
                        "product_name": grp["product_name"],
                        "base_main_m": base_main_m,
                        "total_riders_m": total_riders_m,
                        "final_prem": final_m2_rounded,
                        "main_part": scaled_main_m2,
                        "rider_part": scaled_riders_m2
                    })
                
                results_m1_sorted = sorted(results_m1, key=lambda x: x["final_prem"])
                results_m2_sorted = sorted(results_m2, key=lambda x: x["final_prem"])
                
                print("METHOD_1_START")
                for idx, res in enumerate(results_m1_sorted[:100]):
                    print(f"{idx+1:02d}||{res['company']}||{res['product_name']}||{int(res['base_main_m'])}||{int(res['total_riders_m'])}||{int(res['main_part'])}||{int(res['rider_part'])}||{int(res['final_prem'])}")
                print("METHOD_1_END")
                
                print("METHOD_2_START")
                for idx, res in enumerate(results_m2_sorted[:100]):
                    print(f"{idx+1:02d}||{res['company']}||{res['product_name']}||{int(res['base_main_m'])}||{int(res['total_riders_m'])}||{int(res['main_part'])}||{int(res['rider_part'])}||{int(res['final_prem'])}")
                print("METHOD_2_END")
                    
        break
    except Exception as e:
        import traceback
        traceback.print_exc()
        continue
