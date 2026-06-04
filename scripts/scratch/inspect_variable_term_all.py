import os
import io
import pandas as pd
import warnings
import re

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
OUTPUT_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\inspect_variable_term_results.txt"

def detect_file_type_and_inspect():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    html_files = []
    binary_files = []
    
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
            
        if is_html:
            html_files.append(filename)
        else:
            binary_files.append(filename)
            
    variable_term_info = []
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df = None
        method = ""
        
        # Try binary
        if filename in binary_files:
            try:
                df = pd.read_excel(filepath, engine='xlrd', header=None)
                method = "xlrd"
            except Exception as e:
                pass
                
        if df is None:
            # Try HTML
            try:
                with open(filepath, 'rb') as f:
                    raw_bytes = f.read()
                # Check different encodings
                for enc in ['utf-8', 'cp949', 'euc-kr']:
                    try:
                        raw_text = raw_bytes.decode(enc)
                        if '<table' in raw_text.lower():
                            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                            if frames:
                                df = frames[0]
                                method = f"html_{enc}"
                                break
                    except Exception:
                        continue
            except Exception as e:
                pass
                
        if df is None:
            continue
            
        # Clean dataframe to strings
        cleaned_df = df.map(lambda v: str(v).strip() if pd.notna(v) else "")
        
        # Search for products that are "변액" or "정기"
        for i in range(len(cleaned_df)):
            row = cleaned_df.iloc[i].tolist()
            
            # Check if any cell has keywords
            for col_idx, val in enumerate(row):
                if any(k in val for k in ["변액", "정기"]):
                    prod_name = val
                    company = ""
                    if col_idx > 0:
                        company = row[col_idx - 1]
                    else:
                        company = row[0]
                    
                    row_text = " | ".join(row)
                    
                    # Search for payment cycle keywords
                    cycle = "unknown"
                    if any(k in row_text for k in ["월납", "매월", "월보험료"]):
                        cycle = "monthly"
                    elif any(k in row_text for k in ["연납", "1년납", "년납", "연보험료"]):
                        cycle = "annual"
                    elif "일시납" in row_text:
                        cycle = "single"
                        
                    # Let's search the notes (last column/specific columns) for cycle details
                    notes = ""
                    for cell in row:
                        if len(cell) > 50 and any(k in cell for k in ["납", "기준", "주기"]):
                            notes = cell
                            break
                            
                    variable_term_info.append({
                        "file": filename,
                        "method": method,
                        "row_idx": i,
                        "company": company,
                        "product": prod_name,
                        "cycle": cycle,
                        "premium": row[col_idx + 4] if col_idx + 4 < len(row) else "",
                        "notes": notes[:150]
                    })
                    break
                    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write(f"Total files scanned: {len(files)}\n")
        out.write(f"Binary files count: {len(binary_files)}\n")
        out.write(f"HTML files count: {len(html_files)}\n")
        out.write(f"Total matching rows found: {len(variable_term_info)}\n\n")
        
        for idx, item in enumerate(variable_term_info):
            out.write(f"[{idx+1}] File: {item['file']} ({item['method']}) | Row: {item['row_idx']}\n")
            out.write(f"    Company: {item['company']} | Product: {item['product']}\n")
            out.write(f"    Cycle: {item['cycle']} | Premium: {item['premium']}\n")
            out.write(f"    Notes: {item['notes']}\n")
            out.write("-" * 80 + "\n")

    print(f"Results written to {OUTPUT_FILE}")

if __name__ == "__main__":
    detect_file_type_and_inspect()
