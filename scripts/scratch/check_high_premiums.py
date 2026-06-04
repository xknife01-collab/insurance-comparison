import csv

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

# Let's inspect rows where 기준보험료 is > 100000
high_premium_rows = []
for idx, row in enumerate(rows):
    premium_str = row[7] # 기준보험료
    try:
        # Clean premium string (e.g. "100000  원")
        clean_prem = int(premium_str.replace("원", "").replace(",", "").replace(" ", ""))
    except ValueError:
        continue
        
    if clean_prem >= 100000:
        high_premium_rows.append((idx, clean_prem, row))

print(f"Total rows with premium >= 10만원: {len(high_premium_rows)}")

# Let's print the details of the first 20 such rows
for idx, prem, row in high_premium_rows[:20]:
    product_name = row[1]
    company = row[0]
    source = row[11]
    # Let's print original row columns to check for '연납' or '월납'
    raw_text = " | ".join([col for col in row if col])
    print(f"Row {idx} | {company} | {product_name} | Premium: {prem} | Source: {source}")
    # Let's search if any column contains '연납', '월납', '납입주기'
    cycle_cols = [col for col in row if any(k in col for k in ["연납", "월납", "납입주기", "주기"])]
    if cycle_cols:
        print(f"  Cycle info: {cycle_cols}")
    else:
        print("  No direct cycle keywords found in row.")
    print("-" * 80)
