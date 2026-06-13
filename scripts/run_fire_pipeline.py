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
                # For home fire insurance, the total files to copy are 3 (file_38.xls, file_47.xls, file_50.xls),
                # so we lower the threshold to >= 1 files to qualify as a custom disclosure dump.
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

def map_and_copy_fire_files(source_dir, dest_dir):
    """
    Scans xls files in source_dir, identifies file_50.xls, file_47.xls, and file_38.xls,
    and copies/renames them to dest_dir with those expected names.
    """
    print(f"\n[*] Scanning and mapping fire source files from {source_dir} to {dest_dir}...")
    import pandas as pd
    import io
    import xlrd
    import warnings
    
    warnings.filterwarnings('ignore')
    
    def load_df(filepath):
        try:
            wb = xlrd.open_workbook(filepath, encoding_override='cp949')
            sheet = wb.sheet_by_index(0)
            data = []
            for r in range(sheet.nrows):
                data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
            return pd.DataFrame(data)
        except Exception:
            try:
                return pd.read_excel(filepath, engine='xlrd', header=None)
            except Exception:
                try:
                    with open(filepath, 'rb') as f:
                        raw_bytes = f.read()
                    for enc in ['cp949', 'euc-kr', 'utf-8']:
                        try:
                            raw_text = raw_bytes.decode(enc)
                            if '<table' in raw_text.lower():
                                frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                                if frames:
                                    return frames[0]
                        except Exception:
                            continue
                except Exception:
                    pass
        return None

    files = [f for f in os.listdir(source_dir) if f.endswith(".xls")]
    
    file_50_found = None
    file_47_found = None
    file_38_found = None
    
    for filename in sorted(files):
        # Ignore already renamed targets
        if filename in ["file_50.xls", "file_47.xls", "file_38.xls"]:
            continue
            
        filepath = os.path.join(source_dir, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        flat_vals = []
        try:
            for col in df.columns:
                flat_vals.extend(df[col].dropna().astype(str).tolist())
        except Exception:
            continue
        all_text = " ".join(flat_vals)
        
        # Check for file_50 (Home Fire general templates)
        try:
            val_7 = str(df.iloc[7, 2])
            val_12 = str(df.iloc[12, 2])
            if "우리집" in val_7 or "119주택" in val_12 or "My리치하우스" in str(df.iloc[79, 2]):
                file_50_found = filepath
                print(f"  [Map] Identified file_50: {filename}")
        except Exception:
            pass
            
        # Check for file_47 (Hyundai Marine & Fire H주택화재)
        if "H주택화재" in all_text or "Hi2601" in all_text or "현대해상다이렉트H" in all_text:
            if df.shape[0] > 1000:
                file_47_found = filepath
                print(f"  [Map] Identified file_47: {filename}")
                
        # Check for file_38 (Commercial property)
        try:
            val_7 = str(df.iloc[7, 1])
            val_20 = str(df.iloc[20, 1])
            val_31 = str(df.iloc[31, 1])
            val_42 = str(df.iloc[42, 1])
            if "메리츠" in val_7 and "한화" in val_20 and "롯데" in val_31 and "흥국" in val_42:
                file_38_found = filepath
                print(f"  [Map] Identified file_38: {filename}")
        except Exception:
            pass

    # Copy files with mapped names
    if file_50_found:
        shutil.copy2(file_50_found, os.path.join(dest_dir, "file_50.xls"))
        print(f"[+] Mapped -> file_50.xls (from {os.path.basename(file_50_found)})")
    if file_47_found:
        shutil.copy2(file_47_found, os.path.join(dest_dir, "file_47.xls"))
        print(f"[+] Mapped -> file_47.xls (from {os.path.basename(file_47_found)})")
    if file_38_found:
        shutil.copy2(file_38_found, os.path.join(dest_dir, "file_38.xls"))
        print(f"[+] Mapped -> file_38.xls (from {os.path.basename(file_38_found)})")
        
    return file_50_found is not None and file_47_found is not None and file_38_found is not None

def run_script(script_path):
    print(f"\n>>> Running python {script_path}...")
    full_script_path = os.path.join(WORKSPACE_ROOT, script_path)
    cmd = [sys.executable, full_script_path]
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
    print(f"\n[*] Updating home fire disclosure metadata in {METADATA_JSON_PATH}...")
    try:
        now = datetime.now()
        current_disclosure_str = f"{now.year}년 {now.month:02d}월 공시"
        current_date_str = now.strftime("%Y-%m-%d")
        
        if os.path.exists(METADATA_JSON_PATH):
            with open(METADATA_JSON_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = {}
            
        data["fire"] = current_disclosure_str
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
    print("      HOME FIRE INSURANCE PIPELINE RUNNER         ")
    print("==================================================")
    
    new_dir = find_new_disclosure_dir()
    if new_dir:
        print(f"[+] Found new disclosure files folder: {new_dir}")
        copy_files_to_source_dir(new_dir)
    else:
        print(f"[*] No new custom disclosure folder detected. Processing files directly in {DEFAULT_SOURCE_DIR}")
        
    # Map and rename files in the target source directory to ensure extract_home_fire_data.py finds them
    map_and_copy_fire_files(DEFAULT_SOURCE_DIR, DEFAULT_SOURCE_DIR)
        
    print("\n[+] Running Extraction...")
    if not run_script("scripts/extract_home_fire_data.py"):
        print("[-] Extraction failed!")
        sys.exit(1)
        
    print("\n[+] Running Upload...")
    if not run_script("scripts/upload_fire_rates.py"):
        print("[-] Upload failed!")
        sys.exit(1)
        
    print("\n[+] Updating Metadata...")
    if not update_disclosure_dates():
        sys.exit(1)
        
    print("\n==================================================")
    print("  ★ FIRE INSURANCE UPDATE COMPLETED SUCCESSFULLY! ★")
    print("==================================================")

if __name__ == "__main__":
    main()
