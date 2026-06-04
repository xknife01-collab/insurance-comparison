import csv

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

with open("scripts/scratch/search_file_19_csv_results.txt", "w", encoding="utf-8") as f_out:
    for idx, row in enumerate(rows):
        if "file_19.xls" in row:
            f_out.write(f"Row {idx}: {row}\n\n")
