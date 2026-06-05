path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_15.xls"

with open(path, "rb") as f:
    content = f.read()

# find first <tbody> and print <tr> elements
tbody_pos = content.find(b'<tbody>')
if tbody_pos == -1:
    tbody_pos = content.find(b'<tr')

if tbody_pos != -1:
    print(f"Printing 1500 bytes from tbody/tr start at {tbody_pos}:")
    print(content[tbody_pos:tbody_pos+2000])
else:
    print("No rows found")
