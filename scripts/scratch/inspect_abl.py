import pandas as pd
import glob
import os

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def inspect():
    # Find files that contain ABL or ourWON
    files = glob.glob(os.path.join(SOURCE_DIR, "*.xls"))
    
    for f in sorted(files):
        df = None
        try:
            df = pd.read_excel(f, engine='xlrd', header=None)
        except Exception:
            try:
                import io
                with open(f, 'rb') as file_obj:
                    raw_bytes = file_obj.read()
                for enc in ['cp949', 'euc-kr', 'utf-8']:
                    try:
                        raw_text = raw_bytes.decode(enc)
                        if '<table' in raw_text.lower():
                            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                            if frames:
                                df = frames[0]
                                break
                    except:
                        continue
            except Exception:
                pass
        
        if df is None:
            continue
            
        # Check if "우리WON더드림종신보험" is in the sheet
        df_str = df.astype(str)
        if df_str.apply(lambda x: x.str.contains("우리WON더드림종신보험").any()).any():
            print(f"\nFound file: {os.path.basename(f)}")
            print("First 15 rows of raw data:")
            for i in range(min(15, len(df))):
                print(f"Row {i}: {df.iloc[i].dropna().tolist()}")
            break

if __name__ == "__main__":
    inspect()
