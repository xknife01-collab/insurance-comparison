file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Locate the Full Market Analysis Section (6 spaces indentation)
start_marker = '      {/* 4. Full Market Analysis Section */}'
end_marker = '      </section>'

start_idx = content.find(start_marker)
if start_idx == -1:
    print("Error: Start marker not found")
    exit(1)

# Find the next closing section tag after start_idx
end_idx = content.find(end_marker, start_idx)
if end_idx == -1:
    print("Error: End marker not found")
    exit(1)

# Include the closing section tag itself in the replacement slice
end_idx += len(end_marker)

print(f"Found section from {start_idx} to {end_idx}")

# Slice the section content
section_content = content[start_idx:end_idx]

# Wrap with {!isRemodeling && ( ... )}
wrapped_section = f"""      {{/* 4. Full Market Analysis Section */}}
      {{!isRemodeling && (
{section_content[section_content.find('<section'):]}
      )}}"""

content_new = content[:start_idx] + wrapped_section + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("SUCCESS: Full Market Analysis Section successfully wrapped with !isRemodeling!")
