import os
import hashlib

dir_path = "C:/Users/zkfnt/Desktop/insurance-comparison-main"
files = ['file_47.xls', '장기보장성 비교 공시 (7).xls']

for f in files:
    path = os.path.join(dir_path, f)
    if os.path.exists(path):
        size = os.path.getsize(path)
        with open(path, 'rb') as fp:
            data = fp.read()
            md5 = hashlib.md5(data).hexdigest()
        print(f"{f}: Size={size}, MD5={md5}")
    else:
        print(f"{f} does not exist at {path}!")
