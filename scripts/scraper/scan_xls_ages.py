
import pandas as pd
import glob
import os
import re
import xlrd

def get_age_from_text(df):
    for i in range(min(50, len(df))):
        row_str = " ".join(map(str, df.iloc[i].values))
        match = re.search(r'([0-9]{1,2})세', row_str)
        if match: return int(match.group(1))
    return None

def get_age_from_sheet(sheet):
    for i in range(min(50, sheet.nrows)):
        row_str = " ".join(map(str, sheet.row_values(i)))
        match = re.search(r'([0-9]{1,2})세', row_str)
        if match: return int(match.group(1))
    return None

def scan():
    files = glob.glob("scripts/scraper/raw_data/*.xls")
    report = []
    for f in files:
        filename = os.path.basename(f)
        try:
            # Try HTML first
            tables = pd.read_html(f)
            df = tables[0]
            age = get_age_from_text(df)
            report.append({"file": filename, "type": "HTML", "age": age, "rows": len(df)})
        except:
            try:
                # Try Binary
                rb = xlrd.open_workbook(f)
                s = rb.sheet_by_index(0)
                age = get_age_from_sheet(s)
                report.append({"file": filename, "type": "BIFF8", "age": age, "rows": s.nrows})
            except Exception as e:
                report.append({"file": filename, "type": "ERROR", "msg": str(e)})
    
    for r in report:
        print(r)

if __name__ == "__main__":
    scan()
