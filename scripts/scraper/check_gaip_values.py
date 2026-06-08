import pandas as pd

df = pd.read_csv(
    r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\silson\extracted_data.csv',
    encoding='utf-8-sig'
)

# 가입보험료 컬럼(col8) 실제 값 분포 확인
print("=== 가입보험료(col8) 값 분포 ===")
gaip_vals = df['가입보험료'].dropna()
# 숫자인지 % 값인지 확인
print(f"전체 비어있지 않은 값: {len(gaip_vals)}")
import re
def is_percent(v):
    return bool(re.search(r'%|\d+\.\d+$', str(v)))

pct_count = gaip_vals.apply(is_percent).sum()
print(f"퍼센트/소수점(%) 형태: {pct_count}건")
print(f"숫자 형태: {len(gaip_vals) - pct_count}건")
print()
print("샘플값 20개:")
for v in gaip_vals.head(20):
    print(f"  {repr(v)}")

print("\n=== 결론: 기준보험료(col7) vs 가입보험료(col8) 실제 의미 ===")
sample = df[['보험회사', '상품명', '담보명(급부명)', '기준보험료', '가입보험료']].dropna(subset=['기준보험료', '가입보험료'])
for _, row in sample.head(20).iterrows():
    print(f"  [{row['보험회사']}] {row['담보명(급부명)']}")
    print(f"    기준보험료: {row['기준보험료']}  |  가입보험료: {row['가입보험료']}")
