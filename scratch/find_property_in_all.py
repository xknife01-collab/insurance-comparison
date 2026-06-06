import os
import pandas as pd
import io
import xlrd
import sys
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
OUTPUT_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\property_in_all_results.txt"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "binary"
    except Exception:
        try:
            df = pd.read_excel(filepath, engine='xlrd', header=None)
            return df, "binary_std"
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
                                return frames[0], "html"
                    except Exception:
                        continue
            except Exception:
                pass
    return None, None

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    property_keywords = ["재물", "화재", "성공메이트", "우리집보험", "비즈앤안전", "홈가드", "하우스", "재산종합"]
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write("### Property/Fire Insurance Scan in All Files\n")
        
        for filename in sorted(files):
            filepath = os.path.join(SOURCE_DIR, filename)
            df, ftype = load_df(filepath)
            if df is None:
                continue
                
            # Check if any cell has property keywords
            is_prop = False
            all_cells_str = []
            for col in df.columns:
                for val in df[col].dropna():
                    val_str = str(val)
                    all_cells_str.append(val_str)
                    if any(kw in val_str for kw in property_keywords):
                        is_prop = True
                        
            if is_prop:
                # Find unique products
                products = set()
                for c in range(min(5, len(df.columns))):
                    for val in df.iloc[:, c].dropna().unique():
                        val_str = str(val).strip()
                        if len(val_str) > 5 and any(kw in val_str for kw in property_keywords + ["보험"]):
                            if not any(co in val_str for co in ["메리츠", "한화", "롯데", "삼성", "현대", "흥국", "신한", "하나", "KB", "NH", "AXA", "손해보험"]):
                                products.add(val_str)
                            elif any(kw in val_str for kw in ["재물", "화재", "성공메이트", "우리집보험", "비즈앤안전", "홈가드", "하우스"]):
                                products.add(val_str)
                
                cycle_hints = []
                for text in all_cells_str:
                    if any(kw in text for kw in ["월납", "연납", "1년납", "연보험료", "월보험료", "납입주기", "일시납"]):
                        cycle_hints.append(text)
                
                out.write(f"\n📂 File: {filename} ({ftype})\n")
                out.write(f"   Products: {sorted(list(products))}\n")
                if cycle_hints:
                    unique_hints = list(set([h.strip().replace('\n', ' ') for h in cycle_hints]))
                    out.write("   Cycle Cues:\n")
                    for hint in unique_hints[:15]:
                        out.write(f"     - {hint[:150]}\n")
                else:
                    out.write("   Cycle Cues: None found\n")

if __name__ == "__main__":
    main()
    print("Completed scanning!")
