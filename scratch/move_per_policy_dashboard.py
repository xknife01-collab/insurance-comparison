import os

# 1. Modify src/components/AnalysisDashboard.tsx
dashboard_path = r'src/components/AnalysisDashboard.tsx'

with open(dashboard_path, 'r', encoding='utf-8') as f:
    dash_content = f.read()

# Normalize line endings
dash_content = dash_content.replace('\r\n', '\n')

# Add import at the top
target_import = "import ComparisonTable from './ComparisonTable';"
replacement_import = "import ComparisonTable from './ComparisonTable';\nimport { PerPolicyDashboard } from './insurance/remodeling/PerPolicyDashboard';"

# Insert PerPolicyDashboard rendering after ComparisonTable
target_table_render = """      <ComparisonTable 
        analysis={result.analysis}
        recommendation={isRemodeling ? result.recommendations.diet : result.recommendations.upgrade} 
      />"""

replacement_table_render = """      <ComparisonTable 
        analysis={result.analysis}
        recommendation={isRemodeling ? result.recommendations.diet : result.recommendations.upgrade} 
      />

      {/* 보험별 개별 분석 (전체 종합 분석 테이블 아래, 매직 다이어트 가이드 위에 위치) */}
      {isRemodeling && (analysis as any)._remodelingCoverage?.policies?.length > 0 && (
        <div className="mb-20 mt-20 text-left">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] mb-4">
              🔍 Per-Policy Individual Analysis
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">보험 1건씩 개별 정밀 분석</h3>
            <p className="text-gray-400 font-bold italic mt-2">"가입된 보험 하나하나를 독립적으로 분석하여 중복·과납·부족을 정확히 진단합니다."</p>
          </div>
          <PerPolicyDashboard
            policies={(analysis as any)._remodelingCoverage.policies}
            age={(analysis as any).age || 40}
            gender={(analysis as any).gender || 'M'}
          />
        </div>
      )}"""

if target_import not in dash_content:
    print("Error: Target import line not found in AnalysisDashboard.tsx")
    exit(1)

if target_table_render not in dash_content:
    print("Error: Target ComparisonTable render block not found in AnalysisDashboard.tsx")
    exit(1)

dash_content = dash_content.replace(target_import, replacement_import).replace(target_table_render, replacement_table_render)

with open(dashboard_path, 'w', encoding='utf-8') as f:
    f.write(dash_content)

print("SUCCESS: AnalysisDashboard.tsx updated with PerPolicyDashboard inside!")


# 2. Modify src/App.tsx to remove PerPolicyDashboard rendering
app_path = r'src/App.tsx'

with open(app_path, 'r', encoding='utf-8') as f:
    app_content = f.read()

app_content = app_content.replace('\r\n', '\n')

target_app_block = """              {/* 보험별 개별 분석 */}
              {(remodelingResult.analysis as any)._remodelingCoverage?.policies?.length > 0 && (
                <div className="mb-12 mt-24">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] mb-4">
                      🔍 Per-Policy Individual Analysis
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">보험 1건씩 개별 정밀 분석</h3>
                    <p className="text-gray-400 font-bold italic mt-2">"가입된 보험 하나하나를 독립적으로 분석하여 중복·과납·부족을 정확히 진단합니다."</p>
                  </div>
                  <PerPolicyDashboard
                    policies={(remodelingResult.analysis as any)._remodelingCoverage.policies}
                    age={(remodelingResult.analysis as any).age || 40}
                    gender={(remodelingResult.analysis as any).gender || 'M'}
                  />
                </div>
              )}"""

if target_app_block not in app_content:
    print("Error: Target PerPolicyDashboard block not found in App.tsx")
    exit(1)

app_content = app_content.replace(target_app_block, "")

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_content)

print("SUCCESS: App.tsx updated and duplicate PerPolicyDashboard removed!")
