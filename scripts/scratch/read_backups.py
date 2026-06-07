import os

dir_path = r"C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56"
for f in ["restored_963_formatted.tsx", "restored_2132_code_formatted.tsx"]:
    print(f"=== {f} ===")
    p = os.path.join(dir_path, f)
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as file:
            print(file.read())
    print("="*40)
