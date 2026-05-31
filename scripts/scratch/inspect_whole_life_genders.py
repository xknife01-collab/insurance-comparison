import pandas as pd
import io

file_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_10.xls"

def run():
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
            
    # Print the first 2 rows which usually contains the headers
    print("Row 0:")
    print(df.iloc[0].tolist())
    print("\nRow 1:")
    print(df.iloc[1].tolist())

if __name__ == "__main__":
    run()
