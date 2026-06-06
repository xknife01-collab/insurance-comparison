import os
import xlrd
import sys
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def main():
    filepath = os.path.join(SOURCE_DIR, 'file_38.xls')
    wb = xlrd.open_workbook(filepath, encoding_override="cp949")
    sheet = wb.sheet_by_index(0)
    
    current_company = None
    current_product = None
    start_row = None
    
    product_list = []
    
    for r in range(7, sheet.nrows):
        company = str(sheet.cell_value(r, 1)).strip()
        product = str(sheet.cell_value(r, 2)).strip()
        
        # If company or product is not empty, it starts a new product
        if company or product:
            if current_product is not None:
                # Save previous product
                product_list.append({
                    "company": current_company,
                    "product": current_product,
                    "start": start_row,
                    "end": r - 1
                })
            current_company = company if company else current_company
            current_product = product
            start_row = r
            
    # Save last product
    if current_product is not None:
        product_list.append({
            "company": current_company,
            "product": current_product,
            "start": start_row,
            "end": sheet.nrows - 1
        })
        
    print(f"Found {len(product_list)} products in file_38.xls:")
    for idx, p in enumerate(product_list):
        print(f"Product {idx+1:2d}: Company: {p['company']:<10} | Start: {p['start']:3d} | End: {p['end']:3d} | Product: {p['product']}")

if __name__ == "__main__":
    main()
