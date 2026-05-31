import pandas as pd
import io

file_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_10.xls"

def run():
    try:
        df = pd.read_excel(file_path, engine='xlrd', header=None)
    except:
        with open(file_path, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['cp949', 'euc-kr', 'utf-8']:
            try:
                raw_text = raw_bytes.decode(enc)
                if '<table' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    df = frames[0]
                    break
            except:
                continue

    # Let's find rows with "하나로H종신보험"
    for i, row in df.iterrows():
        row_vals = [str(v) for v in row.tolist()]
        if any("하나로H종신보험" in val for val in row_vals):
            print(f"Row {i} product: {row_vals[1]}")
            print(f"Col 7 (기준보험료): {row_vals[7]}")
            print(f"Col 8 (가입보험료): {row_vals[8]}")
            print(f"Col 26 (상세안내): {row_vals[26]}")
            print("-" * 50)

if __name__ == "__main__":
    run()
