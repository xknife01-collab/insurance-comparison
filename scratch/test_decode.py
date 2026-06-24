import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisSection.tsx"

if os.path.exists(file_path):
    # Read raw bytes first
    with open(file_path, "rb") as f:
        raw = f.read()
    
    # Try decoding with cp949
    try:
        decoded_cp949 = raw.decode("cp949")
        print("Successfully decoded with CP949!")
        # Print lines 945 to 975 in CP949 decoded text
        lines = decoded_cp949.splitlines()
        for idx in range(944, 975):
            if idx < len(lines):
                line = lines[idx]
                if "riders.push" in line:
                    print(f"Line {idx+1}: {line.strip()}")
    except Exception as e:
        print("CP949 decoding failed:", e)
else:
    print("File not found")
