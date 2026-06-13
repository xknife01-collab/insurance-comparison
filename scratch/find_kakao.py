import os

search_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src"
for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith((".tsx", ".ts", ".jsx", ".js")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                if "kakao" in content.lower():
                    print(f"File: {path}")
