import csv
import sys

# Force output to support UTF-8 characters on Windows terminal
sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

print("=== CHECKING FOR ANY EXPLICIT ANNUAL/SINGLE CYCLE IN EXTRACTED DATA ===")
term_rows = [row for row in rows if row[17] in ['term_pure', 'term_ceo', 'variable_term']]
print(f"Total Term Rows: {len(term_rows)}")

annual_count = 0
single_count = 0
monthly_count = 0

for idx, row in enumerate(term_rows):
    row_str = " | ".join(row)
    
    is_annual = "연납" in row_str
    is_single = "일시납" in row_str
    is_monthly = "월납" in row_str or "월보험료" in row_str
    
    if is_annual:
        annual_count += 1
    if is_single:
        single_count += 1
    if is_monthly:
        monthly_count += 1

print(f"Rows containing '연납': {annual_count}")
print(f"Rows containing '일시납': {single_count}")
print(f"Rows containing '월납': {monthly_count}")

# Print those containing "연납" to see if any are annual payments
print("\n=== ROWS CONTAINING '연납' ===")
for idx, row in enumerate(term_rows):
    row_str = " | ".join(row)
    if "연납" in row_str:
        print(f"Product: {row[1]} | Premium: {row[7]} (M) / {row[8]} (F) | Cycle note snippet:")
        # Find the column containing the cycle info
        for col in row:
            if "연납" in col or "납입주기" in col:
                print(f"  Note: {col[:150]}")
                break
        print("-" * 80)
