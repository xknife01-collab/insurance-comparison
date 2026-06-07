import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix closing of hybrid - need to add )} after </motion.div>
# Current: ...switchingLossNotice}\n             </p>\n           </motion.div>\n        </div>
# Need:   ...switchingLossNotice}\n             </p>\n           </motion.div>\n           )}\n        </div>

old = "             {result.recommendations.hybrid.switchingLossNotice}\n             </p>\n           </motion.div>\n        </div>\n      </section>"
new = "             {result.recommendations.hybrid.switchingLossNotice}\n             </p>\n           </motion.div>\n           )}\n        </div>\n      </section>"

if old in content:
    content = content.replace(old, new, 1)
    print('✓ Hybrid closing fixed')
else:
    idx = content.find('recommendations.hybrid.switchingLossNotice')
    print(repr(content[idx:idx+200]))

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f'Final lines: {len(content.splitlines())}')
