# -*- coding: utf-8 -*-
import os
import sys
import shutil
import subprocess
import json
from datetime import datetime

# Reconfigure stdout to use utf-8 to print Korean characters properly
sys.stdout.reconfigure(encoding='utf-8')

# Constants
WORKSPACE_ROOT = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main"
DEFAULT_SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
METADATA_JSON_PATH = os.path.join(WORKSPACE_ROOT, "src", "lib", "insurance", "disclosure_dates.json")

# List of scripts to execute in order
EXTRACTION_SCRIPTS = [
    "scripts/scraper/partition_data.py",
    "scripts/extract_accident_data.py",
    "scripts/extract_credit_data.py",
    "scripts/extract_dementia_data.py",
    "scripts/extract_golf_data.py",
    "scripts/extract_health_general_data.py",
    "scripts/extract_heart_insurance.py",
    "scripts/extract_home_facility_data.py",
    "scripts/extract_home_fire_data.py",
    "scripts/extract_legal_data.py",
    "scripts/extract_pension_data.py",
    "scripts/extract_pet_data.py",
    "scripts/extract_prefamily_child_excel_aligned.py",
    "scripts/extract_property_data.py",
    "scripts/extract_savings_data.py",
    "scripts/extract_variable_term.py",
    "scripts/extract_whole_life_aligned.py",
    "scripts/restructure_dementia_data.py"
]

UPLOAD_SCRIPTS = [
    # Python uploaders
    ("python", "scripts/upload_accident_rates.py"),
    ("python", "scripts/upload_child_rates.py"),
    ("python", "scripts/upload_child_sick_rates.py"),
    ("python", "scripts/upload_consolidated_heart.py"),
    ("python", "scripts/upload_fire_rates.py"),
    ("python", "scripts/scraper/upload_brain_final.py"),
    ("python", "scripts/upload_health_general_rates.py"),
    ("python", "scripts/upload_home_facility_rates.py"),
    ("python", "scripts/upload_legal_data_http.py"),
    ("python", "scripts/upload_pet_rates.py"),
    ("python", "scripts/upload_property_rates.py"),
    ("python", "scripts/upload_savings_rates_new.py"),
    ("python", "scripts/scraper/ingest_silson_v6_api.py"),
    ("python", "scripts/scraper/load_driver_to_supabase_api.py"),
    
    # Node uploaders
    ("node", "scripts/load_ubj_final.cjs"),
    ("node", "scripts/scraper/upload_dental_data.cjs"),
    
    # TypeScript uploaders
    ("npx tsx", "scripts/upload_pension_rates.ts"),
    ("npx tsx", "scripts/upload_variable_term_rates.ts"),
    ("npx tsx", "scripts/upload_whole_life_rates.ts")
]

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
                if len(xls_files) > 5:  # Let's say at least 5 files to qualify as a disclosure dump
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
    
    # Check if we are on Windows and need shell=True for npx
    is_windows = os.name == 'nt'
    use_shell = False
    
    if cmd_type == "python":
        cmd = [sys.executable, full_script_path]
    elif cmd_type == "node":
        cmd = ["node", full_script_path]
    elif cmd_type == "npx tsx":
        if is_windows:
            cmd = f'npx tsx "{full_script_path}"'
            use_shell = True
        else:
            cmd = ["npx", "tsx", full_script_path]
    else:
        print(f"[-] Unknown command type: {cmd_type}")
        return False
        
    try:
        # Force UTF-8 encoding for python subprocess prints to avoid UnicodeEncodeError on Windows
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        env["PYTHONUTF8"] = "1"

        # Run process and print output in real-time
        process = subprocess.Popen(
            cmd,
            cwd=WORKSPACE_ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding='utf-8',
            errors='ignore',
            env=env,
            shell=use_shell
        )
        
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output.strip())
                
        rc = process.poll()
        if rc == 0:
            print(f"[+] Success: {script_path}")
            return True
        else:
            print(f"[-] Failure: {script_path} exited with code {rc}")
            return False
    except Exception as e:
        print(f"[-] Exception running {script_path}: {e}")
        return False

def update_disclosure_dates():
    print(f"\n[*] Updating disclosure metadata in {METADATA_JSON_PATH}...")
    try:
        now = datetime.now()
        current_disclosure_str = f"{now.year}년 {now.month:02d}월 공시"
        current_date_str = now.strftime("%Y-%m-%d")
        
        # Load or create metadata
        if os.path.exists(METADATA_JSON_PATH):
            with open(METADATA_JSON_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = {}
            
        # Update all categories
        categories = [
            "child", "cancer", "health_general", "fire", "caregiving", "dementia",
            "nursing", "brain", "heart", "driver", "pet", "golf", "property",
            "annuity", "whole_life", "variable", "legal", "savings_general",
            "credit", "accident", "surgery_hospital", "silson", "car"
        ]
        
        for cat in categories:
            data[cat] = current_disclosure_str
            
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
    print("      INSURANCE DISCLOSURE UPLOAD PIPELINE        ")
    print("==================================================")
    
    # 1. Check if user created a new directory for disclosure files
    new_dir = find_new_disclosure_dir()
    if new_dir:
        print(f"[+] Found new disclosure files folder: {new_dir}")
        copy_files_to_source_dir(new_dir)
    else:
        print(f"[*] No new custom disclosure folder detected. Processing files directly in {DEFAULT_SOURCE_DIR}")

    # 2. Run Extraction scripts
    print("\n==================================================")
    print("            PHASE 1: DATA EXTRACTION              ")
    print("==================================================")
    for script in EXTRACTION_SCRIPTS:
        success = run_script("python", script)
        if not success:
            print(f"\n[!] Pipeline halted due to error in extraction script: {script}")
            sys.exit(1)

    # 3. Run Upload scripts
    print("\n==================================================")
    print("            PHASE 2: SUPABASE UPLOAD              ")
    print("==================================================")
    for cmd_type, script in UPLOAD_SCRIPTS:
        success = run_script(cmd_type, script)
        if not success:
            print(f"\n[!] Pipeline halted due to error in upload script: {script}")
            sys.exit(1)

    # 4. Update disclosure dates metadata JSON
    print("\n==================================================")
    print("            PHASE 3: METADATA UPDATE              ")
    print("==================================================")
    success = update_disclosure_dates()
    if not success:
        sys.exit(1)

    print("\n==================================================")
    print("     ★ ALL UPLOADS COMPLETED SUCCESSFULLY! ★     ")
    print("==================================================")

if __name__ == "__main__":
    main()
