import pandas as pd
import os

root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
file42 = os.path.join(root_dir, "file_42.xls")
file49 = os.path.join(root_dir, "file_49.xls")

def inspect_file(filepath):
    print(f"\n================ Inspecting {os.path.basename(filepath)} ================")
    try:
        xl = pd.ExcelFile(filepath)
        print("Sheets:", xl.sheet_names)
        for sheet in xl.sheet_names[:2]:
            df = xl.parse(sheet, header=None)
            print(f"\nSheet '{sheet}' Shape: {df.shape}")
            # Print first 15 rows, limit columns to first 10
            print(df.iloc[:15, :min(df.shape[1], 10)].to_string())
    except Exception as e:
        print("Error:", e)

if os.path.exists(file42):
    inspect_file(file42)
if os.path.exists(file49):
    inspect_file(file49)
