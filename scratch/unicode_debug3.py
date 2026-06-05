import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_39.xls"
wb = xlrd.open_workbook(path)
sheet = wb.sheet_by_index(0)
val = sheet.cell(114, 1).value

print(f"Length: {len(val)}")
for idx, char in enumerate(val):
    print(f"Char {idx}: {repr(char)} code={ord(char)}")
