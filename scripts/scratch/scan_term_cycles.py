import csv

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

print("=== CHECKING FOR ANY EXPLICIT ANNUAL/SINGLE CYCLE IN EXTRACTED DATA ===")
annual_count = 0
single_count = 0
monthly_count = 0
unknown_count = 0

for idx, row in enumerate(rows):
    row_str = " | ".join(row)
    # Check if this row is for a term product (not savings)
    sub_type = row[5] # sub_type
    if sub_type in ['term_pure', 'term_ceo', 'variable_term']:
        # Let's inspect the cycle info
        # Look for "납입주기" or similar note
        cycle_note = ""
        for col in row:
            if "납입주기" in col or "주기" in col:
                cycle_note = col
                break
        
        is_annual = "연납" in row_str
        is_single = "일시납" in row_str
        is_monthly = "월납" in row_str
        
        # Let's see if the row specifies something about "연납" being the main cycle for the premium
        if "연납" in row_str:
            annual_count += 1
        if "일시납" in row_str:
            single_count += 1
        if "월납" in row_str:
            monthly_count += 1

print(f"Total Term Rows: {len([r for r in rows if r[5] in ['term_pure', 'term_ceo', 'variable_term']])}")
print(f"Rows mentioning '연납': {annual_count}")
print(f"Rows mentioning '일시납': {single_count}")
print(f"Rows mentioning '월납': {monthly_count}")
