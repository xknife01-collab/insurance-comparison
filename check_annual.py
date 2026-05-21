import pandas as pd
import re

csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\brain_extracted_data.csv'
df = pd.read_csv(csv_path, encoding='utf-8-sig')

df['p'] = pd.to_numeric(df.iloc[:, 6].astype(str).str.replace(',', ''), errors='coerce')
high = df[df['p'] > 100000].copy()

results = []
for i, row in high.iterrows():
    comp = str(row.iloc[1])
    prod = str(row.iloc[2])
    rider = str(row.iloc[3])
    detail = str(row.iloc[13])
    premium = row['p']
    
    # 연납 관련 키워드 확인
    is_annual = any(k in (prod + detail + rider) for k in ['연납', '연보험료', '1년', '년납'])
    # 월납 관련 키워드 확인
    is_monthly = any(k in (prod + detail + rider) for k in ['월납', '월보험료', '매월'])
    
    results.append({
        "Company": comp,
        "Product": prod,
        "Premium": premium,
        "Is_Annual_Keyword": is_annual,
        "Is_Monthly_Keyword": is_monthly,
        "Source": detail[:100] # 상세내용 앞부분
    })

res_df = pd.DataFrame(results)
print(res_df[['Company', 'Product', 'Premium', 'Is_Annual_Keyword', 'Is_Monthly_Keyword']].head(50))

# 연납 키워드가 있는 비율 확인
annual_count = res_df['Is_Annual_Keyword'].sum()
print(f"\n총 {len(res_df)}개 중 '연납' 키워드 발견: {annual_count}개")
