path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_15.xls"

with open(path, "rb") as f:
    content = f.read()

# Let's find table rows (<tr>) and look for cells (<td>)
# We can search for the term "상품명" or similar in binary
# "상품명" in UTF-8 is b'\xec\x83\x81\xed\x92\x88\xeb\xaa\x85'
pos = content.find(b'\xec\x83\x81\xed\x92\x88\xeb\xaa\x85')
if pos != -1:
    print(f"Found '상품명' at position {pos}")
    # print 2000 bytes around it
    print(content[pos-200:pos+1500])
else:
    print("'상품명' not found in binary")
