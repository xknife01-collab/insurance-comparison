import os

hana_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\downloads\hana_nonlife"
output_file = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\hana_filenames.txt"

files = os.listdir(hana_dir)
with open(output_file, "w", encoding="utf-8-sig") as f:
    f.write("Clean filenames in downloads/hana_nonlife:\n")
    for file in sorted(files):
        f.write(f"- {file} ({os.path.getsize(os.path.join(hana_dir, file))} bytes)\n")

print(f"Filenames saved to {output_file}")
