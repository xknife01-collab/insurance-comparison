import os

file_path = r"C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56\restored_2132_code_formatted.tsx"
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    print(f"Lines count: {len(lines)}")
    # Print the first 50 lines and last 50 lines
    print("\n--- FIRST 50 LINES ---")
    print("".join(lines[:50]))
    print("\n--- LAST 50 LINES ---")
    print("".join(lines[-50:]))
else:
    print("File does not exist.")
