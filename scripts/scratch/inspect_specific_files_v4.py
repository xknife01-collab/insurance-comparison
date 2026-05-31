import pandas as pd
import xlrd
import io
import warnings

warnings.filterwarnings('ignore')

def inspect_file(filepath, out_path):
    with open(out_path, 'w', encoding='utf-8') as out_f:
        out_f.write(f"=== Inspecting {filepath} ===\n")
        
        # Try xlrd with cp949 override
        try:
            wb = xlrd.open_workbook(filepath, encoding_override='cp949')
            sheet = wb.sheet_by_index(0)
            out_f.write("\n--- Loaded with xlrd cp949 override ---\n")
            for r in range(min(10, sheet.nrows)):
                row_vals = [str(sheet.cell_value(r, c)) for c in range(sheet.ncols)]
                out_f.write(f"Row {r}: {row_vals}\n")
        except Exception as e:
            out_f.write(f"xlrd cp949 override failed: {e}\n")
            
        # Try xlrd default
        try:
            wb = xlrd.open_workbook(filepath)
            sheet = wb.sheet_by_index(0)
            out_f.write("\n--- Loaded with xlrd default ---\n")
            for r in range(min(10, sheet.nrows)):
                row_vals = [str(sheet.cell_value(r, c)) for c in range(sheet.ncols)]
                out_f.write(f"Row {r}: {row_vals}\n")
        except Exception as e:
            out_f.write(f"xlrd default failed: {e}\n")

if __name__ == "__main__":
    inspect_file(
        r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_35.xls",
        r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\file_35_inspect_out.txt"
    )
