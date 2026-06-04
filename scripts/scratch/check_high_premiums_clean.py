import csv

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

high_premium_rows = []
for idx, row in enumerate(rows):
    premium_str = row[7] # 기준보험료
    try:
        clean_prem = int(premium_str.replace("원", "").replace(",", "").replace(" ", ""))
    except ValueError:
        continue
        
    if clean_prem >= 100000:
        high_premium_rows.append((idx, clean_prem, row))

with open("scripts/scratch/high_premiums_analysis.txt", "w", encoding="utf-8") as f_out:
    f_out.write(f"Total rows with premium >= 10만원: {len(high_premium_rows)}\n\n")
    for idx, prem, row in high_premium_rows:
        company = row[0]
        product_name = row[1]
        gubun = row[2]
        amt = row[6]
        m_prem = row[7]
        f_prem = row[8]
        source = row[10] # source_file
        
        # Let's inspect the entire row for "연납" vs "월납"
        row_str = " | ".join([c for c in row if c])
        is_annual = "연납" in row_str
        is_monthly = "월납" in row_str
        
        f_out.write(f"Row {idx} | {company} | {product_name} | Premium: {m_prem} (Male) / {f_prem} (Female) | Amt: {amt} | Source: {source}\n")
        f_out.write(f"  Detected: {'ANNUAL (연납)' if is_annual else 'MONTHLY (월납)' if is_monthly else 'UNKNOWN'}\n")
        
        # Write any columns containing cycle info
        cycle_info = [col for col in row if any(k in col for k in ["연납", "월납", "납입주기", "주기"])]
        if cycle_info:
            f_out.write(f"  Cycle Note: {cycle_info[0][:200]}...\n")
        f_out.write("-" * 80 + "\n")
