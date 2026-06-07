import os

dir_path = r"C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56"
for f in os.listdir(dir_path):
    if any(k in f for k in ["restored", "extracted", "code", "content"]):
        if f.endswith(".txt") or f.endswith(".tsx") or f.endswith(".py"):
            print(f"=== {f} ===")
            try:
                with open(os.path.join(dir_path, f), "r", encoding="utf-8") as file:
                    print(file.read()[:1000])
            except Exception as e:
                print(e)
            print("="*20)
