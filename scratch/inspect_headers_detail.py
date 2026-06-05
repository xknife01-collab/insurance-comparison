import io
import pandas as pd
import warnings
import xlrd

warnings.filterwarnings('ignore')

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data)
    except Exception:
        try:
            return pd.read_excel(filepath, engine='xlrd', header=None)
        except Exception:
            try:
                with open(filepath, 'rb') as f:
                    raw_bytes = f.read()
                for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-16']:
                    try:
                        raw_text = raw_bytes.decode(enc)
                        if '<table' in raw_text.lower():
                            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                            if frames:
                                return frames[0]
                    except Exception:
                        continue
            except Exception:
                pass
    return None

def clean_val(v):
    if pd.isna(v) or v is None: return ""
    return str(v).replace('\n', ' ').strip()

def main():
    with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\headers_detail.txt", "w", encoding="utf-8") as f_out:
        for f in [r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_15.xls", 
                  r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"]:
            f_out.write(f"\n=== HEADERS FOR {f} ===\n")
            df = load_df(f)
            if df is not None:
                for idx, row in df.iloc[:15].iterrows():
                    row_str = " | ".join([clean_val(v) for v in row.tolist()])
                    f_out.write(f"Row {idx}: {row_str}\n")
            else:
                f_out.write("Failed to load\n")

if __name__ == "__main__":
    main()
