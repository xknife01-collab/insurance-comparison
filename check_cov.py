import pandas as pd
csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\brain_extracted_data.csv'
df = pd.read_csv(csv_path, encoding='utf-8-sig')

target = '아이(I)러브(LOVE)'
with open('check_coverage.txt', 'w', encoding='utf-8') as f:
    for i, row in df.iterrows():
        c2 = str(row.iloc[2]).strip()
        c3 = str(row.iloc[3]).strip()
        c5 = str(row.iloc[5]).strip()  # 담보금액
        c6 = str(row.iloc[6]).strip()  # 보험료
        if target in c2 and ('뇌혈관' in c3 or '주계약' in c3 or '기본' in c3):
            f.write(f"상품: {c2}\n특약: {c3}\n담보금액: {c5}\n보험료: {c6}\n---\n")
