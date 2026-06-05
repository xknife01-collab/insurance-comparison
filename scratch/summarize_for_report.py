import re

REPORT_FILE = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\child_premiums_report.txt"

def main():
    with open(REPORT_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        
    products = content.split("--------------------------------------------------")
    
    summary = []
    for p in products:
        p = p.strip()
        if not p:
            continue
        lines = p.split("\n")
        title_line = lines[0]
        # match [number] Company - Product Name
        m = re.match(r'\[\d+\]\s+(.*?)\s+-\s+(.*)', title_line)
        if m:
            company = m.group(1).strip()
            name = m.group(2).strip()
            
            # Find the sum line
            sum_line = ""
            for line in lines:
                if "합계" in line:
                    sum_line = line.strip()
                    break
            
            summary.append({
                "company": company,
                "name": name,
                "sum": sum_line
            })
            
    print(f"Total parsed: {len(summary)} products.")
    for idx, s in enumerate(summary):
        print(f"{idx+1}. {s['company']} | {s['name']} | {s['sum']}")

if __name__ == "__main__":
    main()
