import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv"
try:
    df = pd.read_csv(csv_path, encoding='utf-8-sig')
    print("Success reading with utf-8-sig!")
    print(df.head(5)[["보험회사", "상품명", "담보명(급부명)", "남성보험료", "여성보험료"]])
except Exception as e:
    print("Failed reading with utf-8-sig:", e)
