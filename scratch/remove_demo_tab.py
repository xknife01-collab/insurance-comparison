file_path = r'src/components/insurance/remodeling/HyphenAuthModal.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Modify the tab array
target_tabs = """        {!loading && (
          <div className="flex border-b border-gray-100 bg-gray-50/50 p-2">
            {[
              { id: 'demo', label: '✨ 데모 시뮬레이션' },
              { id: 'login', label: '🔑 내보험다보여 로그인' },
              { id: 'register', label: '💬 본인인증 회원가입' }
            ].map((tab) => ("""

replacement_tabs = """        {!loading && (
          <div className="flex border-b border-gray-100 bg-gray-50/50 p-2">
            {[
              { id: 'login', label: '🔑 내보험다보여 로그인' },
              { id: 'register', label: '💬 본인인증 회원가입' }
            ].map((tab) => ("""

# 2. Modify body content (remove demo tab content)
target_demo_content = """              {/* TAB 1: DEMO */}
              {activeTab === 'demo' && (
                <div className="space-y-6">
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                    <p className="text-orange-800 font-bold text-xs flex items-center gap-1.5">
                      <Sparkles size={14} /> 데모 모드 안내
                    </p>
                    <p className="text-[11px] text-orange-700 mt-1 leading-relaxed">
                      별도의 본인인증 없이 대표적인 3가지 고객 가상 데이터를 사용해 웅장한 AI 리모델링 분석 대시보드를 시뮬레이션할 수 있습니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'overpaying',
                        title: '보험료 폭탄형 💣',
                        desc: '월 28만원 지불 중',
                        sub: '보장 대비 지출 과다',
                        color: 'hover:border-rose-300 hover:bg-rose-50/10'
                      },
                      {
                        id: 'underinsured',
                        title: '보장 구멍형 🕳️',
                        desc: '월 6만원 지불 중',
                        sub: '필수 특약 대거 미가입',
                        color: 'hover:border-amber-300 hover:bg-amber-50/10'
                      },
                      {
                        id: 'optimal',
                        title: '최적 설계형 💎',
                        desc: '월 12만원 지불 중',
                        sub: '합리적 배분 최상 상태',
                        color: 'hover:border-teal-300 hover:bg-teal-50/10'
                      }
                    ].map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => handleDemoStart(profile.id as any)}
                        className={`p-6 border border-gray-100 rounded-3xl text-left transition-all ${profile.color} active:scale-95 flex flex-col justify-between h-40 group`}
                      >
                        <div>
                          <p className="font-black text-slate-800 text-sm">{profile.title}</p>
                          <p className="text-[11px] text-slate-400 font-bold mt-1">{profile.sub}</p>
                        </div>
                        <p className="font-black text-orange-500 text-sm group-hover:translate-x-1 transition-transform">
                          {profile.desc} →
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}"""

content_normalized = content.replace('\r\n', '\n')
target_tabs_norm = target_tabs.replace('\r\n', '\n')
replacement_tabs_norm = replacement_tabs.replace('\r\n', '\n')
target_demo_content_norm = target_demo_content.replace('\r\n', '\n')

if target_tabs_norm not in content_normalized:
    print("Error: Target tabs array not found in HyphenAuthModal.tsx")
    exit(1)

if target_demo_content_norm not in content_normalized:
    print("Error: Target demo content block not found in HyphenAuthModal.tsx")
    exit(1)

content_new = content_normalized.replace(target_tabs_norm, replacement_tabs_norm).replace(target_demo_content_norm, "")

if '\r\n' in content:
    content_new = content_new.replace('\n', '\r\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("SUCCESS: Demo tab and contents successfully removed from HyphenAuthModal.tsx!")
