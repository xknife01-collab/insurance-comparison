import pandas as pd
import io, os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

BASE = r'c:\Users\zkfnt\Desktop\insurance-comparison-main'

# 실손 XLS 파일 전체 컬럼 인덱스 확인
xls_files = [f for f in os.listdir(BASE) if '실손' in f and f.endswith('.xls')]
print(f"파일 목록: {xls_files}\n")

for fname in xls_files[:1]:
    fpath = os.path.join(BASE, fname)
    print(f"{'='*60}\n파일: {fname}\n{'='*60}")
    try:
        df = pd.read_excel(fpath, engine='xlrd', header=None)
        print(f"Shape: {df.shape}")
        print("\n[컬럼 인덱스 포함 Row 5~10]")
        for i in range(5, min(12, len(df))):
            row = df.iloc[i].tolist()
            print(f"Row {i}: {[(j, str(v)[:25]) for j, v in enumerate(row)]}")
    except Exception as e:
        raw = open(fpath, 'rb').read()
        for enc in ['cp949', 'euc-kr', 'utf-8']:
            try:
                text = raw.decode(enc)
                if '<table' in text.lower():
                    frames = pd.read_html(io.StringIO(text), flavor='bs4')
                    if frames:
                        df = frames[0]
                        print(f"[HTML-in-XLS] Shape: {df.shape}")
                        for i in range(5, min(12, len(df))):
                            row = df.iloc[i].tolist()
                            print(f"Row {i}: {[(j, str(v)[:25]) for j, v in enumerate(row)]}")
                        break
            except: continue
