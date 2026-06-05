import os

source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(source_dir) if f.endswith(".xls")]
print(f"Total files in {source_dir}: {len(files)}")
print(files[:10])

# Check also in the sub-folder
sub_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main"
if os.path.exists(sub_dir):
    sub_files = [f for f in os.listdir(sub_dir) if f.endswith(".xls")]
    print(f"Total files in {sub_dir}: {len(sub_files)}")
    print(sub_files[:10])
