import pandas as pd
import glob
import os
import io

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def run():
    files = glob.glob(os.path.join(SOURCE_DIR, "*.xls"))
    
    for f in sorted(files)[:15]:
        df = None
        try:
            df = pd.read_excel(f, engine='xlrd', header=None)
        except Exception:
            try:
                with open(f, 'rb') as file_obj:
                    raw_bytes = file_obj.read()
                for enc in ['cp949', 'euc-kr', 'utf-8']:
                    try:
                        raw_text = raw_bytes.decode(enc)
                        if '<table' in raw_text.lower():
                            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                            df = frames[0]
                            break
                    except:
                        continue
            except Exception:
                pass
                
        if df is None:
            continue
            
        # Search for header row
        for i in range(min(15, len(df))):
            row = [str(v).replace(" ", "").replace("\n", "") for v in df.iloc[i].tolist()]
            if any("상품명" in val or "보험사" in val for val in row):
                print(f"\nFile: {os.path.basename(f)} (Row {i})")
                print(f"Header: {row[:15]}")
                break

if __name__ == "__main__":
    run()
