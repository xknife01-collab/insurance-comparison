import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\variable_term\extracted_data.csv"
df = pd.read_csv(csv_path)

# Let's filter for 흥국생명 or 푸본현대 or 라이프플래닛
filtered = df[df['보험회사'].isin(['흥국생명', '푸본현대생명', '교보라이프플래닛생명', '교보라이프플래닛'])]
with open("scripts/scratch/check_csv_term_detail.txt", "w", encoding="utf-8") as f:
    f.write("Filtered rows:\n")
    cols = ['보험회사', '상품명', '구분', '가입금액', '기준보험료', '가입보험료', 'source_file']
    f.write(filtered[cols].to_string())
