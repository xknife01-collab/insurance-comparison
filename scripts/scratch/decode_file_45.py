import pandas as pd
import warnings

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_45.xls"

try:
    df = pd.read_excel(filepath, engine='xlrd', header=None)
    print("Read with xlrd")
    row = df.iloc[526].tolist()
    for idx, col in enumerate(row):
        print(f"Col {idx}: {col}")
except Exception as e:
    print("Failed with xlrd:", e)
