import csv

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'

try:
    with open(file_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        print(f"{'보험사':<10} | {'상품명':<40} | {'담보명':<25} | {'남성':<8} | {'여성':<8}")
        print("-" * 110)
        
        count = 0
        for row in reader:
            company = row.get('Col_0', '')[:10]
            product = row.get('Col_1', '')[:40]
            coverage = row.get('Col_3', '')[:25]
            male = row.get('Col_7', '')
            female = row.get('Col_8', '')
            
            print(f"{company:<10} | {product:<40} | {coverage:<25} | {male:<8} | {female:<8}")
            count += 1
            if count >= 15:
                break
except Exception as e:
    print(f"Error: {e}")
