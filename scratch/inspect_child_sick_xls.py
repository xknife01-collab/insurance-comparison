import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\보장성_상품비교_20260608162045373.xls"

def run():
    try:
        df = pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['cp949', 'euc-kr', 'utf-8']:
            try:
                raw_text = raw_bytes.decode(enc)
                if '<table' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        df = frames[0]
                        break
            except Exception:
                continue
                
    out_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\child_xls_content.txt'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(f"Total rows: {len(df)}\n")
        # Let's write the first 100 rows to inspect
        for idx in range(min(300, len(df))):
            row = [str(val).replace('\n', ' ') for val in df.iloc[idx].tolist()]
            f.write(f"Row {idx:03d}: {' | '.join(row[:15])}\n")

if __name__ == '__main__':
    run()
