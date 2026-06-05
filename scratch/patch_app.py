import os

path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\App.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

target = """           <PetExplanation onAction={() => { setCalcTarget('pet'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }"""

# Normalize target and content for search (using \n)
normalized_target = target.replace("\r\n", "\n")
normalized_content = content.replace("\r\n", "\n")

replacement = """           <PetExplanation onAction={() => { setCalcTarget('pet'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'travel') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <TravelExplanation onAction={() => { setCalcTarget('travel'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }"""

if normalized_target in normalized_content:
    print("Found target!")
    patched_content = normalized_content.replace(normalized_target, replacement)
    # Write back with original line endings
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(patched_content)
    print("Successfully patched App.tsx!")
else:
    print("Target not found.")
