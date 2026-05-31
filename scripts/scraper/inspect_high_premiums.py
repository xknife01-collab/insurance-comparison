import pandas as pd

df = pd.read_csv(
    r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.csv',
    encoding='utf-8-sig'
)

df['보험료_num'] = pd.to_numeric(df['가입보험료'], errors='coerce')
high_rows = df[df['보험료_num'] > 100000].copy()

for idx, row in high_rows.iterrows():
    print('---')
    print('Company:', row['보험회사'])
    print('Product:', row['상품명'])
    print('Coverage:', row['담보명(급부명)'])
    print('Premium:', row['가입보험료'])
    print('Source:', row['source_file'])
    
    # print non-empty raw columns
    raws = []
    for i in range(30):
        val = row.get(f'원본_열_{i}')
        if pd.notna(val) and str(val).strip() != '':
            raws.append(f"Col_{i}: {val}")
    print('Raw cells:', raws)
