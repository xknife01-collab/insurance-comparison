import os

for fname in ["restored_951_content.txt", "restored_951_formatted.tsx", "restored_963_content.txt", "restored_963_formatted.tsx"]:
    file_path = os.path.join(r"C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56", fname)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        print(f"File: {fname}, Lines: {len(lines)}")
        if len(lines) > 0:
            print("First 10 lines:")
            print("".join(lines[:10]))
            print("Last 10 lines:")
            print("".join(lines[-10:]))
    else:
        print(f"File: {fname} does not exist.")
    print("-" * 50)
