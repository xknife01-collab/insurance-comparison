import re

CHILD_KEYWORDS = ["어린이", "자녀", "태아", "꿈나무", "신생아", "아이", "청소년", "주니어", "키즈", "Mom", "맘"]
SICK_KEYWORDS = ["유병", "간편", "3.2.5", "3.3.5", "3.5.5", "3.1.5", "3.10.5", "3.4.5", "3.7.5", "심사", "경증", "간편고지", "간편한", "바로선택", "오간편", "더간편한", "3N5"]

def check():
    path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\all_products.txt"
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    matches = []
    current_file = ""
    for line in lines:
        if line.startswith("File: "):
            current_file = line.strip()
        elif line.startswith("  - "):
            prod = line.replace("  - ", "").strip()
            
            is_child = any(k.lower() in prod.lower() for k in CHILD_KEYWORDS)
            is_sick = any(k in prod for k in SICK_KEYWORDS)
            
            if is_child or is_sick:
                # Let's save if it matches BOTH
                if is_child and is_sick:
                    matches.append((current_file, prod))
                    
    print(f"Total matched BOTH child and sick: {len(matches)}")
    for f, p in matches:
        print(f"  [{f}] {p}")

if __name__ == "__main__":
    check()
