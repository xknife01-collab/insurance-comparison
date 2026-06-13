import os
import xlrd
import pandas as pd
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]

for filename in sorted(files):
    if not ("보장성_상품비교" in filename or "변액_보장성" in filename):
        continue
    filepath = os.path.join(SOURCE_DIR, filename)
    try:
        book = xlrd.open_workbook(filepath, logfile=open(os.devnull, 'w'))
        sheet = book.sheet_by_index(0)
        for rx in range(sheet.nrows):
            row = [clean_cell(sheet.cell_value(rx, cx)) for cx in range(sheet.ncols)]
            pname = row[1]
            if "흥국생명 온라인정기보험_2종" in pname:
                print(f"=== {pname} ===")
                print(f"  Col 5 (지급금액): {row[5]}")
                print(f"  Col 6 (가입금액): {row[6]}")
                print(f"  Col 7 (기준보험료): {row[7]}")
                print(f"  Col 8 (가입보험료): {row[8]}")
                print(f"  Col 28 (상세안내): {row[28]}")
    except Exception:
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['utf-8', 'cp949', 'euc-kr']:
                try:
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                        if frames:
                            df = frames[0]
                            for rx, r in df.iterrows():
                                r_list = [str(v).strip() for v in r.tolist()]
                                pname = r_list[1]
                                if "흥국생명 온라인정기보험_2종" in pname:
                                    print(f"=== {pname} ===")
                                    print(f"  Col 5 (지급금액): {r_list[5]}")
                                    print(f"  Col 6 (가입금액): {r_list[6]}")
                                    print(f"  Col 7 (기준보험료): {r_list[7]}")
                                    print(f"  Col 8 (가입보험료): {r_list[8]}")
                                    print(f"  Col 28 (상세안내): {r_list[28]}")
                            break
                except Exception:
                    continue
        except Exception:
            pass
