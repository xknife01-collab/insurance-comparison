import os

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
filepath = os.path.join(SOURCE_DIR, "file_1.xls")

with open(filepath, 'rb') as f:
    raw_bytes = f.read()

# Let's try decoding with UTF-8
text_utf8 = raw_bytes.decode('utf-8', errors='replace')
print("Is '연납' in UTF-8 decoded text?", "연납" in text_utf8)
print("Is '월납' in UTF-8 decoded text?", "월납" in text_utf8)
print("Is '일시납' in UTF-8 decoded text?", "일시납" in text_utf8)

# Let's search for "주기"
pos = text_utf8.find("주기")
if pos != -1:
    print("Found '주기' at pos. Context:")
    print(text_utf8[pos:pos+100])
else:
    # Let's find "5."
    pos_5 = text_utf8.find("5.")
    if pos_5 != -1:
        print("Found '5.' at pos. Context:")
        print(text_utf8[pos_5:pos_5+100])
