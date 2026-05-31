import pandas as pd
import warnings

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv"
df = pd.read_csv(filepath)

# Let's see some rows that contain "남" or "여" in any column, or print the first 20 rows
print("Columns:", list(df.columns[:20]))

# Search for any row mentioning 남성/여성/남자/여자 in standard columns
gender_rows = []
for idx, row in df.iterrows():
    row_str = " | ".join([str(v) for v in row.iloc[:16].tolist() if not pd.isna(v)])
    if any(kw in row_str for kw in ["남", "여"]):
        gender_rows.append((idx, row_str))

print(f"\nTotal gender-mentioning rows: {len(gender_rows)}")
for idx, r in gender_rows[:15]:
    print(f"Row {idx}: {r}")
