import os

dir_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = os.listdir(dir_path)
for f in files:
    if f.endswith('.xls'):
        # Print with cp949/utf-8 safety
        try:
            print(f)
        except Exception:
            print(repr(f))
