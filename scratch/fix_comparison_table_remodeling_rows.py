file_path = r'src/components/ComparisonTable.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target_consts = """  const isAccident = category.includes('상해') || category === 'accident';
  const isSurgeryHospital = category.includes('수술') || category.includes('입원');"""

replacement_consts = """  const isAccident = category.includes('상해') || category === 'accident';
  const isSurgeryHospital = category.includes('수술') || category.includes('입원');
  const isRemodeling = category === 'remodeling';
  const hasLiabilityRider = (analysis as any)._remodelingCoverage?.policies?.some((p: any) =>
    p.riders?.some((r: any) => /배상책임/.test(r.rider_name))
  ) || false;"""

target_rows = """  // 12. 표준/일반 종합보험 기본행 (그 외 카테고리)
  const standardRows = [
    { 
      label: '일반암 진단비', 
      current: formatAmt(analysis.cancer?.currentAmount ?? 30000000), 
      recommended: '최대 5,000만 원 (가장 빈번한 고액 질병 치료비 선제 확보)', 
      icon: <ShieldCheck className="w-4 h-4 text-orange-500" /> 
    },
    { 
      label: '뇌혈관질환 진단비', 
      current: formatAmt(analysis.cerebrovascular?.currentAmount ?? 10000000), 
      recommended: '최대 3,000만 원 (뇌졸중/뇌동맥류 완벽 보강)', 
      icon: <Brain className="w-4 h-4 text-indigo-500" /> 
    },
    { 
      label: '허혈성 심장질환 진단비', 
      current: formatAmt(analysis.cardiovascular?.currentAmount ?? 10000000), 
      recommended: '최대 3,000만 원 (협심증 및 급성심근경색 완벽 보장)', 
      icon: <Heart className="w-4 h-4 text-red-500" /> 
    },
    { 
      label: '가족 일상생활 배상책임', 
      current: '미가입', 
      recommended: '가입 (대인/대물 과실 누수 사고 시 자기부담금 20만 원 방어)', 
      icon: <TrendingDown className="w-4 h-4 text-orange-500" /> 
    },
  ];"""

replacement_rows = """  // 12. 표준/일반 종합보험 기본행 (그 외 카테고리)
  const standardRows = [
    { 
      label: '일반암 진단비', 
      current: formatAmt(analysis.cancer?.currentAmount ?? 30000000), 
      recommended: isRemodeling 
        ? `${formatAmt(analysis.cancer?.currentAmount ?? 30000000)} (동일 보장 유지 및 보험료 절감)` 
        : '최대 5,000만 원 (가장 빈번한 고액 질병 치료비 선제 확보)', 
      icon: <ShieldCheck className="w-4 h-4 text-orange-500" /> 
    },
    { 
      label: '뇌혈관질환 진단비', 
      current: formatAmt(analysis.cerebrovascular?.currentAmount ?? 10000000), 
      recommended: isRemodeling 
        ? `${formatAmt(analysis.cerebrovascular?.currentAmount ?? 10000000)} (동일 보장 유지 및 보험료 절감)` 
        : '최대 3,000만 원 (뇌졸중/뇌동맥류 완벽 보강)', 
      icon: <Brain className="w-4 h-4 text-indigo-500" /> 
    },
    { 
      label: '허혈성 심장질환 진단비', 
      current: formatAmt(analysis.cardiovascular?.currentAmount ?? 10000000), 
      recommended: isRemodeling 
        ? `${formatAmt(analysis.cardiovascular?.currentAmount ?? 10000000)} (동일 보장 유지 및 보험료 절감)` 
        : '최대 3,000만 원 (협심증 및 급성심근경색 완벽 보장)', 
      icon: <Heart className="w-4 h-4 text-red-500" /> 
    },
    { 
      label: '가족 일상생활 배상책임', 
      current: hasLiabilityRider ? '가입' : '미가입', 
      recommended: hasLiabilityRider 
        ? '가입 유지' 
        : '가입 (대인/대물 과실 누수 사고 시 자기부담금 20만 원 방어)', 
      icon: <TrendingDown className="w-4 h-4 text-orange-500" /> 
    },
  ];"""

content_normalized = content.replace('\r\n', '\n')
target_consts_norm = target_consts.replace('\r\n', '\n')
replacement_consts_norm = replacement_consts.replace('\r\n', '\n')
target_rows_norm = target_rows.replace('\r\n', '\n')
replacement_rows_norm = replacement_rows.replace('\r\n', '\n')

if target_consts_norm not in content_normalized or target_rows_norm not in content_normalized:
    print("Error: Targets not found in ComparisonTable.tsx")
    exit(1)

content_new = content_normalized.replace(target_consts_norm, replacement_consts_norm).replace(target_rows_norm, replacement_rows_norm)

if '\r\n' in content:
    content_new = content_new.replace('\n', '\r\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("SUCCESS: ComparisonTable rows fixed to be dynamic for remodeling mode!")
