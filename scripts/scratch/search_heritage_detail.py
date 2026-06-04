import csv

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

with open("scripts/scratch/heritage_detail_notes.txt", "w", encoding="utf-8") as f_out:
    for idx, row in enumerate(rows):
        if "헤리티지 변액정기보험" in row[1]:
            f_out.write(f"Row {idx}: {row[1]} | {row[2]} | {row[7]} (male) | {row[8]} (female)\n")
            # find notes or standard guidance column
            for col_idx, col_name in enumerate(headers):
                if row[col_idx]:
                    f_out.write(f"  {col_name}: {row[col_idx]}\n")
            f_out.write("\n")
