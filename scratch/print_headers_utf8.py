# -*- coding: utf-8 -*-
import pandas as pd
df = pd.read_csv("insurance_data/2_care/caregiving/extracted_data.csv")
with open("scratch/headers_list.txt", "w", encoding="utf-8") as f:
    f.write("Number of columns: " + str(len(df.columns)) + "\n")
    for idx, col in enumerate(df.columns):
        f.write(f"{idx+1}: {col}\n")
