import csv

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'

try:
    with open(file_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        
        def get_val(r, key):
            v = r.get(key, '0').replace(',', '').replace('원', '').strip()
            try: return float(v)
            except: return 0
            
        # Filter: Only rows where at least one premium is > 0
        valid_rows = [r for r in rows if get_val(r, 'Col_7') > 0 or get_val(r, 'Col_8') > 0]
        
        # Sort by male premium (if 0, use female for sorting)
        valid_rows.sort(key=lambda x: get_val(x, 'Col_7') if get_val(x, 'Col_7') > 0 else get_val(x, 'Col_8'))
        
        print(f"--- REAL PREMIUM LIST (Sorted by Price, Total: {len(valid_rows)} products) ---")
        print(f"{'순번':<4} | {'보험사':<8} | {'상품명':<45} | {'보험료(남/여)':<20}")
        print("-" * 100)
        
        # Show diverse range
        total = len(valid_rows)
        indices = list(range(15)) + list(range(total//2 - 5, total//2 + 5)) + list(range(total - 15, total))
        indices = sorted(list(set([i for i in indices if 0 <= i < total])))
        
        last_idx = -1
        for i in indices:
            if last_idx != -1 and i > last_idx + 1:
                print("... (중략) ...")
            
            row = valid_rows[i]
            company = row.get('Col_0', '')[:8]
            product = row.get('Col_1', '')[:45]
            m_p = row.get('Col_7', '0')
            f_p = row.get('Col_8', '0')
            
            print(f"{i+1:<4} | {company:<8} | {product:<45} | {m_p}/{f_p}")
            last_idx = i
            
    # Save back only valid rows to the CSV
    with open(file_path, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=reader.fieldnames)
        writer.writeheader()
        writer.writerows(valid_rows)
        
except Exception as e:
    print(f"Error: {e}")
