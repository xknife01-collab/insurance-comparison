import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

term_rows = [row for row in rows if row[17] in ['term_pure', 'term_ceo', 'variable_term']]

print("=== ROWS CONTAINING '일시납' ===")
for idx, row in enumerate(term_rows):
    row_str = " | ".join(row)
    if "일시납" in row_str:
        print(f"Product: {row[1]} | Premium: {row[7]} (M) / {row[8]} (F) | Cycle note snippet:")
        for col in row:
            if "일시납" in col or "납입주기" in col:
                print(f"  Note: {col[:150]}")
                break
        print("-" * 80)
