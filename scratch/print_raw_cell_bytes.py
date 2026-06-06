import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_38.xls"
wb = xlrd.open_workbook(path)
sheet = wb.sheet_by_index(0)

# Let's inspect cell (7, 1) and (7, 2)
c1 = sheet.cell(7, 1)
c2 = sheet.cell(7, 2)

print("Cell 1 Type:", c1.ctype)
print("Cell 1 Value:", repr(c1.value))
print("Cell 2 Type:", c2.ctype)
print("Cell 2 Value:", repr(c2.value))
