import os, glob

brain_dir = r"C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56"
files = glob.glob(os.path.join(brain_dir, "**", "*"), recursive=True)

print("Files in brain containing 'isRemodeling':")
for file_path in files:
    if os.path.isfile(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                if 'isRemodeling' in content:
                    print(f"- {os.path.relpath(file_path, brain_dir)}")
        except Exception as e:
            pass
