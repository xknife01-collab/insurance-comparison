import subprocess
import os
import sys

def run_script(path, cwd):
    print(f"[*] Running: {os.path.basename(path)} in {cwd}...")
    # Use -X utf8 to force UTF-8 for IO if possible, but the scripts themselves should handle encoding.
    res = subprocess.run([sys.executable, path], cwd=cwd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    if res.returncode != 0:
        print(f"  [!] Failed: {res.stderr}")
    else:
        print(f"  [+] Success: {res.stdout.splitlines()[-1] if res.stdout.splitlines() else ''}")
    return res.returncode == 0

def main():
    base_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main'
    scratch_dir = os.path.join(base_dir, 'scratch')
    scraper_dir = os.path.join(base_dir, 'scripts', 'scraper')

    scripts = [
        (os.path.join(scratch_dir, 'extract_brain_insurance.py'), scratch_dir),
        (os.path.join(scratch_dir, 'final_filter.py'), scratch_dir),
        (os.path.join(scratch_dir, 'split_gender_premiums.py'), scratch_dir),
        (os.path.join(scraper_dir, 'upload_brain_final.py'), base_dir) # Run from root for .env
    ]

    for script, cwd in scripts:
        if not run_script(script, cwd):
            print(f"[!!] Pipeline stopped at {os.path.basename(script)}")
            break
    else:
        print("\n[***] ALL STEPS COMPLETED SUCCESSFULLY! [***]")

if __name__ == "__main__":
    main()
