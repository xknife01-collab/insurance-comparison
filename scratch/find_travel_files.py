import os

def find_travel_files():
    workspace = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    matches = []
    for root, dirs, files in os.walk(workspace):
        for f in files:
            if "여행" in f or "travel" in f.lower():
                matches.append(os.path.join(root, f))
    
    print(f"Found {len(matches)} files:")
    for path in sorted(matches):
        print(path)

if __name__ == "__main__":
    find_travel_files()
