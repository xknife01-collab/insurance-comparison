
import xlrd
import glob
import os
import re

def verify():
    files = glob.glob("scripts/scraper/raw_data/*실손*.xls")
    for f in files:
        try:
            rb = xlrd.open_workbook(f)
            s = rb.sheet_by_index(0)
            comp = s.row_values(7)[1]
            prod = s.row_values(7)[2]
            m = s.row_values(7)[6]
            f_val = s.row_values(7)[7]
            print(f"{os.path.basename(f)}: [{comp}] [{prod}] M={m}, F={f_val}")
        except:
            pass

if __name__ == "__main__":
    verify()
