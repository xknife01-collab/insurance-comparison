import re

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\inspect_credit_payment.txt", 'r', encoding='utf-8') as f:
    text = f.read()

col_counts = re.findall(r"Col count: (\d+)", text)
print("Col counts:", set(col_counts))

companies = re.findall(r"Values: \['([^']+)'", text)
print("Companies:", set(companies))
