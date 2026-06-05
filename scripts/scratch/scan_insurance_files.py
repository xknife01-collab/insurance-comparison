import os
import io
import re
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def check_file_type_and_cycles(filepath):
    try:
        # Try binary xlrd first
        df = pd.read_excel(filepath, engine='xlrd', header=None)
        file_type = "Binary XLS"
    except Exception as e:
        # Try HTML parsing
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-16']:
                try:
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                        if frames:
                            df = frames[0]
                            file_type = f"HTML ({enc})"
                            break
                except Exception:
                    continue
            else:
                return "Unknown/Failed", None, []
        except Exception:
            return "Failed to open", None, []
            
    # Search for cycle keywords inside the dataframe
    cycles_found = set()
    text_corpus = []
    num_cols = len(df.columns)
    for col in range(num_cols):
        for val in df.iloc[:, col].dropna():
            val_str = str(val)
            text_corpus.append(val_str)
            if "월납" in val_str:
                cycles_found.add("월납")
            if "연납" in val_str or "1년납" in val_str or "년납" in val_str:
                if "연납" in val_str:
                    cycles_found.add("연납")
                if "1년납" in val_str:
                    cycles_found.add("1년납")
                matches = re.findall(r'\d+년납', val_str)
                if matches:
                    for m in matches:
                        cycles_found.add(m)
            if "일시납" in val_str:
                cycles_found.add("일시납")
                
    all_text = " ".join(text_corpus[:200])
    if "월납" in all_text: cycles_found.add("월납")
    if "연납" in all_text: cycles_found.add("연납")
    if "1년납" in all_text: cycles_found.add("1년납")
    if "일시납" in all_text: cycles_found.add("일시납")
    
    return file_type, df, list(cycles_found)

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Found {len(files)} files in source directory.")
    
    html_count = 0
    binary_count = 0
    results = []
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        file_type, df, cycles = check_file_type_and_cycles(filepath)
        
        if "HTML" in file_type:
            html_count += 1
        elif "Binary" in file_type:
            binary_count += 1
            
        if df is not None:
            num_rows = len(df)
            num_cols = len(df.columns)
            products = set()
            for col in range(min(5, num_cols)):
                for val in df.iloc[:, col].dropna():
                    val_str = str(val).strip()
                    if len(val_str) > 5 and any(kw in val_str for kw in ["보험", "공시", "다이렉트", "무배당"]):
                        products.add(val_str)
            prod_sample = list(products)[:3]
        else:
            num_rows = 0
            num_cols = 0
            prod_sample = []
            
        results.append({
            "filename": filename,
            "file_type": file_type,
            "rows": num_rows,
            "cols": num_cols,
            "cycles": cycles,
            "products": prod_sample
        })
        
    print(f"Binary files count: {binary_count}")
    print(f"HTML files count: {html_count}")
    
    report_path = os.path.join(SOURCE_DIR, "insurance-comparison-main", "scripts", "scratch", "scan_results_report.txt")
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(f"Binary files: {binary_count}\n")
        f.write(f"HTML files: {html_count}\n\n")
        for r in results:
            f.write(f"File: {r['filename']} | Type: {r['file_type']} | Shape: ({r['rows']}, {r['cols']}) | Cycles: {r['cycles']}\n")
            f.write(f"  Products Sample: {r['products']}\n")
            f.write("-" * 80 + "\n")
            
    print(f"Saved scan results report to {report_path}")

if __name__ == "__main__":
    main()
