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

def map_and_copy_property_files(source_dir, dest_dir):
    """
    Scans xls files in source_dir, identifies file_38.xls (Commercial Property Fire),
    and copies/renames it to dest_dir with the expected name.
    """
    print(f"\n[*] Scanning and mapping property source files from {source_dir} to {dest_dir}...")
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
    
    file_38_found = None
    
    for filename in sorted(files):
        if filename == "file_38.xls":
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
        
        # Check for file_38 (Commercial property)
        try:
            val_7 = str(df.iloc[7, 1])
            val_20 = str(df.iloc[20, 1])
            val_31 = str(df.iloc[31, 1])
            val_42 = str(df.iloc[42, 1])
            if "메리츠" in val_7 and "한화" in val_20 and "롯데" in val_31 and "흥국" in val_42:
                file_38_found = filepath
                print(f"  [Map] Identified file_38: {filename}")
                break
        except Exception:
            pass

    # Copy files
    if file_38_found:
        shutil.copy2(file_38_found, os.path.join(dest_dir, "file_38.xls"))
        print(f"[+] Mapped -> file_38.xls (from {os.path.basename(file_38_found)})")
        return True
        
    return False

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
    print(f"\n[*] Updating property disclosure metadata in {METADATA_JSON_PATH}...")
    try:
        now = datetime.now()
        current_disclosure_str = f"{now.year}년 {now.month:02d}월 공시"
        current_date_str = now.strftime("%Y-%m-%d")
        
        if os.path.exists(METADATA_JSON_PATH):
            with open(METADATA_JSON_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = {}
            
        data["property"] = current_disclosure_str
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
    print("   PROPERTY COMPREHENSIVE INSURANCE PIPELINE      ")
    print("==================================================")
    
    new_dir = find_new_disclosure_dir()
    if new_dir:
        print(f"[+] Found new disclosure files folder: {new_dir}")
        copy_files_to_source_dir(new_dir)
    else:
        print(f"[*] No new custom disclosure folder detected. Processing files directly in {DEFAULT_SOURCE_DIR}")
        
    map_and_copy_property_files(DEFAULT_SOURCE_DIR, DEFAULT_SOURCE_DIR)
        
    print("\n[+] Running Extraction...")
    if not run_script("scripts/extract_property_data.py"):
        print("[-] Extraction failed!")
        sys.exit(1)
        
    print("\n[+] Running Upload...")
    if not run_script("scripts/upload_property_rates.py"):
        print("[-] Upload failed!")
        sys.exit(1)
        
    print("\n[+] Updating Metadata...")
    if not update_disclosure_dates():
        sys.exit(1)
        
    print("\n==================================================")
    print("★ PROPERTY COMPREHENSIVE UPDATE COMPLETED SUCCESSFULLY! ★")
    print("==================================================")

if __name__ == "__main__":
    main()
