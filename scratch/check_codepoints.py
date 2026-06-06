import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_38.xls"
wb = xlrd.open_workbook(path)
sheet = wb.sheet_by_index(0)

c1 = sheet.cell(7, 1).value
c2 = sheet.cell(7, 2).value

print("Cell 1 string:", c1)
print("Cell 1 codepoints:", [ord(char) for char in c1])
print("Cell 2 string:", c2)
print("Cell 2 codepoints:", [ord(char) for char in c2])
