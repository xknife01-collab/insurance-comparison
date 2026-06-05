import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_39.xls"

for enc in ["cp949", "euc-kr", "utf-8", "latin-1"]:
    try:
        wb = xlrd.open_workbook(path, encoding_override=enc)
        sheet = wb.sheet_by_index(0)
        val = sheet.cell(114, 1).value
        print(f"Encoding override: {enc} -> Row 114, Col 1: {repr(val)}")
    except Exception as e:
        print(f"Encoding override: {enc} -> Failed: {e}")
