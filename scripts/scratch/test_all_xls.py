import os
import io
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def test_all():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total .xls files in directory: {len(files)}")
    
    results = []
    for idx, filename in enumerate(sorted(files)):
        filepath = os.path.join(SOURCE_DIR, filename)
        is_html = False
        try:
            with open(filepath, 'rb') as f:
                content = f.read(2000)
            if b'<table' in content.lower() or b'<html' in content.lower():
                is_html = True
        except Exception as e:
            print(f"Error checking file type for {filename}: {e}")
            
        df = None
        method = ""
        error_msg = ""
        
        if not is_html:
            try:
                df = pd.read_excel(filepath, engine='xlrd', header=None)
                method = "xlrd (binary)"
            except Exception as e:
                error_msg = str(e)
        
        if df is None:
            # Try HTML parsing
            for enc in ['cp949', 'euc-kr', 'utf-8']:
                try:
                    with open(filepath, 'rb') as f:
                        raw_bytes = f.read()
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                        if frames:
                            df = frames[0]
                            method = f"html ({enc})"
                            error_msg = ""
                            break
                except Exception as e:
                    error_msg = f"{enc} failed: {e}"
                    
        status = "OK" if df is not None else f"FAILED: {error_msg}"
        rows = len(df) if df is not None else 0
        cols = len(df.columns) if df is not None else 0
        
        # Search count for keywords "변액", "정기"
        keyword_rows = 0
        if df is not None:
            cleaned_df = df.map(lambda v: str(v).strip() if pd.notna(v) else "")
            for i in range(len(cleaned_df)):
                row_list = cleaned_df.iloc[i].tolist()
                row_str = " ".join(row_list)
                if any(k in row_str for k in ["변액", "정기"]):
                    keyword_rows += 1
                    
        results.append({
            "filename": filename,
            "is_html": is_html,
            "method": method,
            "status": status,
            "rows": rows,
            "cols": cols,
            "keyword_rows": keyword_rows
        })
        
    print("\n--- TEST SUMMARY ---")
    failed_count = 0
    for r in results:
        if r["status"] != "OK":
            print(f"FAILED: {r['filename']} | {r['status']}")
            failed_count += 1
        else:
            print(f"OK: {r['filename']} | Type: {r['method']} | Shape: ({r['rows']}, {r['cols']}) | KeyRows: {r['keyword_rows']}")
            
    print(f"\nTotal: {len(results)}, Failed: {failed_count}")

if __name__ == "__main__":
    test_all()
