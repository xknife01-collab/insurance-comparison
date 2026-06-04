import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\variable_term\extracted_data.csv"
df = pd.read_csv(csv_path)
matching = df[df['상품명'].str.contains("원패스", na=False)]

with open("scripts/scratch/check_csv_onepass_results.txt", "w", encoding="utf-8") as f:
    f.write("Matching CSV rows for '원패스':\n")
    cols = ['보험회사', '상품명', '구분', '가입금액', '기준보험료', '가입보험료', 'source_file', 'sub_type', 'file_type']
    f.write(matching[cols].to_string())
