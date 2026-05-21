import pandas as pd
import requests
import os
from dotenv import load_dotenv

# 1. 환경 변수 로드
load_dotenv(".env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not URL or not KEY:
    print("Supabase URL 또는 Key가 없습니다.")
    exit()

input_file = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\brain_full_gender_final.xlsx"
table_name = "brain_insurance_rates"

def clear_table():
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}"
    }
    # DELETE /rest/v1/table_name?premium=neq.0 (조건 추가하여 전체 삭제 유도)
    endpoint = f"{URL}/rest/v1/{table_name}?premium=neq.-1"
    response = requests.delete(endpoint, headers=headers)
    if response.status_code in [200, 204]:
        print(f"[*] {table_name} 테이블 데이터 삭제 성공")
    else:
        print(f"[!] 삭제 실패: {response.status_code} - {response.text}")

def upload_data(df):
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json"
    }
    endpoint = f"{URL}/rest/v1/{table_name}"
    
    # NaN 데이터 제거 및 매핑
    df = df.fillna("")
    data_list = []
    for _, row in df.iterrows():
        try:
            raw_amt = str(row['가입금액']).replace(',', '').replace('원', '').replace(' ', '')
            if '만원' in raw_amt:
                amt = int(float(raw_amt.replace('만원', ''))) * 10000
            elif '억원' in raw_amt:
                amt = int(float(raw_amt.replace('억원', ''))) * 100000000
            else:
                amt = int(float(raw_amt)) if raw_amt else 10000000
        except:
            amt = 10000000
            
        data_list.append({
            "company_name": str(row['보험회사']),
            "product_name": str(row['상품명']),
            "gender": 'M' if row['성별'] == '남성' else 'F',
            "age": int(row['나이']) if row['나이'] else 40,
            "benefit_name": str(row['담보명(급부명)']),
            "benefit_amount": str(row['가입금액']),
            "premium": int(float(row['보험료'])) if row['보험료'] else 0,
            "category": "뇌혈관"
        })
    
    # 50개씩 배치 전송
    batch_size = 50
    for i in range(0, len(data_list), batch_size):
        batch = data_list[i : i + batch_size]
        res = requests.post(endpoint, headers=headers, json=batch)
        if res.status_code in [200, 201, 204]:
            print(f"  [+] {min(i + batch_size, len(data_list))}개 적재 완료...")
        else:
            print(f"  [!] 오류 발생: {res.text}")

if __name__ == "__main__":
    if os.path.exists(input_file):
        df = pd.read_excel(input_file)
        print(f"[*] 총 {len(df)}개 데이터 준비됨.")
        clear_table()
        upload_data(df)
        print("[*] 모든 작업이 완료되었습니다.")
    else:
        print("엑셀 파일을 찾을 수 없습니다.")
