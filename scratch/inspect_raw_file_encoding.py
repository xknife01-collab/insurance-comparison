import os

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
filepath = os.path.join(SOURCE_DIR, "file_1.xls")

with open(filepath, 'rb') as f:
    raw_bytes = f.read()

print("File size:", len(raw_bytes))

# Try decoding with CP949
try:
    text_cp949 = raw_bytes.decode('cp949')
    print("CP949 Decode successful! First 500 chars:")
    print(text_cp949[:500])
except Exception as e:
    print("CP949 Decode failed:", e)

# Try decoding with UTF-8
try:
    text_utf8 = raw_bytes.decode('utf-8')
    print("UTF-8 Decode successful! First 500 chars:")
    print(text_utf8[:500])
except Exception as e:
    print("UTF-8 Decode failed:", e)
