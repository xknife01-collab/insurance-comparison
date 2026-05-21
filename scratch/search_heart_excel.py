import os
import pandas as pd
import warnings

# Suppress warnings from reading old xls files
warnings.filterwarnings("ignore")

search_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
keyword = "심장"

excel_files = []
for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith((".xlsx", ".xls")):
            excel_files.append(os.path.join(root, file))

results = []
for file_path in excel_files:
    try:
        # For .xls files, we might need xlrd. For .xlsx, openpyxl.
        # pandas read_excel handles both if engines are present.
        df_dict = pd.read_excel(file_path, sheet_name=None)
        for sheet_name, df in df_dict.items():
            # Search all columns and rows for the keyword
            mask = df.apply(lambda x: x.astype(str).str.contains(keyword)).any(axis=None)
            if mask:
                results.append(f"Found '{keyword}' in File: {file_path}, Sheet: {sheet_name}")
    except Exception as e:
        results.append(f"Error reading {file_path}: {e}")

if not results:
    print(f"No files containing '{keyword}' were found.")
else:
    for res in results:
        print(res)
