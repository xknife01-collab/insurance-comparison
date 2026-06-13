import os

def run():
    source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(source_dir) if f.endswith(".xls")]
    print(f"Total .xls files: {len(files)}")
    child_files = []
    for f in files:
        if any(k in f for k in ["어린이", "자녀", "태아", "아이", "꿈나무", "청소년"]):
            child_files.append(f)
            
    print(f"\nChild-related files ({len(child_files)}):")
    for f in child_files:
        print(f"  - {f}")

if __name__ == '__main__':
    run()
