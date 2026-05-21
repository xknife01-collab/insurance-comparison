import pandas as pd
import os

# 경로 설정
cancer_dir = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\cancer'
input_file = os.path.join(cancer_dir, 'extracted_data.csv')

print("암보험 카테고리 분리 작업 시작...")

# 데이터 읽기
df = pd.read_csv(input_file, encoding='utf-8-sig', on_bad_lines='skip')

# 1. 표적항암형 (핵심 특약 기준)
targeted_keywords = ['표적항암', '카티', 'CAR-T', '양성자', '세기조절', '면역항암']
df_targeted = df[df['담보명(급부명)'].str.contains('|'.join(targeted_keywords), na=False, case=False)]

# 2. 갱신형
renewable_keywords = ['갱신형']
# '갱신구분' 컬럼이 있으면 활용, 없으면 상품명/담보명에서 찾음
df_renewable = df[
    (df['갱신구분'].astype(str).str.contains('갱신', na=False)) | 
    (df['상품명'].str.contains('갱신형', na=False)) |
    (df['담보명(급부명)'].str.contains('갱신형', na=False))
]

# 3. 비갱신형 (갱신형이 아닌 것)
df_non_renewable = df[~df.index.isin(df_renewable.index)]

# 결과 저장 (CSV 및 XLSX)
outputs = {
    'cancer_non_renewable': df_non_renewable,
    'cancer_renewable': df_renewable,
    'cancer_targeted': df_targeted
}

for name, data in outputs.items():
    csv_path = os.path.join(cancer_dir, f'{name}.csv')
    xlsx_path = os.path.join(cancer_dir, f'{name}.xlsx')
    
    data.to_csv(csv_path, index=False, encoding='utf-8-sig')
    data.to_excel(xlsx_path, index=False, engine='openpyxl')
    print(f"생성 완료: {name} ({len(data)}건)")

print("모든 분류 작업이 완료되었습니다!")
