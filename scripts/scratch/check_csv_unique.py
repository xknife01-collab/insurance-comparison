import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\variable_term\extracted_data.csv"
try:
    df = pd.read_csv(csv_path)
    print("Unique values of '구분':")
    print(df['구분'].value_counts())
    
    print("\nUnique values of 'sub_type':")
    print(df['sub_type'].value_counts())
except Exception as e:
    print("Error:", e)
