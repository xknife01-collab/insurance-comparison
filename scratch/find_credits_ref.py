import os, glob

for filepath in glob.glob("src/**/*.*", recursive=True):
    if os.path.isfile(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                if "current_credits" in content:
                    print(f"Found in {filepath}")
        except Exception:
            pass
