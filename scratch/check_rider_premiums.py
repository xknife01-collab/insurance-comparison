import os
import xlrd
import sys

sys.stdout.reconfigure(encoding='utf-8')
SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def main():
    filepath = os.path.join(SOURCE_DIR, 'file_38.xls')
    wb = xlrd.open_workbook(filepath, encoding_override="cp949")
    sheet = wb.sheet_by_index(0)
    
    current_product = None
    
    for r in range(7, sheet.nrows):
        comp = str(sheet.cell_value(r, 1)).strip()
        prod = str(sheet.cell_value(r, 2)).strip()
        
        if prod:
            current_product = prod
            is_main = True
        else:
            is_main = False
            
        col6 = str(sheet.cell_value(r, 6)).strip()
        col7 = str(sheet.cell_value(r, 7)).strip()
        
        if col6 or col7:
            print(f"Row {r:3d} (Product: {current_product}) | Type: {'Main' if is_main else 'Rider'} | Col6: '{col6}' | Col7: '{col7}'")

if __name__ == "__main__":
    main()
