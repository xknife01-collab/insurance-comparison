# -*- coding: utf-8 -*-
import pandas as pd
df = pd.read_csv("insurance_data/2_care/caregiving/extracted_data.csv")
with open("scratch/caregiving_rows.txt", "w", encoding="utf-8") as f:
    f.write("Columns: " + ", ".join(df.columns) + "\n")
    # write first 10 rows
    for i in range(10):
        row = df.iloc[i].tolist()
        f.write(f"Row {i}: " + ", ".join([str(v) for v in row]) + "\n")
