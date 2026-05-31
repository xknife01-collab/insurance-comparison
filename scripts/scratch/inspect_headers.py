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

    # Find the header row (contains "보험사" or "상품명" or "보험료")
    for i in range(20):
        row_vals = [str(v) for v in df.iloc[i].tolist()]
        if any("상품명" in val or "보험료" in val for val in row_vals):
            print(f"Header Row {i}: {row_vals}")
            if i + 1 < len(df):
                print(f"Sub-header Row {i+1}: {[str(v) for v in df.iloc[i+1].tolist()]}")
            break

if __name__ == "__main__":
    run()
