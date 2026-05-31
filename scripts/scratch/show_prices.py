import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv"
df = pd.read_csv(csv_path)

# 기준보험료 또는 가입보험료 컬럼 확인
print("컬럼:", [c for c in df.columns if '보험료' in c or '보험' in c])
print("\n상품별 보험료 샘플:")

# 상품별로 기준보험료/가입보험료 값이 있는 첫 번째 행 추출
summary = {}
for _, row in df.iterrows():
    prod = row['상품명']
    company = row['보험회사']
    
    # 기준보험료/가입보험료 찾기
    std_p = str(row.get('기준보험료', '')).strip()
    entry_p = str(row.get('가입보험료', '')).strip()
    
    # 원본열에서도 보험료 찾기
    raw_vals = [str(row.get(f'원본_열_{i}', '')).strip() for i in range(30)]
    
    if prod not in summary:
        summary[prod] = {
            'company': company,
            'std_premium': std_p if std_p and std_p != 'nan' else '-',
            'entry_premium': entry_p if entry_p and entry_p != 'nan' else '-',
            'raw': raw_vals
        }

for prod, info in summary.items():
    print(f"\n보험사: {info['company']}")
    print(f"상품명: {prod}")
    print(f"  기준보험료: {info['std_premium']}")
    print(f"  가입보험료: {info['entry_premium']}")
