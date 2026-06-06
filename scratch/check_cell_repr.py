import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_38.xls"
try:
    wb = xlrd.open_workbook(path)
    print("Workbook encoding:", wb.encoding)
    sheet = wb.sheet_by_index(0)
    print("Row 5 cell 1 repr:", repr(sheet.cell_value(5, 1)))
    print("Row 7 cell 1 repr:", repr(sheet.cell_value(7, 1)))
    print("Row 7 cell 2 repr:", repr(sheet.cell_value(7, 2)))
    print("Row 7 cell 3 repr:", repr(sheet.cell_value(7, 3)))
    print("Row 7 cell 4 repr:", repr(sheet.cell_value(7, 4)))
except Exception as e:
    print("Error:", e)
