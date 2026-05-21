import csv

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'

try:
    with open(file_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        
        # Sort rows by male premium
        def get_val(r):
            v = r.get('Col_7', '0').replace(',', '').replace('원', '').strip()
            try: return float(v)
            except: return 0
            
        rows.sort(key=get_val)
        
        print(f"{'순번':<4} | {'보험사':<8} | {'상품명':<45} | {'남성 보험료':<15}")
        print("-" * 85)
        
        # Pick samples: First 10, Middle 10, Last 10
        total = len(rows)
        indices = list(range(15)) + list(range(total//2 - 5, total//2 + 5)) + list(range(total - 15, total))
        
        # Remove duplicates and sort indices
        indices = sorted(list(set([i for i in indices if 0 <= i < total])))
        
        last_idx = -1
        for i in indices:
            if last_idx != -1 and i > last_idx + 1:
                print("... (중략) ...")
            
            row = rows[i]
            company = row.get('Col_0', '')[:8]
            product = row.get('Col_1', '')[:45]
            premium = row.get('Col_7', '')
            
            print(f"{i+1:<4} | {company:<8} | {product:<45} | {premium:<15}")
            last_idx = i
            
except Exception as e:
    print(f"Error: {e}")
