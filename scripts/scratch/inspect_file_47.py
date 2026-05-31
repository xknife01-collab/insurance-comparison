import pandas as pd
import os
import io

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
filename = "file_47.xls"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception:
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['cp949', 'euc-kr', 'utf-8']:
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
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def run():
    df = load_df(os.path.join(SOURCE_DIR, filename))
    if df is None:
        print("Failed")
        return
        
    # Let's inspect the riders in file_47.xls
    riders = [clean_val(v) for v in df.iloc[:, 3].dropna().unique()]
    
    with open("c:\\Users\\zkfnt\\Desktop\\insurance-comparison-main\\insurance-comparison-main\\scripts\\scratch\\file_47_riders.txt", "w", encoding="utf-8") as f:
        f.write("Riders in file_47.xls:\n")
        for r in riders:
            f.write(f"  - {r}\n")

if __name__ == "__main__":
    run()
