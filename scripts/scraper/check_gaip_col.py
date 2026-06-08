import pandas as pd

df = pd.read_csv(
    r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\silson\extracted_data.csv',
    encoding='utf-8-sig'
)

print("=== STANDARD_HEADERS 컬럼 인덱스 확인 ===")
for i, col in enumerate(df.columns[:16]):
    print(f"  col[{i}] = {col}")

print("\n=== 기준보험료(col7) vs 가입보험료(col8) 비교 ===")
sample = df[['보험회사', '상품명', '기준보험료', '가입보험료']].dropna(subset=['기준보험료'])
# 가입보험료가 비어있지 않은 것만
has_gaip = sample[sample['가입보험료'].notna() & (sample['가입보험료'].astype(str).str.strip() != '')]
print(f"전체 행: {len(sample)}, 가입보험료 있는 행: {len(has_gaip)}")
print()
print("=== 가입보험료 컬럼이 있는 상품 샘플 ===")
if len(has_gaip) > 0:
    print(has_gaip[['보험회사', '상품명', '기준보험료', '가입보험료']].head(30).to_string())
else:
    print("없음 - 기준보험료만 존재")

print("\n=== 가입보험료 컬럼이 없는 상품 ===")
no_gaip = sample[sample['가입보험료'].isna() | (sample['가입보험료'].astype(str).str.strip() == '')]
print(f"가입보험료 없는 행: {len(no_gaip)}")
print(no_gaip[['보험회사', '상품명']].drop_duplicates().to_string())
