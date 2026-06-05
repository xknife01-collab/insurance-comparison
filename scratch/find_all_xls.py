import os

def find_xls():
    root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    xls_files = []
    for root, dirs, files in os.walk(root_dir):
        for f in files:
            if f.endswith(".xls") or f.endswith(".xlsx"):
                full_path = os.path.join(root, f)
                xls_files.append(full_path)
                
    print(f"Total .xls/.xlsx files found recursively: {len(xls_files)}")
    for f in xls_files:
        print(f)

if __name__ == "__main__":
    find_xls()
