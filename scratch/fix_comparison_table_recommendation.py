file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """      <ComparisonTable 
        analysis={result.analysis}
        recommendation={result.recommendations.upgrade} 
      />"""

replacement = """      <ComparisonTable 
        analysis={result.analysis}
        recommendation={isRemodeling ? result.recommendations.diet : result.recommendations.upgrade} 
      />"""

content_normalized = content.replace('\r\n', '\n')
target_normalized = target.replace('\r\n', '\n')
replacement_normalized = replacement.replace('\r\n', '\n')

if target_normalized not in content_normalized:
    print("Error: Target ComparisonTable block in AnalysisDashboard.tsx not found")
    exit(1)

content_new = content_normalized.replace(target_normalized, replacement_normalized)

if '\r\n' in content:
    content_new = content_new.replace('\n', '\r\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("SUCCESS: ComparisonTable recommendation successfully set to conditional (diet / upgrade)!")
