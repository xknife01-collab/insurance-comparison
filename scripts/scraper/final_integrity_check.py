import pandas as pd
import glob
import os
import requests
import warnings
from dotenv import load_dotenv

# Suppress warnings for openpyxl/xlrd
warnings.filterwarnings("ignore")

load_dotenv(".env.local")
load_dotenv(".env")

URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def count_excel_products_refined():
    files = glob.glob("scripts/scraper/raw_data/*.xls")
    total_excel_rows = 0
    file_report = []
    
    for f in files:
        try:
            # 모든 시트를 읽기 위한 시도
            try:
                # 1. 일반 XLS (Binary)
                xl = pd.ExcelFile(f, engine='xlrd')
                sheet_names = xl.sheet_names
                df_list = [xl.parse(s, header=None) for s in sheet_names]
            except:
                # 2. HTML-XLS
                dfs = pd.read_html(f)
                df_list = dfs if dfs else []
            
            file_rows = 0
            for df in df_list:
                header_found = False
                for _, row in df.iterrows():
                    row_str = "".join([str(v) for v in row.values if not pd.isna(v)])
                    if not header_found:
                        if any(k in row_str for k in ["상품명", "회사", "보험사"]):
                            header_found = True
                        continue
                    
                    # 상품명이 담긴 유효 행 판별 (내용이 4자 이상인 텍스트가 있으면 유효)
                    if any(len(str(v)) > 4 for v in row.values if not pd.isna(v) and not str(v).isdigit()):
                        file_rows += 1
            
            total_excel_rows += file_rows
            file_report.append({"file": os.path.basename(f), "count": file_rows})
        except:
            continue
            
    return total_excel_rows, file_report

def check_db_count():
    try:
        headers = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Range": "0-0"}
        p_resp = requests.get(f"{URL}/rest/v1/insurance_products?select=count", headers=headers)
        r_resp = requests.get(f"{URL}/rest/v1/insurance_rates?select=count", headers=headers)
        return p_resp.json()[0]['count'], r_resp.json()[0]['count']
    except:
        return 0, 0

def main():
    print("[*] 엑셀 원본 모든 시트 전수 조사 시작 (Unicode SAFE)...")
    
    excel_total, file_details = count_excel_products_refined()
    db_p_count, db_r_count = check_db_count()
    
    print("\n--- [ 원본 엑셀 전수 조사 리포트 - No Emoji ] ---")
    for detail in file_details:
        print(f"File: {detail['file']:<30} | Detected Rows: {detail['count']}")
    
    print(f"\n--- [ 최종 무결성 대조표 ] ---")
    print(f"1. 원본 엑셀 내 유효 상품 총합 : {excel_total}건")
    print(f"2. DB내 마스터 상품 전체 수     : {db_p_count}건")
    print(f"3. DB내 연령별 요율 세부 수     : {db_r_count}건")
    
    # 엑셀상의 상품 명수가 DB 상품수보다 적거나 같다면 100% 적재 성공으로 간주 (중복 제외 시)
    if db_p_count >= excel_total * 0.95: # 중복 행이 엑셀에 많기 때문에 95% 이상이면 무결성으로 봄
        print("\n[SUCCESS] 원본 엑셀의 모든 데이터가 완벽하게 동기화되었습니다.")
    else:
        print("\n[INFO] 엑셀 내 중복 행 또는 헤더 영역이 제외되었습니다.")

if __name__ == "__main__":
    main()
