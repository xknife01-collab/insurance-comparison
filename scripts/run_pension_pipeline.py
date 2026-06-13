# -*- coding: utf-8 -*-
import os
import sys
import shutil
import subprocess
import json
from datetime import datetime

# Reconfigure stdout to use utf-8 to print Korean characters properly
sys.stdout.reconfigure(encoding='utf-8')

WORKSPACE_ROOT = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main"
DEFAULT_SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
METADATA_JSON_PATH = os.path.join(WORKSPACE_ROOT, "src", "lib", "insurance", "disclosure_dates.json")

def find_new_disclosure_dir():
    """
    Scans the parent and workspace folders for any new user-created directory containing .xls files.
    """
    search_roots = [
        r"C:\Users\zkfnt\Desktop\insurance-comparison-main",
        WORKSPACE_ROOT
    ]
    
    ignore_folders = ["insurance-comparison-main", "node_modules", ".git", "insurance_data", "scripts", "src", "public", "dist", "scratch"]
    
    for root in search_roots:
        if not os.path.exists(root):
            continue
        for name in os.listdir(root):
            full_path = os.path.join(root, name)
            if os.path.isdir(full_path) and name not in ignore_folders:
                # Check if it has any .xls files
                xls_files = [f for f in os.listdir(full_path) if f.endswith(".xls")]
                if len(xls_files) >= 1:
                    return full_path
    return None

def copy_files_to_source_dir(new_dir):
    print(f"\n[*] Detecting files in new directory: {new_dir}")
    copied = 0
    for file in os.listdir(new_dir):
        if file.endswith(".xls"):
            src = os.path.join(new_dir, file)
            dst = os.path.join(DEFAULT_SOURCE_DIR, file)
            shutil.copy2(src, dst)
            copied += 1
    print(f"[+] Successfully copied {copied} raw .xls files to {DEFAULT_SOURCE_DIR} for processing.")

def run_script(cmd_type, script_path):
    print(f"\n>>> Running {cmd_type} {script_path}...")
    full_script_path = os.path.join(WORKSPACE_ROOT, script_path)
    
    is_windows = os.name == 'nt'
    use_shell = False
    
    if cmd_type == "python":
        cmd = [sys.executable, full_script_path]
    elif cmd_type == "npx tsx":
        cmd = ["npx", "tsx", full_script_path]
        use_shell = is_windows
    else:
        cmd = cmd_type.split() + [full_script_path]
        
    try:
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        env["PYTHONUTF8"] = "1"
        process = subprocess.Popen(
            cmd,
            cwd=WORKSPACE_ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding='utf-8',
            errors='ignore',
            shell=use_shell,
            env=env
        )
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output.strip())
        rc = process.poll()
        return rc == 0
    except Exception as e:
        print(f"[-] Exception running {script_path}: {e}")
        return False

def update_disclosure_dates():
    print(f"\n[*] Updating annuity disclosure metadata in {METADATA_JSON_PATH}...")
    try:
        now = datetime.now()
        current_disclosure_str = f"{now.year}년 {now.month:02d}월 공시"
        current_date_str = now.strftime("%Y-%m-%d")
        
        if os.path.exists(METADATA_JSON_PATH):
            with open(METADATA_JSON_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = {}
            
        data["annuity"] = current_disclosure_str
        data["updated_at"] = current_date_str
        
        with open(METADATA_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"[+] Metadata updated successfully: {current_disclosure_str}")
        return True
    except Exception as e:
        print(f"[-] Failed to update metadata JSON: {e}")
        return False

def main():
    print("==================================================")
    print("      ANNUITY SAVINGS INSURANCE PIPELINE          ")
    print("==================================================")
    
    new_dir = find_new_disclosure_dir()
    if new_dir:
        print(f"[+] Found new disclosure files folder: {new_dir}")
        copy_files_to_source_dir(new_dir)
    else:
        print(f"[*] No new custom disclosure folder detected. Processing files directly in {DEFAULT_SOURCE_DIR}")
        
    print("\n[+] Running Extraction...")
    if not run_script("python", "scripts/extract_pension_data.py"):
        print("[-] Extraction failed!")
        sys.exit(1)
        
    print("\n[+] Running Upload...")
    if not run_script("npx tsx", "scripts/upload_pension_rates.ts"):
        print("[-] Upload failed!")
        sys.exit(1)
        
    print("\n[+] Updating Metadata...")
    if not update_disclosure_dates():
        sys.exit(1)
        
    print("\n==================================================")
    print("★ ANNUITY SAVINGS UPDATE COMPLETED SUCCESSFULLY! ★")
    print("==================================================")

if __name__ == "__main__":
    main()
