import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_39.xls"
wb = xlrd.open_workbook(path)
sheet = wb.sheet_by_index(0)

# Print row 114 (which is 0-indexed row 114)
print("Row 114 cells:")
for i in range(sheet.ncols):
    cell = sheet.cell(114, i)
    val = cell.value
    print(f"Col {i}: type={cell.ctype}, value={repr(val)}")
    if isinstance(val, str):
        # try to encode as latin-1 and decode as cp949
        try:
            print(f"  Attempt latin1->cp949: {val.encode('latin-1').decode('cp949')}")
        except Exception as e:
            pass
        try:
            print(f"  Attempt utf-8 bytes->cp949: {val.encode('utf-8').decode('cp949')}")
        except Exception as e:
            pass
