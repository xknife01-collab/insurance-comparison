import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_38.xls"
for enc in [None, 'cp949', 'euc-kr', 'utf-8', 'utf-16-le', 'latin1']:
    try:
        wb = xlrd.open_workbook(path, encoding_override=enc)
        sheet = wb.sheet_by_index(0)
        print(f"Override: {enc}")
        print(f"  Row 7 cell 1: {repr(sheet.cell_value(7, 1))}")
        print(f"  Row 7 cell 2: {repr(sheet.cell_value(7, 2))}")
    except Exception as e:
        print(f"Override {enc} failed: {e}")
