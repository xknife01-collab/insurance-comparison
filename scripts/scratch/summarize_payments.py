import re

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\inspect_credit_payment.txt", 'r', encoding='utf-8') as f:
    text = f.read()

# Find all lines with "Values:"
val_lines = re.findall(r"Values: (\[.*\])", text)
for line in val_lines:
    try:
        row = eval(line)
        prod = row[1]
        desc = ""
        for item in row:
            if "납입" in str(item) or "납기" in str(item) or "주기" in str(item) or "일시납" in str(item) or "월납" in str(item):
                desc = str(item)
                break
        print(f"Product: {prod[:30]:<30} | Match: {desc[:100]}")
    except Exception as e:
        continue
