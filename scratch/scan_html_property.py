import os
import io
import pandas as pd
import sys
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
KEYWORDS = ["재물", "화재", "성공메이트", "우리집", "비즈", "안전", "홈가드", "하우스", "재산종합"]

def load_html_df(filepath):
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

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    html_files = []
    for f in sorted(files):
        filepath = os.path.join(SOURCE_DIR, f)
        try:
            with open(filepath, 'rb') as file_obj:
                head = file_obj.read(100)
                if b'<table' in head.lower() or b'<html' in head.lower():
                    html_files.append(f)
        except Exception:
            pass
            
    print(f"Total HTML files to scan: {len(html_files)}")
    
    found_any = False
    for hf in html_files:
        filepath = os.path.join(SOURCE_DIR, hf)
        df = load_html_df(filepath)
        if df is not None:
            text = df.values.flatten()
            combined_text = " ".join(str(v) for v in text)
            matches = [kw for kw in KEYWORDS if kw in combined_text]
            if matches:
                print(f"File: {hf} matched keywords: {matches}")
                found_any = True
                
    if not found_any:
        print("No HTML files matched property keywords.")

if __name__ == "__main__":
    main()
