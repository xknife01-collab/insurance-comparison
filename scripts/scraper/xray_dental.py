import pandas as pd
import io
import re

def debug_dental():
    try:
        f = 'scripts/scraper/raw_data/file_27.xls'
        raw_bytes = open(f, 'rb').read()
        raw_clean = raw_bytes.decode('utf-8', errors='ignore')
        frames = pd.read_html(io.StringIO(raw_clean))
        df = frames[0]
        
        print(f"[*] Frames found: {len(frames)}")
        print(f"[*] FIRST 20 ROWS SCAN:")
        for i, row in df.iloc[270:280].iterrows():
            rv = [str(x) for x in row.values]
            line = " | ".join(rv)
            print(f"Row {i}: {line}")
            
            # 여기서 '치아'라는 글자가 실제로 포함되어 있는지 체크
            if '치아' in line:
                print(f"  [FOUND '치아' at Row {i}]")
            else:
                # 깨진 글자 패턴 분석용
                print(f"  ['치아' NOT FOUND in raw string: {repr(line[:100])}]")

    except Exception as e:
        print(f"ERR: {e}")

if __name__ == "__main__":
    debug_dental()
