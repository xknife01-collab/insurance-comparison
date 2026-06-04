with open("scripts/scratch/check_variable_term_cycles_results.txt", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()

with open("scripts/scratch/found_annual.txt", "w", encoding="utf-8") as f_out:
    for idx, line in enumerate(lines):
        if any(k in line for k in ["연납", "년납", "1년납"]):
            f_out.write(f"Line {idx+1}: {line.strip()}\n")
