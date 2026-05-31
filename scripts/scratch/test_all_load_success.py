import os
import pandas as pd
import io

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception as e1:
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
                except Exception as e2:
                    continue
        except Exception as e3:
            pass
    return None

def run():
    files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith('.xls')]
    failed_files = []
    success_count = 0
    for f in files:
        filepath = os.path.join(SOURCE_DIR, f)
        df = load_df(filepath)
        if df is None:
            failed_files.append(f)
        else:
            success_count += 1
            
    print(f"Successfully loaded: {success_count} files")
    print(f"Failed to load: {len(failed_files)} files")
    if failed_files:
        print(f"Failed files list: {failed_files}")

if __name__ == "__main__":
    run()
