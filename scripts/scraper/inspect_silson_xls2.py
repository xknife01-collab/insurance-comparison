import pandas as pd
import io, os, sys
sys.stdout.reconfigure(encoding='utf-8')

BASE = r'c:\Users\zkfnt\Desktop\insurance-comparison-main'

# 실손 관련 xls 파일들 직접 raw 확인
xls_files = [f for f in os.listdir(BASE) if '실손' in f and f.endswith('.xls')]
print(f"실손 XLS 파일 목록: {xls_files}")

for fname in xls_files[:2]:  # 처음 2개만
    fpath = os.path.join(BASE, fname)
    print(f"\n{'='*60}")
    print(f"파일: {fname}")
    print('='*60)
    try:
        df = pd.read_excel(fpath, engine='xlrd', header=None)
        print(f"크기: {df.shape}")
        # 헤더처럼 보이는 행 찾기 (상품명이나 보험사 포함)
        for i in range(min(25, len(df))):
            row = df.iloc[i].tolist()
            row_str = [str(v)[:20] for v in row if str(v).strip() not in ['', 'nan', 'None']]
            if row_str:
                print(f"  Row {i:2d}: {row_str[:15]}")
    except Exception as e:
        raw = open(fpath, 'rb').read()
        for enc in ['cp949', 'euc-kr', 'utf-8']:
            try:
                text = raw.decode(enc)
                if '<table' in text.lower():
                    frames = pd.read_html(io.StringIO(text), flavor='bs4')
                    if frames:
                        df = frames[0]
                        print(f"[HTML-in-XLS] 크기: {df.shape}")
                        for i in range(min(20, len(df))):
                            row = df.iloc[i].tolist()
                            print(f"  Row {i:2d}: {[str(v)[:20] for v in row[:15]]}")
                        break
            except: continue
