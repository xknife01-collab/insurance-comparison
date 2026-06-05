# -*- coding: utf-8 -*-
import pandas as pd

df = pd.read_csv('insurance_data/2_care/caregiving/extracted_data.csv', nrows=5)
with open("scratch/caregiving_cols.txt", "w", encoding="utf-8") as out:
    out.write("Columns count: " + str(len(df.columns)) + "\n")
    out.write("Columns list:\n")
    for col in df.columns:
        out.write(f"- {col}\n")
print("Written columns to scratch/caregiving_cols.txt")
