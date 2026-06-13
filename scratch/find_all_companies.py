import pandas as pd
df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")
unique_cos = [str(x).replace(" ", "").strip() for x in df['보험회사'].unique() if pd.notna(x)]
with open("scratch/unique_companies.txt", "w", encoding="utf-8") as f:
    for co in unique_cos:
        f.write(f"{co}\n")
print("Wrote to scratch/unique_companies.txt")
