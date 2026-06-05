import pandas as pd

# Read CSV with utf-8-sig
df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv', encoding='utf-8')

results = []
results.append(f"Total rows in CSV: {len(df)}")

# Let's count matches for Korean words
for word in ["연납", "월납", "일시납"]:
    count = 0
    for col in df.columns:
        count += df[col].astype(str).str.contains(word).sum()
    results.append(f"Keyword '{word}' count: {count}")

# Find some examples of rows containing '연납'
annual_rows = []
for idx, row in df.iterrows():
    row_str = " ".join([str(val) for val in row.values if pd.notna(val)])
    if "연납" in row_str:
        annual_rows.append(row)

results.append(f"\nFound {len(annual_rows)} rows containing '연납'")
for r in annual_rows[:10]:
    results.append(f"- {r['상품명']} | Premium: {r['기준보험료']} | File: {r['source_file']}")

# Write to file
with open('scratch/true_text_results.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(results))

print("Results written to scratch/true_text_results.txt")
