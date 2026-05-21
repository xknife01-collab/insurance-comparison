import os

file = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_12.xls'

# Hardcoded hex sequences for CP949 keywords
# 납입기간: B3 B3 C0 D4 B1 E2 B0 A3
# 일시납: C0 CF BD C3 B3 B3
# 년납: B3 E2 B3 B3
# 보험료: BA B8 C7 E8 B1 E1

keywords = {
    'NAP_IP_GI_GAN': b'\xb3\xb3\xc0\xd4\xb1\xe2\xb0\xa3',
    'IL_SI_NAP': b'\xc0\xcf\xbd\xc3\xb3\xb3',
    'NYEON_NAP': b'\xb3\xe2\xb3\xb3',
    'BO_HEOM_RYO': b'\xba\xb8\xc7\xe8\xb1\xe1'
}

with open(file, 'rb') as f:
    data = f.read()
    print(f"--- Hex Escape Binary Search for {os.path.basename(file)} ---")
    for name, pattern in keywords.items():
        pos = data.find(pattern)
        if pos != -1:
            print(f"MATCH FOUND: {name} at position {pos}")
            # Try to show what's around it in HEX to avoid encoding issues
            snippet = data[pos:pos+50]
            print(f"Snippet (Hex): {snippet.hex(' ')}")
        else:
            print(f"NOT FOUND: {name}")
