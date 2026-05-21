import pandas as pd
import os

csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\extracted_data.csv'
excel_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\뇌보험_담보_통합.xlsx'

def main():
    if not os.path.exists(csv_path):
        print("CSV file not found.")
        return

    df = pd.read_csv(csv_path)
    
    # Sort or clean if needed
    # For now, just save to Excel
    
    try:
        with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='뇌보험담보')
            # ... existing formatting logic ...
            workbook = writer.book
            worksheet = writer.sheets['뇌보험담보']
            try:
                for i, col in enumerate(df.columns):
                    max_len = len(col)
                    for val in df[col]:
                        s_val = str(val) if pd.notna(val) else ""
                        if len(s_val) > max_len: max_len = len(s_val)
                    column_len = min(max_len + 2, 50)
                    col_letter = chr(65 + (i % 26))
                    if i >= 26: col_letter = chr(65 + (i // 26) - 1) + chr(65 + (i % 26))
                    worksheet.column_dimensions[col_letter].width = column_len
            except: pass
        print(f"Excel file created: {excel_path}")
    except PermissionError:
        alt_path = excel_path.replace(".xlsx", "_new.xlsx")
        print(f"Warning: {excel_path} is open. Saving to {alt_path}")
        df.to_excel(alt_path, index=False)
        print(f"Excel file created: {alt_path}")

if __name__ == "__main__":
    main()
