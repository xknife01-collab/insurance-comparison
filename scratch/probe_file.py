import os

def probe_file():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_master_final_clean.csv"
    keywords = ["심장", "허혈", "혈관", "부정맥", "심근", "뇌출혈", "뇌졸중"]
    
    count = 0
    hits = []
    
    print(f"Probing {path}...")
    try:
        with open(path, 'r', encoding='utf-8-sig', errors='ignore') as f:
            for i, line in enumerate(f):
                if any(k in line for k in keywords):
                    count += 1
                    if len(hits) < 5:
                        hits.append(line.strip())
                if i > 500000: # 50만줄까지만
                    break
    except Exception as e:
        print(f"Error: {e}")
        
    print(f"Found {count} hits in first 500k lines.")
    for h in hits:
        print(f"Sample Hit: {h[:150]}...")

if __name__ == "__main__":
    probe_file()
