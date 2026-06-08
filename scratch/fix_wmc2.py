with open('src/components/AnalysisDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the wrapping added by previous script
old = '      {!isRemodeling && (\n'
closing = '      )}\n'

if old in content:
    # Find position of our wrapper
    start = content.find(old)
    end = content.find(closing, start) + len(closing)
    # Extract inner content
    inner = content[start + len(old) : content.find(closing, start)]
    # Replace wrapper with inner (unwrapped)
    content = content[:start] + inner + content[end:]

# Now add isRemodeling check to the section tag itself
content = content.replace(
    '      {/* 4. Full Market Analysis Section */}\n      <section className="space-y-16 pb-32">',
    '      {/* 4. Full Market Analysis Section — 리모델링 모드에서 숨김 */}\n      {!isRemodeling && <section className="space-y-16 pb-32">'
)

# Find the closing </section> of this section and add conditional close
# We need to close both section and the conditional
# Find the last </section> before the component return closes
import re
# Replace the specific closing section tag (last one before </div></div>)
# Instead, let's use a different approach: add 'hidden' class when isRemodeling
content = content.replace(
    '      {/* 4. Full Market Analysis Section — 리모델링 모드에서 숨김 */}\n      {!isRemodeling && <section className="space-y-16 pb-32">',
    '      {/* 4. Full Market Analysis Section — 리모델링 모드에서 숨김 */}\n      <section className={`space-y-16 pb-32 ${isRemodeling ? "hidden" : ""}`}>'
)

with open('src/components/AnalysisDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
