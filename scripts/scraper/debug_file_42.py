import os
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_42.xls"

driver_keywords = ["운전자", "교통사고", "벌금", "변호사", "교통상해", "부상치료", "자부상", "운전중", "형사합의", "사고처리", "면허정지", "면허취소"]

def is_driver_row(row_list, filename):
    row_str = " ".join([str(v) for v in row_list])
    matched_kws = [kw for kw in driver_keywords if kw in row_str]
    if len(matched_kws) == 0:
        return False, "no_keywords"
    exclude_kws = ["치아", "치매", "간병", "뇌혈관", "허혈성", "암진단", "심장질환", "보철", "임플란트", "틀니", "치주", "잇몸"]
    if any(ek in row_str for ek in exclude_kws):
        return False, "exclude_kws"
    if any(k in filename.lower() for k in ["driver", "운전자", "장기보장성"]):
        return True, "filename"
    if any(k in row_str for k in ["운전자보험", "운전중", "교통사고처리지원", "변호사선임"]):
        return True, "row_str_keywords"
    return False, "failed_criteria_3"

try:
    print("Testing is_driver_row...")
    xl = pd.ExcelFile(filepath)
    df = xl.parse(xl.sheet_names[0], header=None)
    for idx, row in df.head(30).iterrows():
        row_list = [str(val).strip() for val in row if pd.notna(val)]
        if not row_list:
            continue
        res, reason = is_driver_row(row_list, os.path.basename(filepath))
        print(f"Row {idx}: {row_list[:3]} -> Res: {res}, Reason: {reason}")
except Exception as e:
    print("Error:", e)

try:
    print("Trying pd.read_html with cp949...")
    with open(filepath, 'r', encoding='cp949', errors='ignore') as f:
        content = f.read()
        print("Content length (cp949):", len(content))
        print("Is html table inside?", "<table" in content.lower())
        if "<table" in content.lower():
            tables = pd.read_html(content)
            print("Successfully parsed with pd.read_html! Table count:", len(tables))
            df = tables[0]
            print("Shape:", df.shape)
            for idx, row in df.head(10).iterrows():
                print(f"Row {idx}:", [str(val).strip() for val in row if pd.notna(val)])
except Exception as e:
    print("pd.read_html cp949 error:", e)
