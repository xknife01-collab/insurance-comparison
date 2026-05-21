import csv
import re

file = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv'

def get_val(v):
    return int(re.sub(r'[^\d]', '', str(v))) if v else 0

ratios = []
valid_count = 0

try:
    with open(file, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            m = get_val(row['Col_7'])
            f_val = get_val(row['Col_8'])
            
            if m > 0 and f_val > 0:
                # Ratio of Male to Female
                ratio = m / f_val
                ratios.append(ratio)
                valid_count += 1

    if valid_count > 0:
        avg_ratio = sum(ratios) / valid_count
        print(f"Total Products Analyzed: {valid_count}")
        print(f"Average Male/Female Ratio: {avg_ratio:.2f}")
        print(f"Max Ratio: {max(ratios):.2f}")
        print(f"Min Ratio: {min(ratios):.2f}")
    else:
        print("No valid male/female premium pairs found for ratio calculation.")
except Exception as e:
    print(f"Error: {e}")
