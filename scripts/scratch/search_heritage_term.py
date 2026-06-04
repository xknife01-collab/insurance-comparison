import csv

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

with open("scripts/scratch/heritage_term_rows.txt", "w", encoding="utf-8") as f_out:
    for idx, row in enumerate(rows):
        if "헤리티지 정기보험" in row[1] or "헤리티지" in row[1]:
            f_out.write(f"Row {idx}: {row[0]} | {row[1]} | {row[2]} | {row[6]} | {row[7]} | {row[8]} | {row[27][:150]}\n\n")
