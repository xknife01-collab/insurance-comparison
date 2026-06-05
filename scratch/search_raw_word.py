import pandas as pd

df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv')

# Print columns
print("Columns:", list(df.columns))

# Let's count how many times "연납", "월납", "일시납" appear in the entire CSV
for word in ["연납", "월납", "일시납", "연", "월"]:
    count = 0
    for col in df.columns:
        count += df[col].astype(str).str.contains(word).sum()
    print(f"Word '{word}' count in CSV: {count}")

# Print a few rows that contain "연납" in any of their columns
matched_rows = []
for idx, row in df.iterrows():
    row_str = " ".join([str(val) for val in row.values if pd.notna(val)])
    if "연납" in row_str:
        matched_rows.append(row)
        if len(matched_rows) >= 5:
            break

print(f"\nFound {len(matched_rows)} rows containing '연납':")
for r in matched_rows:
    print(f"- {r['상품명']} | file: {r['source_file']}")
    # Print the specific column that has '연납'
    for col in df.columns:
        if "연납" in str(r[col]):
            print(f"  Col '{col}': {r[col]}")
