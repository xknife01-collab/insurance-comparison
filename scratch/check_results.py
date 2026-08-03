import csv
import re

file = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv'

def get_val(v):
    return int(re.sub(r'[^\d]', '', str(v))) if v else 0

print(f"{'Company':<15} | {'Product':<40} | {'Male (Won)':<15} | {'Female (Won)':<15}")
print("-" * 90)

try:
    with open(file, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        # Sort by Male premium descending
        rows.sort(key=lambda x: get_val(x['Col_7']), reverse=True)
        
        for row in rows[:20]:
            print(f"{row['Col_0']:<15} | {row['Col_1'][:40]:<40} | {row['Col_7']:<15} | {row['Col_8']:<15}")
except Exception as e:
    print(f"Error: {e}")
