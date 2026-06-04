import os
import io
import pandas as pd
import warnings
import re

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
OUTPUT_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\check_variable_term_cycles_results.txt"

def clean_val(v):
    if pd.isna(v) or v is None: return ""
    return str(v).replace('\n', ' ').strip()

def analyze_cycles():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    results = []
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        is_html = False
        try:
            with open(filepath, 'rb') as f:
                content = f.read(2000)
            if b'<table' in content.lower() or b'<html' in content.lower():
                is_html = True
        except Exception:
            pass
            
        df = None
        if not is_html:
            try:
                df = pd.read_excel(filepath, engine='xlrd', header=None)
            except Exception:
                pass
        else:
            for enc in ['cp949', 'euc-kr', 'utf-8']:
                try:
                    with open(filepath, 'rb') as f:
                        raw_bytes = f.read()
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                        if frames:
                            df = frames[0]
                            break
                except Exception:
                    continue
                    
        if df is None:
            continue
            
        cleaned_df = df.map(lambda v: clean_val(v))
        
        # We only care about rows/files that match our variable/term keyword search
        has_keywords = False
        matching_rows = []
        for i in range(len(cleaned_df)):
            row_list = cleaned_df.iloc[i].tolist()
            row_str = " ".join(row_list)
            if any(k in row_str for k in ["변액", "정기"]):
                has_keywords = True
                matching_rows.append((i, row_list))
                
        if not has_keywords:
            continue
            
        # For this file, let's identify the payment cycles mentioned in the file
        all_text = ""
        for i in range(len(cleaned_df)):
            all_text += " " + " ".join(cleaned_df.iloc[i].tolist())
            
        # Extract cycle mentions in the file text
        cycles_found = set()
        if "월납" in all_text or "매월" in all_text or "월보험료" in all_text:
            cycles_found.add("월납")
        if "연납" in all_text or "1년납" in all_text or "년납" in all_text or "연보험료" in all_text:
            cycles_found.add("연납")
        if "일시납" in all_text:
            cycles_found.add("일시납")
            
        file_summary = {
            "file": filename,
            "type": "HTML" if is_html else "Binary",
            "cycles_in_file": list(cycles_found),
            "rows": []
        }
        
        for idx, row in matching_rows:
            row_str = " ".join(row)
            row_cycle = "unknown"
            
            # Check for "납입주기" pattern in the row
            cycle_match = re.search(r'납입주기\s*:\s*([^\s,|]+)', row_str)
            if cycle_match:
                row_cycle = cycle_match.group(1)
            else:
                # Check for keywords in row
                if "월납" in row_str or "매월" in row_str or "월보험료" in row_str:
                    row_cycle = "월납"
                elif "연납" in row_str or "1년납" in row_str or "년납" in row_str or "연보험료" in row_str:
                    row_cycle = "연납"
                elif "일시납" in row_str:
                    row_cycle = "일시납"
                    
            # Let's get company and product name
            prod_name = ""
            company = ""
            for col_idx, val in enumerate(row):
                if any(k in val for k in ["변액", "정기"]):
                    prod_name = val
                    if col_idx > 0:
                        company = row[col_idx - 1]
                    else:
                        company = row[0]
                    break
                    
            file_summary["rows"].append({
                "row_idx": idx,
                "company": company,
                "product": prod_name,
                "detected_cycle": row_cycle,
                "snippet": row_str[:150]
            })
            
        results.append(file_summary)
        
    with open(OUTPUT_FILE, "w", encoding="utf-8-sig") as f_out:
        f_out.write(f"Scanned {len(results)} files containing '변액' or '정기'.\n")
        for f in results:
            f_out.write(f"\nFile: {f['file']} ({f['type']}) | Cycles in file text: {f['cycles_in_file']}\n")
            # Group by product and detected cycle
            by_prod = {}
            for r in f["rows"]:
                key = (r["company"], r["product"])
                if key not in by_prod:
                    by_prod[key] = set()
                by_prod[key].add(r["detected_cycle"])
                
            for (comp, prod), cycles in by_prod.items():
                f_out.write(f"  - [{comp}] {prod} => Cycles: {list(cycles)}\n")

if __name__ == "__main__":
    analyze_cycles()
