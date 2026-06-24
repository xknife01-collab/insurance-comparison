import os
import json

brain_dir = r"C:\Users\zkfnt\.gemini\antigravity\brain"
output_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch"
os.makedirs(output_dir, exist_ok=True)

target_folder = "d56e43ae-f705-4f9f-9c59-511b497f8b25"
log_path = os.path.join(brain_dir, target_folder, ".system_generated", "logs", "overview.txt")

if os.path.exists(log_path):
    print(f"Scanning log: {log_path}")
    try:
        with open(log_path, "r", encoding="utf-8", errors="ignore") as f:
            for line_idx, line in enumerate(f):
                if "PerPolicyDashboard.tsx" in line:
                    try:
                        data = json.loads(line)
                        tool_calls = data.get("tool_calls", [])
                        for tc in tool_calls:
                            name = tc.get("name")
                            args = tc.get("args", {})
                            target = args.get("TargetFile") or args.get("AbsolutePath") or ""
                            if "PerPolicyDashboard.tsx" in target:
                                content = args.get("CodeContent") or args.get("ReplacementContent") or ""
                                if content:
                                    # Write unescaped raw string
                                    out_name = f"perpolicy_clean_{line_idx}_{name}.tsx"
                                    out_path = os.path.join(output_dir, out_name)
                                    with open(out_path, "w", encoding="utf-8") as out_f:
                                        out_f.write(content)
                                    print(f"Saved: {out_name} ({len(content)} chars)")
                    except Exception as e:
                        pass
    except Exception as e:
        print(f"Error reading {log_path}: {e}")
else:
    print(f"Log not found at {log_path}")
