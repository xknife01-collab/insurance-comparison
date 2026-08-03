import pandas as pd
import os
import re

# 경로 설정
input_file = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\extracted_data.csv'
output_csv = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\extracted_data_clean.csv'
output_xlsx = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\extracted_data_clean.xlsx'

print("대용량 데이터 정제 시작 (약 480MB)...")

# 1. 청크 단위로 읽어서 메모리 부족 방지
chunks = pd.read_csv(input_file, chunksize=5000, encoding='utf-8', on_bad_lines='skip')
all_dfs = []

for chunk in chunks:
    # 모든 셀의 공백 및 줄바꿈 정리
    chunk = chunk.map(lambda x: re.sub(r'\s+', ' ', str(x)).strip() if pd.notnull(x) else "")
    
    # 너무 긴 텍스트(1000자 이상)는 데이터 오염으로 간주하고 자름
    chunk = chunk.map(lambda x: x[:1000] if len(x) > 1000 else x)
    
    all_dfs.append(chunk)

# 2. 통합 및 중복 제거
df_final = pd.concat(all_dfs, ignore_index=True)
print(f"통합 완료 (총 {len(df_final)}행)")

# 중복 제거 (매우 중요)
df_final.drop_duplicates(inplace=True)
print(f"중복 제거 후: {len(df_final)}행")

# 3. 저장
# CSV 저장 (BOM 포함 UTF-8)
df_final.to_csv(output_csv, index=False, encoding='utf-8-sig')

# XLSX 저장 (엑셀 최적화)
# openpyxl 엔진 사용
try:
    df_final.to_excel(output_xlsx, index=False, engine='openpyxl')
    print("XLSX 파일 생성 완료!")
except Exception as e:
    print(f"XLSX 생성 중 오류 (용량이 너무 큼): {e}")

print(f"최종 정제 완료: {output_csv}")
