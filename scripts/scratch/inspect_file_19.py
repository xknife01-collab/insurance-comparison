with open("scripts/scratch/check_variable_term_cycles_results.txt", "r", encoding="utf-8-sig") as f:
    text = f.read()

# Let's find file_19.xls part
start = text.find("File: file_19.xls")
if start != -1:
    print(text[start:start+1200])
