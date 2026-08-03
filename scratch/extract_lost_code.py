import os
import json
import re

brain_dir = r"C:\Users\zkfnt\.gemini\antigravity\brain"
output_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch"
os.makedirs(output_dir, exist_ok=True)

print("Scanning all conversations for AnalysisSection.tsx modifications...")
found_files = []

for folder in os.listdir(brain_dir):
    folder_path = os.path.join(brain_dir, folder)
    if not os.path.isdir(folder_path):
        continue
    log_path = os.path.join(folder_path, ".system_generated", "logs", "overview.txt")
    if os.path.exists(log_path):
        print(f"Scanning log: {log_path}")
        try:
            with open(log_path, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    if "AnalysisSection.tsx" in line:
                        # Try to parse line as JSON
                        try:
                            data = json.loads(line)
                            # Check tool calls
                            tool_calls = data.get("tool_calls", [])
                            for tc in tool_calls:
                                name = tc.get("name")
                                args = tc.get("args", {})
                                target = args.get("TargetFile") or args.get("AbsolutePath") or ""
                                if "AnalysisSection.tsx" in target:
                                    content = args.get("CodeContent") or args.get("ReplacementContent") or ""
                                    if content:
                                        out_name = f"extracted_{folder}_{data.get('step_index')}_{name}.tsx"
                                        out_path = os.path.join(output_dir, out_name)
                                        with open(out_path, "w", encoding="utf-8") as out_f:
                                            out_f.write(content)
                                        print(f"Saved: {out_name} ({len(content)} chars)")
                                        found_files.append(out_path)
                        except Exception as e:
                            pass
        except Exception as e:
            print(f"Error reading {log_path}: {e}")

print("Extraction completed.")
