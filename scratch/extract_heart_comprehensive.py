import os
import pandas as pd
import warnings
from bs4 import BeautifulSoup
import re
from io import StringIO

# Suppress warnings
warnings.filterwarnings("ignore")

root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
output_dir = os.path.join(root_dir, "insurance-comparison-main", "insurance_data", "1_guaranteed", "heart")
output_file = os.path.join(output_dir, "extracted_data_v2.csv")

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

keywords = ["심장", "허혈", "심혈관", "부정맥", "심근경색", "협심증", "스텐트", "심부전", "조율기", "판막"]
keyword_pattern = re.compile("|".join(keywords), re.IGNORECASE)

# Strict list of Korean Insurance Companies for validation
KNOWN_COMPANIES = [
    "메리츠화재", "한화손해보험", "롯데손해보험", "MG손해보험", "흥국화재", "삼성화재", "현대해상", "KB손해보험", "DB손해보험", 
    "교보생명", "한화생명", "삼성생명", "신한라이프", "라이나생명", "AIA생명", "푸본현대생명", "흥국생명", "DGB생명", 
    "KDB생명", "미래에셋생명", "농협생명", "농협손해보험", "동양생명", "DB생명", "하나생명", "하나손해보험", "신한EZ손해보험", "에이스손보"
]

def extract_from_html(file_path):
    print(f"Processing {os.path.basename(file_path)}...")
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            html_content = f.read()
        
        soup = BeautifulSoup(html_content, "html.parser")
        table = soup.find("table")
        if not table: return []
            
        dfs = pd.read_html(StringIO(str(table)))
        if not dfs: return []
        df = dfs[0]
        data_matrix = df.values
        rows_count, cols_count = data_matrix.shape
        
        mapping = {"보험회사": 0, "상품명": 1, "구분": 2, "담보명": 3, "지급사유": 4, "지급금액": 5, "가입금액": 6, "남자보험료": 7, "여자보험료": 8}
        
        for r in range(min(20, rows_count)):
            row_vals = [str(v).strip() for v in data_matrix[r]]
            if any("상품명" in v or "담보명" in v or "지급사유" in v for v in row_vals):
                for i, v in enumerate(row_vals):
                    if "보험회사" in v: mapping["보험회사"] = i
                    elif "상품명" in v: mapping["상품명"] = i
                    elif "구분" in v: mapping["구분"] = i
                    elif "담보명" in v or "급부명" in v: mapping["담보명"] = i
                    elif "지급사유" in v: mapping["지급사유"] = i
                    elif "지급금액" in v: mapping["지급금액"] = i
                    elif "가입금액" in v: mapping["가입금액"] = i
                    elif "남자" in v: mapping["남자보험료"] = i
                    elif "여자" in v: mapping["여자보험료"] = i
                break
        
        extracted_rows = []
        last_company = ""
        last_product = ""
        exclude_keywords = [
            "반려", "펫보험", "자녀", "어린이", "아이", "키즈", "꿈나무", "태아", "꿈틀", "청소년", 
            "암보험", "암진단", "암치료", "암보장", "유사암", "종신", "유병자", "간편", "335", "355", "325", "311", "간편가입"
        ]

        for r in range(rows_count):
            row_values = [str(v) if pd.notna(v) else "" for v in data_matrix[r]]
            row_str = " ".join(row_values)
            
            # Company detection
            current_comp = ""
            for val in row_values:
                v_clean = val.strip().replace(" ", "")
                for company in KNOWN_COMPANIES:
                    if company in v_clean:
                        current_comp = company
                        break
                if current_comp: break
            if current_comp: last_company = current_comp
            
            # Product detection
            current_prod = ""
            p_col = mapping["상품명"]
            if p_col < cols_count:
                p_val = row_values[p_col].strip()
                if len(p_val) > 8 and "보험" in p_val and "확정" not in p_val and "경우" not in p_val:
                    current_prod = p_val
            if not current_prod:
                for val in row_values:
                    v_clean = val.strip()
                    if len(v_clean) > 10 and "보험" in v_clean and "확정" not in v_clean and "경우" not in v_clean:
                        current_prod = v_clean
                        break
            if current_prod: last_product = current_prod

            # Filtering
            row_str_clean = row_str.replace(" ", "").replace("\n", "")
            is_excluded = any(x in row_str_clean for x in exclude_keywords) or \
                          any(x in last_product for x in exclude_keywords)
            
            if "보험료" in last_company or "지급" in last_company: last_company = ""

            if keyword_pattern.search(row_str) and not is_excluded:
                if not last_company or not last_product: continue
                
                # Cleanup premiums and apply imputation (1.2x multiplier)
                male_price = re.sub(r"[^0-9]", "", str(row_values[mapping["남자보험료"]])) if mapping["남자보험료"] < cols_count else ""
                female_price = re.sub(r"[^0-9]", "", str(row_values[mapping["여자보험료"]])) if mapping["여자보험료"] < cols_count else ""
                
                m_val = int(male_price) if male_price else 0
                f_val = int(female_price) if female_price else 0
                
                if m_val > 0 and f_val == 0:
                    f_val = int(m_val / 1.2)
                elif f_val > 0 and m_val == 0:
                    m_val = int(f_val * 1.2)
                
                if m_val == 0 and f_val == 0: continue # Skip rows with no premium info

                extracted = {
                    "보험회사": last_company,
                    "상품명": last_product,
                    "구분": last_product,
                    "담보명(급부명)": row_values[mapping["담보명"]] if mapping["담보명"] < cols_count else "",
                    "지급사유": row_values[mapping["지급사유"]] if mapping["지급사유"] < cols_count else "",
                    "지급금액": row_values[mapping["지급금액"]] if mapping["지급금액"] < cols_count else "",
                    "가입금액": row_values[mapping["가입금액"]] if mapping["가입금액"] < cols_count else "",
                    "기준보험료": str(m_val),
                    "가입보험료": str(f_val),
                    "적용이율": "", "갱신구분": "갱신형" if "갱신" in row_str else "비갱신형", 
                    "판매채널": "대면", "기준일자": "2026-01-01", "상세안내": "", "연락처": "",
                    "source_file": os.path.basename(file_path)
                }
                for i in range(30):
                    extracted[f"원본_열_{i}"] = row_values[i] if i < cols_count else ""
                extracted_rows.append(extracted)
        return extracted_rows
    except Exception as e:
        print(f"Error: {e}")
        return []

xls_files = [os.path.join(root_dir, f) for f in os.listdir(root_dir) if f.endswith((".xls", ".xlsx"))]
all_results = []
for f in xls_files:
    all_results.extend(extract_from_html(f))

if all_results:
    final_df = pd.DataFrame(all_results)
    final_df = final_df[final_df["보험회사"] != ""]
    final_df = final_df[~final_df["상품명"].str.contains("보험가입금액|지급금액|지급사유", na=False)]
    
    output_path = os.path.join(output_dir, "extracted_data.csv")
    final_df.to_csv(output_path, index=False, encoding="utf-8-sig")
    print(f"Saved {len(final_df)} rows to extracted_data.csv")
else:
    print("No data found.")
