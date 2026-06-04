# -*- coding: utf-8 -*-
import pandas as pd

def check_cols():
    df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\credit\extracted_data.csv")
    print(list(df.columns))

if __name__ == "__main__":
    check_cols()
