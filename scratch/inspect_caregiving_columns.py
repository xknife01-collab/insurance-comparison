# -*- coding: utf-8 -*-
import pandas as pd
df = pd.read_csv("insurance_data/2_care/caregiving/extracted_data.csv")
print("Number of columns:", len(df.columns))
print("Columns list:")
for idx, col in enumerate(df.columns):
    print(f"{idx+1}: {col}")
