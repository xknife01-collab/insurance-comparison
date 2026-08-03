import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisSection.tsx"

replacements = {
    # Cancer
    "riders.push({ rider_name: 'Ϲݾܺ', coverage_amount: cancerDiagnosisAmount });": "riders.push({ rider_name: '일반암진단비', coverage_amount: cancerDiagnosisAmount });",
    "riders.push({ rider_name: 'ǥ׾Ͼ๰㰡ġ', coverage_amount: 50000000 });": "riders.push({ rider_name: '표적항암약물치료비', coverage_amount: 50000000 });",
    "riders.push({ rider_name: '׾Ϲ缱๰ġ', coverage_amount: 30000000 });": "riders.push({ rider_name: '특정방사선약물치료비', coverage_amount: 30000000 });",
    "riders.push({ rider_name: 'ܾܺ', coverage_amount: 20000000 });": "riders.push({ rider_name: '재진단암진단비', coverage_amount: 20000000 });",
    
    # Silson
    "riders.push({ rider_name: 'ԿǷ', coverage_amount: 50000000 });": "// Note: line-by-line replace will handle this",
    "riders.push({ rider_name: 'ؿܷǷ', coverage_amount: 250000 });": "riders.push({ rider_name: '상해외래의료비', coverage_amount: 250000 });",
    "riders.push({ rider_name: 'ܷǷ', coverage_amount: 250000 });": "riders.push({ rider_name: '질병외래의료비', coverage_amount: 250000 });",
    "riders.push({ rider_name: '޿3Ư', coverage_amount: silsonNonReimbursable === 'under100' ? 3000000 : 1500000 });": "riders.push({ rider_name: '비급여 3대 특약', coverage_amount: silsonNonReimbursable === 'under100' ? 3000000 : 1500000 });",
    
    # Dental
    "riders.push({ rider_name: 'öƮġ', coverage_amount: dentalImplantLimit === 'unlimited' ? 1500000 : 1000000 });": "riders.push({ rider_name: '임플란트치료비', coverage_amount: dentalImplantLimit === 'unlimited' ? 1500000 : 1000000 });",
    "riders.push({ rider_name: 'ũġ', coverage_amount: dentalCrownAmount });": "riders.push({ rider_name: '크라운치료비', coverage_amount: dentalCrownAmount });",
    "riders.push({ rider_name: 'ġ(η/·)', coverage_amount: dentalFocus === 'conservative' ? 300000 : 150000 });": "riders.push({ rider_name: '보존치료비(인레이/온레이)', coverage_amount: dentalFocus === 'conservative' ? 300000 : 150000 });",
    
    # Surgery
    "riders.push({ rider_name: '', coverage_amount: surgeryFocus === 'wide' ? 1000000 : 500000 });": "riders.push({ rider_name: '질병수술비', coverage_amount: surgeryFocus === 'wide' ? 1000000 : 500000 });",
    "riders.push({ rider_name: 'ؼ', coverage_amount: 1000000 });": "riders.push({ rider_name: '상해수술비', coverage_amount: 1000000 });",
    "riders.push({ rider_name: 'Կϴ', coverage_amount: hospitalAmount });": "riders.push({ rider_name: '질병입원일당', coverage_amount: hospitalAmount });",
    "riders.push({ rider_name: 'λϴ', coverage_amount: 150000 });": "// Note: line-by-line replace will handle this",
    
    # Brain / Heart / Accident / Caregiving
    "riders.push({ rider_name: 'ȯܺ', coverage_amount: selectedBrain });": "riders.push({ rider_name: '뇌혈관질환진단비', coverage_amount: selectedBrain });",
    "riders.push({ rider_name: 'ȯܺ', coverage_amount: selectedHeart });": "riders.push({ rider_name: '허혈성심장질환진단비', coverage_amount: selectedHeart });",
    "riders.push({ rider_name: '', coverage_amount: selectedDisability });": "riders.push({ rider_name: '상해후유장해', coverage_amount: selectedDisability });",
    
    # Dementia
    "riders.push({ rider_name: 'ġܺ', coverage_amount: dementiaDiagnosisAmount });": "riders.push({ rider_name: '중증치매진단비', coverage_amount: dementiaDiagnosisAmount });",
    "riders.push({ rider_name: 'ġŻȰڱ()', coverage_amount: dementiaMonthlyAllowance });": "riders.push({ rider_name: '치매생활자금(월)', coverage_amount: dementiaMonthlyAllowance });",
    
    # Car / Driver
    "riders.push({ rider_name: '빰ѵ', coverage_amount: carPropertyLimit * 100000000 });": "riders.push({ rider_name: '대물배상한도', coverage_amount: carPropertyLimit * 100000000 });",
    "riders.push({ rider_name: 'ڱü/ڵ', coverage_amount: carInjuryType === 'jasang' ? 200000000 : 100000000 });": "riders.push({ rider_name: '자기신체사고/자동차상해', coverage_amount: carInjuryType === 'jasang' ? 200000000 : 100000000 });",
    "riders.push({ rider_name: 'ó', coverage_amount: 200000000 });": "riders.push({ rider_name: '교통사고처리지원금', coverage_amount: 200000000 });",
    "riders.push({ rider_name: 'ڹ()', coverage_amount: 30000000 });": "riders.push({ rider_name: '운전자벌금한도', coverage_amount: 30000000 });",
    "riders.push({ rider_name: 'ȣ缱Ӻ', coverage_amount: 50000000 });": "riders.push({ rider_name: '변호사선임비용', coverage_amount: 50000000 });",
    
    # Statuses
    "      '? 보안 ?신망을 ?전?게 개설?는 ?..',": "      '🔒 보안 통신망을 안전하게 개설하는 중..',",
    "      '? ?국?용?보???보?다보여) ?버 ?결 ?..',": "      '🌐 한국신용정보원(내보험다보여) 서버 연결 중..',",
    "      '? ?품? ?입? ?령, ?별 ?보 ?집 ?료...',": "      '📊 보험 상품별 가입일, 연령, 성별 정보 수집 완료...',",
    "      '? ???이 AI가 0.1?만에 최적??보장 금액???교?게 추정?는 ?..',": "      '⚡ 안티그래비티 AI가 0.1초만에 최적의 보장 금액을 비교하여 추정하는 중..',",
    "      '? Supabase ?? ?계 ?율 ?이??시?매칭 ?산 ?료!',": "      '🧠 Supabase 가입 통계 세부 다이어트 시뮬레이션 매칭 연산 완료!',",
    "      '???장??AI 분석 ?트?리???리모?링 ??보???출 ?료!'": "      '✨ 성공적으로 AI 분석 레포트와 리모델링 권장 정보를 도출 완료!'",
    
    # Typography
    '        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">   м</h2>': '        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">내보험 정밀 분석</h2>',
    '        <p className="text-xl text-gray-500 font-bold italic">" ̹  ,    ?"</p>': '        <p className="text-xl text-gray-500 font-bold italic">"내가 진짜 가입한 보험, 무엇무엇이 맞을까요?"</p>',
    '<p className="text-xl text-gray-500 font-bold italic">" ̹  ,    ?"</p>': '<p className="text-xl text-gray-500 font-bold italic">"내가 진짜 가입한 보험, 무엇무엇이 맞을까요?"</p>'
}

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        lines = f.readlines()
    
    # Perform line-by-line exact adjustments where duplicates exist
    # Line 961: riders.push({ rider_name: 'ԿǷ', coverage_amount: 50000000 });
    # Line 962: riders.push({ rider_name: 'ԿǷ', coverage_amount: 50000000 });
    # Line 975: riders.push({ rider_name: 'λϴ', coverage_amount: 150000 });
    # Line 984: riders.push({ rider_name: 'λϴ', coverage_amount: careSvcType === 'expense' ? 150000 : 100000 });
    
    for i in range(len(lines)):
        line = lines[i]
        
        # Line 961 and 962 (0-indexed 960 and 961)
        if i == 960 and "ԿǷ" in line:
            lines[i] = "          riders.push({ rider_name: '상해입원의료비', coverage_amount: 50000000 });\n"
            continue
        if i == 961 and "ԿǷ" in line:
            lines[i] = "          riders.push({ rider_name: '질병입원의료비', coverage_amount: 50000000 });\n"
            continue
            
        # Line 975 (0-indexed 974)
        if i == 974 and "λϴ" in line:
            lines[i] = "            riders.push({ rider_name: '간병인사용일당', coverage_amount: 150000 });\n"
            continue
            
        # Line 984 (0-indexed 983)
        if i == 983 and "λϴ" in line:
            lines[i] = "          riders.push({ rider_name: '간병인사용일당', coverage_amount: careSvcType === 'expense' ? 150000 : 100000 });\n"
            continue
            
        # General replacements
        for k, v in replacements.items():
            if k in line:
                lines[i] = line.replace(k, v)
                break
                
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Replaced and corrected AnalysisSection.tsx successfully.")
else:
    print("File not found")
