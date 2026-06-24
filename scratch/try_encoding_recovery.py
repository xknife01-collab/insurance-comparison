import os

# Test string from the UTF-16 decoded diff
test_str = "DB?해보험"

# Let's try representing the characters as bytes and decoding them.
# The corruption '?' represents some byte sequence. 
# Let's print the unicode code points of test_str
print("Chars and code points:")
for c in test_str:
    print(f"'{c}': {ord(c):#x} ({c.encode('utf-8', 'replace')})")

# Let's try decoding/encoding combinations
encodings = ['utf-8', 'cp949', 'euc-kr', 'latin-1', 'utf-16le']

print("\nTrying to recover 'DB?해보험':")
# We'll try to encode back to bytes using different encodings and then decode
# '?' -> in the raw UTF-16 diff it was Decoded as UTF-16: 0 replacement characters
# Let's read the raw bytes of diff_perpolicy.txt
file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\diff_perpolicy.txt"
if os.path.exists(file_path):
    with open(file_path, "rb") as f:
        raw_bytes = f.read()
    
    print(f"Raw bytes length: {len(raw_bytes)}")
    # Let's try decoding the raw bytes of the file directly with different encodings
    for enc in ['utf-8', 'cp949', 'euc-kr', 'utf-16', 'utf-16le']:
        try:
            decoded = raw_bytes.decode(enc)
            repl = decoded.count("\ufffd")
            print(f"Direct decode with '{enc}': {repl} replacement chars. Sample:")
            # Find a line with COMPANIES or detectType in decoded
            for line in decoded.splitlines():
                if "COMPANIES" in line or "detectType" in line:
                    print("  ", repr(line[:100]))
        except Exception as e:
            print(f"Direct decode with '{enc}' failed: {e}")
