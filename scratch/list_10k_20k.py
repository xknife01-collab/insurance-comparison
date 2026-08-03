import csv
import re

file = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'

def get_val(v):
    return int(re.sub(r'[^\d]', '', str(v))) if v else 0

print(f"{'Company':<15} | {'Product':<45} | {'Male':<12} | {'Female':<12}")
print("-" * 90)

try:
    with open(file, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        # Filter for 10k ~ 29k Won
        filtered = [r for r in rows if 10000 <= get_val(r['Col_7']) < 30000]
        # Sort by Male premium
        filtered.sort(key=lambda x: get_val(x['Col_7']))
        
        for row in filtered:
            print(f"{row['Col_0']:<15} | {row['Col_1'][:45]:<45} | {row['Col_7']:<12} | {row['Col_8']:<12}")
            
except Exception as e:
    print(f"Error: {e}")
