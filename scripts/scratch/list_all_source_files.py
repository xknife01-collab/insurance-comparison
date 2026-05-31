import os

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def run():
    files = os.listdir(SOURCE_DIR)
    xls_files = [f for f in files if f.lower().endswith('.xls')]
    xlsx_files = [f for f in files if f.lower().endswith('.xlsx')]
    other_excel = [f for f in files if 'excel' in f.lower() or 'comparison' in f.lower()]
    
    print(f"Total files in source dir: {len(files)}")
    print(f"Total .xls files: {len(xls_files)}")
    print(f"Total .xlsx files: {len(xlsx_files)}")
    print(f"Other potential files: {other_excel}")

if __name__ == "__main__":
    run()
