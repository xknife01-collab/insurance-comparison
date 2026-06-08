import pandas as pd
import io

# 가장 최신 실손 엑셀 파일 하나 직접 확인
import os, sys
sys.stdout.reconfigure(encoding='utf-8')

files = [
    r'c:\Users\zkfnt\Desktop\insurance-comparison-main\실손보험료 비교.xls',
    r'c:\Users\zkfnt\Desktop\insurance-comparison-main\실손보험료 비교 (1).xls',
    r'c:\Users\zkfnt\Desktop\insurance-comparison-main\실손보험료_비교_20260608162243713.xls',
]

for fpath in files:
    if not os.path.exists(fpath):
        continue
    print(f"\n{'='*60}")
    print(f"파일: {os.path.basename(fpath)}")
    print('='*60)
    try:
        df = pd.read_excel(fpath, engine='xlrd', header=None)
        # 처음 30행 모두 출력 (헤더 구조 파악)
        for i in range(min(30, len(df))):
            row = df.iloc[i].tolist()
            non_empty = [(j, str(v)[:30]) for j, v in enumerate(row) if str(v).strip() not in ['', 'nan', 'None']]
            if non_empty:
                print(f"  Row {i:2d}: {non_empty}")
        break
    except Exception as e:
        try:
            raw = open(fpath, 'rb').read()
            for enc in ['cp949', 'euc-kr', 'utf-8']:
                try:
                    text = raw.decode(enc)
                    if '<table' in text.lower():
                        frames = pd.read_html(io.StringIO(text), flavor='bs4')
                        if frames:
                            df = frames[0]
                            print("HTML-in-XLS 형태")
                            for i in range(min(20, len(df))):
                                row = df.iloc[i].tolist()
                                print(f"  Row {i:2d}: {row[:12]}")
                            break
                except: continue
        except Exception as e2:
            print(f"  ERROR: {e2}")
