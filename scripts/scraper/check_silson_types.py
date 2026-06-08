import pandas as pd

df = pd.read_csv(
    r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\silson\extracted_data.csv',
    encoding='utf-8-sig'
)

print("=== 구분 컬럼 유니크값 TOP 20 ===")
top = df['구분'].value_counts().head(20)
for val, cnt in top.items():
    print(f"  [{cnt}] {repr(val)}")

print("\n=== 상품명에 표준/실속 포함 여부 ===")
mask_std = df['상품명'].str.contains('표준|실속', na=False)
print(f"  표준/실속 포함: {mask_std.sum()}건")
if mask_std.sum() > 0:
    print(df[mask_std][['보험회사', '상품명']].drop_duplicates().to_string())

print("\n=== 담보명에 표준/실속 포함 여부 ===")
mask_d = df['담보명(급부명)'].str.contains('표준|실속', na=False)
print(f"  표준/실속 포함: {mask_d.sum()}건")
if mask_d.sum() > 0:
    print(df[mask_d][['보험회사', '상품명', '담보명(급부명)']].drop_duplicates().to_string())

print("\n=== 담보명 유니크값 (담보 구조 확인) ===")
top_d = df['담보명(급부명)'].value_counts().head(30)
for val, cnt in top_d.items():
    print(f"  [{cnt}] {repr(val)}")

print("\n=== 한화손보 상품별 담보 구조 ===")
m = df[df['보험회사'].str.contains('한화', na=False)]
for name, grp in m.groupby('상품명'):
    print(f"\n  [{name}]")
    for _, row in grp.iterrows():
        print(f"    담보: {row['담보명(급부명)']} | 기준보험료: {row['기준보험료']}")

print("\n=== 현대해상 기본형 의료실비 담보 구조 ===")
m2 = df[df['상품명'].str.contains('현대해상.*기본형|기본형.*현대해상', na=False)]
if len(m2) == 0:
    m2 = df[df['보험회사'].str.contains('현대해상', na=False)]
for name, grp in m2.groupby('상품명'):
    print(f"\n  [{name}]")
    for _, row in grp.iterrows():
        print(f"    담보: {row['담보명(급부명)']} | 기준보험료: {row['기준보험료']}")
