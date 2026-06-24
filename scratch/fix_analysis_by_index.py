import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisSection.tsx"

index_replacements = {
    949: "          riders.push({ rider_name: '일반암진단비', coverage_amount: cancerDiagnosisAmount });\n",
    951: "            riders.push({ rider_name: '표적항암약물치료비', coverage_amount: 50000000 });\n",
    954: "            riders.push({ rider_name: '특정방사선약물치료비', coverage_amount: 30000000 });\n",
    957: "            riders.push({ rider_name: '재진단암진단비', coverage_amount: 20000000 });\n",
    960: "          riders.push({ rider_name: '상해입원의료비', coverage_amount: 50000000 });\n",
    961: "          riders.push({ rider_name: '질병입원의료비', coverage_amount: 50000000 });\n",
    962: "          riders.push({ rider_name: '상해외래의료비', coverage_amount: 250000 });\n",
    963: "          riders.push({ rider_name: '질병외래의료비', coverage_amount: 250000 });\n",
    964: "          riders.push({ rider_name: '비급여 3대 특약', coverage_amount: silsonNonReimbursable === 'under100' ? 3000000 : 1500000 });\n",
    966: "          riders.push({ rider_name: '임플란트치료비', coverage_amount: dentalImplantLimit === 'unlimited' ? 1500000 : 1000000 });\n",
    967: "          riders.push({ rider_name: '크라운치료비', coverage_amount: dentalCrownAmount });\n",
    968: "          riders.push({ rider_name: '보존치료비(인레이/온레이)', coverage_amount: dentalFocus === 'conservative' ? 300000 : 150000 });\n",
    970: "          riders.push({ rider_name: '질병수술비', coverage_amount: surgeryFocus === 'wide' ? 1000000 : 500000 });\n",
    971: "          riders.push({ rider_name: '상해수술비', coverage_amount: 1000000 });\n",
    972: "          riders.push({ rider_name: '질병입원일당', coverage_amount: hospitalAmount });\n",
    974: "            riders.push({ rider_name: '간병인사용일당', coverage_amount: 150000 });\n",
    977: "          riders.push({ rider_name: '뇌혈관질환진단비', coverage_amount: selectedBrain });\n",
    979: "          riders.push({ rider_name: '허혈성심장질환진단비', coverage_amount: selectedHeart });\n",
    981: "          riders.push({ rider_name: '상해후유장해', coverage_amount: selectedDisability });\n",
    983: "          riders.push({ rider_name: '간병인사용일당', coverage_amount: careSvcType === 'expense' ? 150000 : 100000 });\n",
    985: "          riders.push({ rider_name: '중증치매진단비', coverage_amount: dementiaDiagnosisAmount });\n",
    986: "          riders.push({ rider_name: '치매생활자금(월)', coverage_amount: dementiaMonthlyAllowance });\n",
    987: "          riders.push({ rider_name: '대물배상한도', coverage_amount: carPropertyLimit * 100000000 });\n",
    989: "          riders.push({ rider_name: '자기신체사고/자동차상해', coverage_amount: carInjuryType === 'jasang' ? 200000000 : 100000000 });\n",
    991: "          riders.push({ rider_name: '교통사고처리지원금', coverage_amount: 200000000 });\n",
    992: "          riders.push({ rider_name: '운전자벌금한도', coverage_amount: 30000000 });\n",
    993: "          riders.push({ rider_name: '변호사선임비용', coverage_amount: 50000000 });\n",
    1141: '        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">내보험 정밀 분석</h2>\n',
    1142: '        <p className="text-xl text-gray-500 font-bold italic">"내가 진짜 가입한 보험, 무엇무엇이 맞을까요?"</p>\n'
}

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        lines = f.readlines()
        
    for idx, new_content in index_replacements.items():
        if idx < len(lines):
            lines[idx] = new_content
            print(f"Index {idx} overwritten.")
            
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Completed index-based replacement successfully.")
else:
    print("File not found")
