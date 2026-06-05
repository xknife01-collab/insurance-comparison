import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_39.xls"
wb = xlrd.open_workbook(path)
sheet = wb.sheet_by_index(0)

val = sheet.cell(114, 1).value
prod = sheet.cell(114, 2).value
cov = sheet.cell(114, 3).value
desc = sheet.cell(114, 4).value

output = f"Company: {val}\nProduct: {prod}\nCoverage: {cov}\nDescription: {desc}\n"

with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\inspect_raw_text_output.txt", "w", encoding="utf-8") as f:
    f.write(output)

print("Written successfully!")
