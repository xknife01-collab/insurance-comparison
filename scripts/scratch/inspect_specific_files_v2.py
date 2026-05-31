import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

def inspect_file(filepath):
    print(f"=== Inspecting {filepath} ===")
    
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    
    # Try decoding with errors='replace' for different encodings
    for enc in ['utf-8', 'cp949', 'euc-kr']:
        try:
            raw_text = raw_bytes.decode(enc, errors='replace')
            if '<table' in raw_text.lower():
                frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                if frames:
                    print(f"Loaded as HTML with encoding {enc} (errors='replace'). First 2 rows:")
                    df = frames[0]
                    for idx, row in df.head(2).iterrows():
                        row_clean = [str(x)[:60] for x in row.tolist()]
                        print(row_clean)
        except Exception as e:
            print(f"HTML parsing with {enc} failed:", e)

if __name__ == "__main__":
    inspect_file(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_36.xls")
