import pandas as pd

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"
df = pd.read_csv(CSV_PATH, nrows=2)

with open("c:\\Users\\zkfnt\\Desktop\\insurance-comparison-main\\insurance-comparison-main\\scripts\\scratch\\caregiving_cols.txt", "w", encoding="utf-8-sig") as f:
    f.write("Columns:\n")
    for c in df.columns:
        f.write(f"  - {c}\n")
