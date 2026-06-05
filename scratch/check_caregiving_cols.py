# -*- coding: utf-8 -*-
import pandas as pd

df = pd.read_csv('insurance_data/2_care/caregiving/extracted_data.csv', nrows=5)
print("Columns count:", len(df.columns))
print("Columns list:", list(df.columns))
