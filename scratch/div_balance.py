path = r"src/components/insurance/remodeling/PerPolicyDashboard.tsx"
out = r"scratch/div_balance.txt"

with open(path, "r", encoding="utf-8", errors="replace") as f:
    lines = f.readlines()

results = []
depth = 0
for i, line in enumerate(lines[829:1210], start=830):
    opens = line.count('<div') + line.count('<motion.div') + line.count('<AnimatePresence') + line.count('<button') + line.count('<span')
    closes = line.count('</div>') + line.count('</motion.div>') + line.count('</AnimatePresence>') + line.count('</button>') + line.count('</span>')
    # Just track div/motion.div/AnimatePresence
    opens2 = line.count('<div') + line.count('<motion.div') + line.count('<AnimatePresence')
    closes2 = line.count('</div>') + line.count('</motion.div>') + line.count('</AnimatePresence>')
    depth += opens2 - closes2
    if abs(opens2 - closes2) > 0 or depth < 0:
        results.append(f"L{i} [depth={depth}]: {repr(line.strip()[:100])}")

with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(results))
print("Done. Final depth:", depth)
