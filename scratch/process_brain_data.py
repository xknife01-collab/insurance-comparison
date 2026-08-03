import csv
import re
import sys

file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\extracted_data.csv'

# Set output encoding to utf-8
sys.stdout.reconfigure(encoding='utf-8')

results = []

with open(file_path, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        product_name = (row.get('상품명', '') or '').strip()
        coverage_name = (row.get('담보명(급부명)', '') or '').strip()
        reason = (row.get('지급사유', '') or '').strip()
        amount = (row.get('지급금액', '') or '').strip()
        premium_val = (row.get('가입금액', '') or '').strip()
        
        # Combine check
        full_search_text = product_name + coverage_name + reason
        
        if '뇌혈관' in full_search_text:
            def clean_price(p):
                if not p: return 0
                match = re.search(r'([\d,]+)', p)
                if match:
                    return int(match.group(1).replace(',', ''))
                return 0

            p1 = clean_price(amount)
            p2 = clean_price(premium_val)
            premium = p2 if p2 > 0 else p1
            
            if premium > 0:
                # Merge logic
                if product_name == coverage_name or not product_name:
                    combined_name = coverage_name
                elif not coverage_name:
                    combined_name = product_name
                else:
                    # Avoid repeating parts of the name if possible
                    if coverage_name in product_name:
                        combined_name = product_name
                    elif product_name in coverage_name:
                        combined_name = coverage_name
                    else:
                        combined_name = f"{product_name} [{coverage_name}]"
                
                results.append({
                    'name': combined_name,
                    'coverage': reason,
                    'premium': premium
                })

unique_results = {}
for r in results:
    key = (r['name'], r['coverage'], r['premium'])
    unique_results[key] = r

# Filter for 10M coverage
filtered = [r for r in unique_results.values() if '1,000' in r['coverage'] or '1000' in r['coverage']]

sorted_results = sorted(filtered, key=lambda x: x['premium'])

print(f"Total Unique: {len(unique_results)}")
print(f"1,000만원 Coverage Filtered: {len(filtered)}")
print("-" * 50)
for r in sorted_results[:60]:
    print(f"{r['name']} | {r['coverage']} | {r['premium']:,}원")
