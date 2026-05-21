import os

file = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_12.xls'

# Try to find specific byte patterns for "납입기간", "일시납", "년납"
# 납입기간 in CP949: b'\xb3\xb3\xc0\xd4\xb1\xe2\xb0\xa3'
# 일시납 in CP949: b'\xc0\xcf\xbd\xc3\xb3\xb3'
# 년납 in CP949: b'\xb3\xe2\xb3\xb3'

keywords = {
    '납입기간': b'\xb3\xb3\xc0\xd4\xb1\xe2\xb0\xa3',
    '일시납': b'\xc0\xcf\xbd\xc3\xb3\xb3',
    '년납': b'\xb3\xe2\xb3\xb3',
    '보험료': b'\xba\xb8\xc7\xe8\xb1\xe1'
}

with open(file, 'rb') as f:
    data = f.read()
    print(f"--- Binary Search for {os.path.basename(file)} ---")
    for name, pattern in keywords.items():
        pos = data.find(pattern)
        if pos != -1:
            # Extract surrounding bytes (50 bytes before and after)
            snippet = data[max(0, pos-20):pos+80]
            try:
                decoded = snippet.decode('cp949', errors='replace')
                print(f"Found {name} at {pos}: ...{decoded}...")
            except:
                print(f"Found {name} at {pos} (Snippet decoding failed)")
        else:
            print(f"Keyword {name} NOT found in binary.")
