import re

with open("c:\\Users\\zkfnt\\Desktop\\insurance-comparison-main\\insurance-comparison-main\\scripts\\scratch\\comprehensive_files.txt", "r", encoding="utf-8") as f:
    text = f.read()

files = re.findall(r"File:\s*(file_\d+\.xls)", text)
print(f"Total files: {len(files)}")
print(files)
