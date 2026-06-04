import pandas as pd
import os
import sys

dir_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
out_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\inspect_out.txt"

with open(out_path, 'w', encoding='utf-8') as out_f:
    for filename in ["file_11.xls", "file_19.xls", "file_21.xls", "file_29.xls"]:
        full_path = os.path.join(dir_path, filename)
        out_f.write(f"\n=================== INSPECTING {filename} ===================\n")
        try:
            # Read HTML tables
            tables = pd.read_html(full_path, encoding='utf-8')
            out_f.write(f"Number of tables found: {len(tables)}\n")
            for idx, df in enumerate(tables):
                out_f.write(f"\nTable {idx} shape: {df.shape}\n")
                out_f.write("Columns: " + str(list(df.columns)) + "\n")
                out_f.write(df.head(5).to_string() + "\n")
        except Exception as e:
            out_f.write(f"Error inspecting {filename}: {str(e)}\n")

print("Saved inspection output to inspect_out.txt")
