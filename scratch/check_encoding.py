import pandas as pd

# Let's try reading extracted_data.csv with cp949
try:
    df_cp = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv", encoding='cp949')
    print("Success reading with cp949!")
    print("DB companies:")
    db_rows = df_cp[df_cp['보험회사'].str.contains('DB', na=False)]
    print(db_rows['보험회사'].unique())
    print("DB products:")
    print(db_rows['상품명'].unique())
except Exception as e:
    print(f"Error reading with cp949: {e}")
