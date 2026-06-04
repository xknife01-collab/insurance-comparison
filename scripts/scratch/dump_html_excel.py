import os
import pandas as pd
import io

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_53.xls"

def main():
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    for enc in ['utf-8', 'cp949', 'euc-kr']:
        try:
            raw_text = raw_bytes.decode(enc, errors='replace')
            if '<table' in raw_text.lower():
                frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                if frames:
                    df = frames[0]
                    print(f"Loaded successfully with {enc}. Shape: {df.shape}")
                    with open("file_53_dump.txt", "w", encoding="utf-8") as out:
                        for r in range(min(15, len(df))):
                            row_vals = df.iloc[r].tolist()
                            out.write(f"Row {r}: {row_vals}\n")
                    return
        except Exception as e:
            print(f"Failed with {enc}: {e}")

if __name__ == "__main__":
    main()
