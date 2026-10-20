/**
 * 28개 전 보험 종목별 AI 1:1 정밀분석 리포트 템플릿 모듈
 * - 보험업법 및 손해보험·생명보험협회 광고심의 규정 100% 준수
 * - 심의 금지 4대 패턴(임의 단정 수치, 주관적 축소 표현, 안전 마지노선, 비공인 할인율) 전면 배제
 * - 종목별 카테고리 완전 격리(암 특약의 타 종목 침범 원천 차단)
 */

import { InsuranceAnalysis } from '../types/insurance';

export interface AIReportData {
  riskTitle: string;
  riskPercent: number;
  riskStats: string;
  goodPoints: string[];
  badPoints: string[];
  actionTips: string[];
}

export function generateComplianceReportData(
  categoryRaw: string,
  analysis: InsuranceAnalysis,
  deficiencies: string[] = []
): AIReportData {
  const age = analysis.age || 40;
  const decade = Math.floor(age / 10) * 10;
  const gender = analysis.gender === 'F' ? '여성' : '남성';
  const category = (categoryRaw || analysis.selectedCategory || '').toLowerCase();

  // 1. 28개 카테고리 판별 플래그
  const isCancer = category.includes('암') || category.includes('cancer');
  const isBrain = category.includes('뇌') || category.includes('brain');
  const isHeart = category.includes('심장') || category.includes('허혈') || category.includes('heart');
  const isSurgery = category.includes('수술') || category.includes('입원') || category.includes('surgery') || category.includes('hospital');
  const isHealthGeneral = category.includes('종합건강') || category.includes('건강') || category === 'health_general' || category === 'remodeling';
  const isDental = category.includes('치아') || category.includes('dental');
  const isSilbi = category.includes('실손') || category.includes('실비') || category.includes('silson');
  const isPreExisting = category.includes('유병자') || category.includes('pre_existing') || category === 'pre';
  const isAccident = category.includes('상해') || category.includes('accident');
  const isCaregiving = (category.includes('간병') && !category.includes('치매')) || category.includes('care_svc') || category.includes('caregiving');
  const isDementia = category.includes('치매') || category.includes('care_old') || category.includes('dementia');
  const isNursing = category.includes('재가') || category.includes('시설') || category === '재가/시설' || category.includes('nursing');
  const isChild = (category.includes('어린이') || category.includes('신생아') || category.includes('child')) && !category.includes('태아') && !category.includes('pre_family') && !category.includes('child_sick') && !category.includes('유병');
  const isPreFamily = category.includes('태아') && !category.includes('유병');
  const isChildSick = category.includes('child_sick') || category.includes('유병력자') || (category.includes('어린이') && category.includes('유병')) || category === 'pre_family';
  const isDriver = category.includes('운전자') || category.includes('driver');
  const isCar = category.includes('자동차') || category === 'car';
  const isPet = category.includes('펫') || category.includes('pet') || category.includes('반려동물');
  const isFire = (category.includes('주택화재') || category.includes('화재') || category === 'fire_real') && !category.includes('재물');
  const isProperty = category.includes('재물') || category.includes('property') || category.includes('home');
  const isGolf = category.includes('골프') || category.includes('golf') || category.includes('레저');
  const isWholeLife = category.includes('종신') || category.includes('whole');
  const isTerm = category.includes('정기') || category === 'term';
  const isPension = category.includes('연금') || category.includes('annuity') || category.includes('pension');
  const isSavings = (category.includes('저축') && !category.includes('연금')) || category === 'savings_general';
  const isVariable = category.includes('변액') || category.includes('variable');
  const isCredit = category.includes('신용') || category.includes('credit');
  const isLegal = category.includes('법률') || category.includes('legal');

  // 2. 카테고리별 독립 텍스트 생성
  let riskTitle = `${decade}대 ${gender} 생애주기 주요 건강 리스크 진단`;
  let riskPercent = 75;
  let riskStats = `국가 보건 의료 빅데이터에 따르면, ${decade}대 ${gender}은 생애주기별 신체적 변화와 환경적 요인으로 인해 주요 질병 발병 빈도가 이전 연령대 대비 상승합니다. 개인별 치료 환경과 재정 상황에 부합하는 합리적인 안전망 구축이 권장됩니다.`;
  let goodPoints: string[] = ['선택하신 맞춤 플랜은 기본 보장 구조와 보험료 밸런스가 합리적으로 구성되어 있습니다.'];
  let badPoints: string[] = ['주요 보장 항목별 한도 및 갱신 여부를 점검하여 장기 납입 안정성을 보완할 필요가 있습니다.'];
  let actionTips: string[] = ['불필요한 적립 보험료나 중복 특약을 조율하고, 절약된 차액으로 꼭 필요한 핵심 보장을 보완하세요.'];

  // ── [1] 암보험 ──
  if (isCancer) {
    const cancerOpts = (analysis as any).cancer || {};
    const isNonRenewable = cancerOpts.paymentType !== 'renewable';

    if (age >= 40 && age < 50) {
      riskTitle = `📊 40대 ${gender} 암 진단 및 주요 치료비 보장 분석 리포트`;
      riskPercent = 88;
      riskStats = `국가암등록통계에 따르면 40대부터 주요 다빈도 암 발병률이 점진적으로 증가하는 추세를 보입니다. 이 시기는 가정 내 소비 지출 및 경제활동 책임이 큰 구간이므로, 치료비와 투병 기간의 생활 안정을 고려한 균형 있는 진단비 준비가 권장됩니다.`;
      goodPoints = [
        '일반암 진단 시 일시금으로 지급받는 기본 진단비를 중심으로 핵심 치료 자산을 안정적으로 확보하셨습니다.'
      ];
      if (isNonRenewable) {
        goodPoints.push('납입 기간 동안 보험료 인상 부담이 없는 비갱신형 구조를 선택하여 장기적인 유지 안정성을 높이셨습니다.');
      }
      badPoints = [
        '최신 항암 치료 기법(표적·면역 항암 등) 도입에 따른 비급여 본인부담 치료비와 간병 자금 등 개인의 치료 환경에 부합하는 특약 연계의 적정성을 점검해 보실 것을 권장합니다.'
      ];
      actionTips = [
        '개인별 소득 수준과 치료 환경에 맞추어 암 진단비와 최신 비급여 치료 특약을 균형 있게 연계 설계하세요.',
        '신규 설계 시에는 해약환급금을 조율하여 보험료 부담을 낮춘 무(저)해약환급형 또는 세만기 구조를 활용하여 월 납입 부담을 덜어내세요.'
      ];
    } else if (age >= 50) {
      riskTitle = `📊 50대 이상 시니어 암 진단 및 치료비 종합 분석 리포트`;
      riskPercent = 94;
      riskStats = `국가암등록통계에 따르면 50대 이상 연령층은 신체 면역력 저하와 세포 노화로 인해 중증 질환 발생 확률이 증가합니다. 치료 기술의 발전으로 생존율은 지속적으로 향상되고 있으나 고액 비급여 치료비 부담을 경감할 수 있는 든든한 치료 자산 마련이 중요해지고 있습니다.`;
      goodPoints = [
        '주요 암 진단 시 고액의 의료비 지출을 방어할 수 있도록 핵심 진단비 중심의 보장 구조를 마련하셨습니다.'
      ];
      if (isNonRenewable) {
        goodPoints.push('은퇴 이후 보험료 납입 부담이 없도록 납입 기간이 정해진 비갱신형 설계를 채택하셨습니다.');
      }
      badPoints = [
        '표적항암제, 세기조절 방사선 치료 등 최신 비급여 암 치료 트렌드에 대비한 특정 치료비 특약의 보장 범위가 적정하게 연계되어 있는지 점검해 보실 것을 권장합니다.'
      ];
      actionTips = [
        '최신 비급여 항암 치료비를 실속 있게 보완할 수 있는 암주요치료비 및 표적치료 특약 연계를 검토해 보세요.',
        '기존 병력이나 복용 중인 약물이 있더라도 최신 간편심사 제도를 활용하면 합리적인 맞춤 설계가 가능합니다.'
      ];
    } else {
      riskTitle = `🌱 2030 청년기 암 진단 및 주요 치료 자산 분석 리포트`;
      riskPercent = 45;
      riskStats = `20대와 30대는 평생 보장의 주춧돌을 세우는 가장 최적의 시기입니다. 연령이 낮아 보험료가 합리적이며, 건강 상태가 양호할 때 비갱신형 세만기 보장 자산을 준비하는 것이 장기적인 재정 안정에 기여합니다.`;
      goodPoints = [
        '보험료 부담이 가장 적은 건강한 청년기 연령대로서 표준체 조건으로 실속 있는 보장 자산을 준비하고 계십니다.'
      ];
      if (isNonRenewable) {
        goodPoints.push('젊을 때 완납 후 노년기까지 보장받을 수 있는 비갱신형 세만기 구조를 선택하셨습니다.');
      }
      badPoints = [
        '장기적인 물가 상승 및 의료비 인상을 고려하여, 현재 구성하신 진단비 한도가 미래 치료 환경에 부합하는지 주기적인 점검이 필요합니다.'
      ];
      actionTips = [
        '향후 보험료가 오르지 않는 비갱신형 세만기(90세 또는 100세 만기)를 기본 뼈대로 세우세요.',
        '해약환급금을 줄여 월 납입료 부담을 낮춘 무(저)해약환급형 구조를 활용하여 가성비를 극대화하세요.'
      ];
    }
  }

  // ── [2] 뇌혈관질환보험 ──
  else if (isBrain) {
    riskTitle = `🧠 뇌혈관질환 진단 및 수술 치료비 보장 분석 리포트`;
    riskPercent = 82;
    riskStats = `통계청 사망원인통계에 따르면 뇌혈관질환은 우리나라 주요 사망 원인 상위권에 속하며, 치료 후 장기 재활 및 후유장해 위험이 큽니다. 뇌출혈뿐만 아니라 뇌경색과 뇌동맥류 등 초기 혈관 질환까지 폭넓게 포괄하는 담보 구성이 권장됩니다.`;
    
    const brainOpts = (analysis as any).cerebrovascular || (analysis as any).brain || {};
    goodPoints = [
      '뇌출혈이나 뇌졸중에 국한되지 않고 초기 뇌동맥류 및 기타 뇌혈관 질환까지 폭넓게 포괄하는 진단비를 확보하셨습니다.'
    ];

    if (brainOpts.surgeryBenefit) {
      goodPoints.push('진단비와 더불어 혈관 수술 시 반복 지원되는 뇌혈관질환 수술비 특약을 함께 구성하여 장기 치료비 방어선을 구축하셨습니다.');
    }
    if (brainOpts.paymentType !== 'renewable') {
      goodPoints.push('납입 기간 동안 보험료 인상 부담이 없는 비갱신형 구조를 선택하여 장기적인 유지 안정성을 높이셨습니다.');
    }

    if (brainOpts.surgeryBenefit) {
      badPoints = [
        '급성기 치료 이후 재활 및 후유장해 발생 위험을 고려하여, 장기 간병이나 재활 치료비 대비 수준을 균형 있게 점검해 보실 것을 권장합니다.'
      ];
    } else {
      badPoints = [
        '뇌혈관 질환은 재수술 및 스텐트 삽입 등 시술 빈도가 높으므로, 필요 시 반복 지급되는 뇌혈관 수술비 특약의 추가 연계 적정성을 점검해 보실 것을 권장합니다.'
      ];
    }

    actionTips = [
      '관혈/비관혈 수술비 및 산정특례 대상 등록 시 지원되는 특약을 함께 구성하여 장기 치료비 부담을 완화하세요.',
      '뇌혈관 질환 진단 후 발생할 수 있는 후유장해 및 재활 치료 특약을 균형 있게 검토하여 장기 치료 안전망을 완성하세요.'
    ];
  }

  // ── [3] 심장질환보험 (허혈성) ──
  else if (isHeart) {
    riskTitle = `❤️ 심장·심혈관질환(허혈성 및 심혈관) 보장 분석 리포트`;
    riskPercent = 75;
    riskStats = `통계청 사망원인통계에 따르면 심장질환은 한국인의 주요 사망 원인 중 상위권을 차지하고 있습니다. 급성심근경색증뿐만 아니라 협심증 등 허혈성 심장질환과 부정맥·심부전 등 심혈관 질환 전반에 대한 체계적인 보장 준비가 중요해지고 있습니다.`;
    
    const heartLevel = (analysis as any).heartCoverageLevel || 'standard';
    if (heartLevel === 'premium') {
      goodPoints = [
        '급성심근경색과 협심증은 물론, 부정맥과 심부전까지 폭넓게 포괄하는 심혈관질환 통합 안전망을 검토하고 계십니다.'
      ];
      badPoints = [
        '심장질환은 스텐트 삽입술 등 반복적 시술 가능성이 있으므로, 진단비와 함께 심혈관 관혈/비관혈 수술비 특약의 연계 적정성을 점검해 보실 것을 권장합니다.'
      ];
    } else if (heartLevel === 'basic') {
      goodPoints = [
        '위중도가 높은 급성심근경색증 진단 시 집중적인 보장을 받을 수 있도록 핵심 담보를 준비하셨습니다.'
      ];
      badPoints = [
        '발생 빈도가 높은 협심증이나 허혈성 심장질환 전반에 대한 보장 공백 여부를 점검하여 보장 범위 확대를 검토해 보실 것을 권장합니다.'
      ];
    } else {
      goodPoints = [
        '급성심근경색증 외에 일상에서 발생 빈도가 높은 협심증까지 보장하는 허혈성 심장질환 담보를 안정적으로 검토하고 계십니다.'
      ];
      badPoints = [
        '부정맥, 심방세동, 심부전 등 허혈성 범위를 벗어나는 심혈관 질환에 대한 보장 공백 여부를 점검해 보실 것을 권장합니다.'
      ];
    }

    actionTips = [
      '심혈관 특정질환 진단비와 스텐트 삽입 등 혈관성형 수술비를 연계하여 종합적인 심장 안전망을 마련하세요.',
      '만기까지 보험료 변동이 없는 비갱신형 플랫레이트 구조를 검토하여 장기적인 유지 안정성을 확보하세요.'
    ];
  }

  // ── [4] 수술·입원비보험 ──
  else if (isSurgery) {
    riskTitle = `🏥 질병·상해 수술 및 입원 치료비 보장 분석 리포트`;
    riskPercent = 70;
    riskStats = `국민건강보험공단 주요수술통계연보에 따르면 백내장, 관절, 척추 등 다빈도 수술 건수가 매년 꾸준히 증가하고 있어, 수술 시 발생하는 본인부담 치료비 부담을 완화할 수 있는 합리적인 수술·입원비 준비가 중요해지고 있습니다.`;
    
    const surgOpts = (analysis as any).surgery_hospital || {};
    const surgFocus = surgOpts.focus || surgOpts.surgeryFocus || 'wide';
    if (surgFocus === 'named') {
      goodPoints = ['1~5종 정밀 요율형 스타일을 선택하여 수술 난이도별 차등 고액 보장이 가능하도록 구성하셨습니다.'];
    } else if (surgFocus === 'major') {
      goodPoints = ['중증 집중 보장형 스타일을 선택하여 암·뇌·심장 등 핵심 중증 질환 수술 위험을 집중 대비하셨습니다.'];
    } else {
      goodPoints = ['질병과 상해를 아우르는 광범위 수술 보장 스타일을 선택하여 생활 속 다양한 수술 치료에 폭넓게 대비하셨습니다.'];
    }

    if (surgOpts.hospitalAmount && surgOpts.hospitalAmount > 0) {
      goodPoints.push(`1일당 입원비 목표액(${Number(surgOpts.hospitalAmount).toLocaleString()}원)을 설정하여 입원 치료 시 병실료 부담을 실속 있게 보완하셨습니다.`);
    }

    badPoints = [
      '수술 기법 발전 및 장기 입원 등 치료 환경 변화에 맞추어 본인에게 꼭 필요한 수술 보장 범위와 1일당 입원비 목표액이 적정하게 설정되었는지 점검해 보실 것을 권장합니다.'
    ];
    actionTips = [
      '수술 부위별 정액 보장과 입원일당 보장을 균형 있게 구성하여 치료 시 실제 발생하는 환자 본인부담금을 안정적으로 방어하는 구조로 준비하세요.',
      '비갱신형 수술비 위주로 구성하여 향후 연령 증가에 따른 수술비 보험료 인상 부담을 원천 방어하세요.'
    ];
  }

  // ── [5] 종합건강보험 ──
  else if (isHealthGeneral) {
    riskTitle = `🛡️ 3대 질병(암·뇌·심) 및 주요 의료비 종합 보장 분석 리포트`;
    riskPercent = 75;
    riskStats = `국민보건의료통계에 따르면 3대 질병(암·뇌혈관·심장질환) 진단 시 고액의 비급여 치료비뿐만 아니라 실직으로 인한 가계 소득 단절 위험이 큽니다. 진단비와 핵심 치료 특약이 균형 있게 조립된 종합 보장 자산 마련이 장기적인 재정 안정에 기여합니다.`;
    
    const hgOpts = (analysis as any).healthGeneral || {};
    goodPoints = [
      '암·뇌혈관·허혈성 심장질환 등 3대 주요 질환 진단비를 균형 있게 조립하여 단일 증권으로 통합 관리 편의성을 갖추셨습니다.'
    ];
    if (hgOpts.has1to5Surgery) {
      goodPoints.push('질병·상해 1~5종 수술비 특약을 함께 구성하여 치료 시 본인부담 완화 능력을 높이셨습니다.');
    }
    if (hgOpts.hasTargetedTherapy) {
      goodPoints.push('부작용을 낮춘 최신 3세대 표적항암약물치료비 특약을 연계하여 비급여 치료를 대비하셨습니다.');
    }
    if (!hgOpts.isRenewable) {
      goodPoints.push('만기까지 보험료 인상 걱정 없는 비갱신형 구조를 채택하여 장기 유지 안정성을 확보하셨습니다.');
    }

    badPoints = [
      '종합건강보험은 보장 범위가 넓은 만큼 연령 증가에 따른 보험료 납입 부담을 고려하여, 비갱신형 세만기 구조와 필수 핵심 특약 위주의 적정 구성을 점검해 보실 것을 권장합니다.'
    ];
    actionTips = [
      '3대 질병 진단비의 보장 범위(뇌출혈 vs 뇌혈관, 급성심근경색 vs 허혈성·심혈관)가 폭넓게 구성되었는지 확인하세요.',
      '해약환급금을 줄여 보험료를 낮춘 무(저)해약환급형 또는 세만기 구조를 활용하여 가성비를 극대화하세요.'
    ];
  }

  // ── [6] 치아보험 ──
  else if (isDental) {
    riskTitle = `🦷 치아보험(보존·보철치료) 보장 분석 리포트`;
    riskPercent = 65;
    riskStats = `치과 진료는 국민건강보험의 비급여 항목 비율이 높아 개인이 부담하는 비용이 클 수 있습니다. 특히 영구치 보존 치료나 임플란트 시술은 치료비 부담이 발생할 수 있으므로 치아 건강 상태와 치료 계획에 따른 맞춤형 플랜 준비가 권장됩니다.`;
    
    const dentalOpts = (analysis as any).dental || {};
    const dentalFocus = dentalOpts.focus || 'prosthetic';
    const diagType = dentalOpts.diagnosticType || 'non-diagnostic';

    if (dentalFocus === 'conservative') {
      goodPoints = [
        '충치 치료, 레진, 인레이, 크라운 등 일상에서 자주 발생하는 보존치료 보장을 중심으로 실속 있게 설계하셨습니다.'
      ];
    } else {
      goodPoints = [
        '임플란트, 브릿지 등 고액의 치과 치료비가 발생하는 보철치료 보장을 중점적으로 대비하셨습니다.'
      ];
    }

    if (diagType === 'non-diagnostic') {
      goodPoints.push('치과 내원 진단서 제출 부담을 덜고 간편 고지 기준으로 신속하게 가입 가능한 무진단형 플랜을 검토 중이십니다.');
    } else {
      goodPoints.push('치과 사전 검진을 통해 보장 개시 시점 및 조건을 정밀하게 확인하는 진단형 플랜을 검토 중이십니다.');
    }

    badPoints = [
      '치아보험은 질병 치료 시 면책기간 및 감액기간이 적용될 수 있으므로, 본인의 치료 계획 시점과 상품별 보장 개시일을 점검해 보실 것을 권장합니다.'
    ];
    actionTips = [
      '향후 보철 치료나 충치 치료 계획이 있다면 연간 보장 한도와 본인 부담 조건을 사전에 면밀히 확인하세요.',
      '치아보험은 가입 후 일정 기간 동안 면책 및 감액 조건이 운영될 수 있으므로, 치료를 시작하기 전 보장 개시 시점을 미리 확인하시는 것이 유리합니다.'
    ];
  }

  // ── [7] 실손의료비 (의료실비) ──
  else if (isSilbi) {
    riskTitle = `💧 4세대 실손의료보험 표준 보장 및 의료비 매칭 분석`;
    riskPercent = 70;
    riskStats = `국민건강보험 진료비 실태조사에 따르면 의료비 중 비급여 진료비 비중이 꾸준히 증가하고 있어, 실제 발생한 입원·통원 의료비를 보장하는 4세대 실손의료보험의 자기부담금 및 보장 구조 이해가 중요합니다.`;
    
    const silsonOpts = (analysis as any).silson || {};
    const hasCurrent = silsonOpts.hasCurrent;
    if (hasCurrent === 'no') {
      goodPoints = [
        '국민건강보험 급여 본인부담금과 비급여 의료비를 폭넓게 보전할 수 있는 4세대 실손의료비 기초 안전망을 검토하고 계십니다.'
      ];
    } else if (hasCurrent === 'yes') {
      goodPoints = [
        '현재 보유 중인 실손 보장과 4세대 실손의 자기부담금 비율 및 보험료 차이를 합리적으로 대조 중이십니다.'
      ];
    } else {
      goodPoints = [
        '질병과 상해로 인한 입원·통원 치료 시 실제 부담한 의료비를 안정적으로 방어할 수 있는 표준 실손 보장 구조를 검토 중이십니다.'
      ];
    }

    badPoints = [
      '4세대 실손의료비는 직전 1년간 비급여 의료 이용량에 따라 보험료 할인 또는 할증 제도가 차등 적용되므로, 본인의 평소 병원 이용 패턴을 사전에 점검해 보실 것을 권장합니다.'
    ];
    actionTips = [
      '4세대 실손은 직전 1년간 비급여 지급 보험금에 따라 비급여 특약의 보험료 할인 또는 할증 제도가 단계별로 차등 적용되므로, 본인의 평소 의료 이용 성향을 고려하여 신중히 검토하세요.',
      '실손보험은 실제 부담한 치료비 한도 내에서만 비례 보상되므로, 다른 실손 계약과의 중복 가입 여부를 사전에 확인하세요.'
    ];
  }

  // ── [8] 유병자간편보험 ──
  else if (isPreExisting) {
    const rawType = (analysis as any).pre_existing_type || (analysis as any).preExistingType || '3.2.5';
    const typeLabel = 
      rawType === '3.5.5' ? '3·5·5 우대 고지형' :
      rawType === '3.3.5' ? '3·3·5 실속 고지형' :
      rawType === '3.2.5' ? '3·2·5 일반 간편형' :
      rawType === '3.0.5' ? '3·0·5 초간편형' : '간편심사형';

    riskTitle = `🩺 유병자 간편심사(${typeLabel}) 맞춤 보장 분석 리포트`;
    riskPercent = 85;
    riskStats = `질병관리청 통계에 따르면 만성질환 유병자 비율이 매년 증가하고 있으나, 최근 간편심사 상품의 세분화로 고지 항목이 다양해졌습니다. 본인의 병원 치료 이력 및 무사고 기간을 정확히 대조하면 할증 부담을 완화하고 합리적인 보장을 마련할 수 있습니다.`;
    
    if (rawType === '3.5.5') {
      goodPoints = [
        '최근 5년간 입원·수술 무사고 요건을 충족하여, 간편심사 중 가장 유리한 우대 요율 플랜(3·5·5형)으로 합리적인 보장을 구성하셨습니다.'
      ];
    } else if (rawType === '3.3.5' || rawType === '3.2.5') {
      goodPoints = [
        '치료 이력 이후 경과 기간을 정확히 반영하여 본인 조건에 가입 가능한 최적의 간편심사 플랜으로 실속 있게 설계하셨습니다.'
      ];
    } else {
      goodPoints = [
        '고지 문턱을 대폭 낮춘 초간편 플랜을 활용하여 발생 가능한 주요 의료비 공백을 선제적으로 방어하셨습니다.'
      ];
    }

    badPoints = [
      '유병자(간편심사) 보험은 가입 심사가 간소화된 반면 일반 표준체 대비 보험료 수준이 다를 수 있으므로, 본인에게 꼭 필요한 핵심 담보 위주로 구성되어 있는지 점검해 보실 것을 권장합니다.'
    ];
    actionTips = [
      '가입 이후 일정 기간 동안 추가적인 입원이나 수술 없이 건강 상태가 유지될 경우, 보다 유리한 고지 유형이나 일반 표준체로 전환 가능한 제도가 있는지 주기적으로 점검하세요.',
      '중복 가입되거나 불필요한 특약을 점검하여 장기적으로 안정적인 유지가 가능한 보험료 수준을 맞추세요.'
    ];
  }

  // ── [9] 상해보험 ──
  else if (isAccident) {
    riskTitle = `⚡ 일상생활 및 상해사고(골절·수술·후유장해) 보장 분석 리포트`;
    riskPercent = 55;
    riskStats = `생활안전사고 통계에 따르면 낙상, 교통사고, 운동 중 부상 등 일상 속 상해 사고 위험은 연령에 관계없이 발생합니다. 신체적 장해 발생 시 경제활동 공백을 보완하는 후유장해 중심의 든든한 설계가 권장됩니다.`;
    
    const accidentOpts = (analysis as any).accident || {};
    goodPoints = [
      '일상생활 및 야외 활동 중 예기치 않게 발생하는 상해 사고에 대비한 생활 안전망을 검토하고 계십니다.'
    ];

    if (accidentOpts.hasLeisureRider) {
      goodPoints.push('등산, 골프, 자전거 등 야외 취미 및 레저활동 중 발생할 수 있는 사고 위험을 특약으로 꼼꼼히 대비하셨습니다.');
    }

    if (accidentOpts.accidentDisabilityLimit >= 100000000) {
      goodPoints.push('신체 장해 발생 시 소득 공백을 완화할 수 있도록 상해후유장해(3% 이상) 담보를 든든하게 설정하셨습니다.');
    } else if (accidentOpts.fractureLimit > 0 || accidentOpts.surgeryLimit > 0) {
      goodPoints.push('골절 진단비 및 상해 수술비 등 일상에서 빈번하게 발생하는 생활 밀착형 치료 담보를 연계하셨습니다.');
    }

    badPoints = [
      '상해보험은 가입 당시의 직무 위험도(직업급수)와 운전 형태를 기준으로 인수되므로, 향후 직업이나 직무, 운전 방식에 변경이 생길 경우 보험회사에 즉시 알리는 통지의무를 준수해야 안전하게 보장받으실 수 있습니다.'
    ];

    actionTips = [
      '자가용 운전이나 야외 활동 빈도에 맞추어 상해후유장해(3~100%)와 상해수술비의 보장 비율을 균형 있게 점검하세요.',
      '직업이나 직무 변경(예: 사무직에서 현장직/영업용 운전 등) 시 반드시 보험사에 변경 사실을 통지하여 보상 공백을 예방하세요.'
    ];
  }

  // ── [10] 간병보험 (지원/일당) ──
  else if (isCaregiving) {
    riskTitle = `👵 간병인 지원·사용일당 및 노후 케어 보장 분석 리포트`;
    riskPercent = 80;
    riskStats = `노인장기요양보험 통계연보에 따르면 고령화와 핵가족화로 인해 장기 입원 시 간병 인력 활용 수요가 크게 증가하고 있습니다. 예상치 못한 간병비 지출에 대비하여 환자 본인과 가족의 경제적 부담을 완화하는 맞춤형 간병 안전망 설계가 권장됩니다.`;
    
    const careOpts = (analysis as any).caregiving || {};
    const isStepUp = careOpts.isStepUp ?? (analysis as any).isStepUp ?? false;
    const careType = careOpts.type ?? (analysis as any).careType ?? 'expense';
    const isNursingHospital = careOpts.isNursingHospital ?? (analysis as any).isNursingHospital ?? false;
    const focusIntegrated = careOpts.focusIntegrated ?? false;

    goodPoints = [
      '노후 리스크의 큰 비중을 차지하는 장기 케어(간병비) 필요성을 사전에 인지하고 자산 방어선을 설계 중이십니다.'
    ];

    if (isStepUp) {
      goodPoints.push('물가 및 간병인 인건비 상승에 대비하여 보장 한도가 점진적으로 증액되는 체증형 구조를 선제적으로 채택하셨습니다.');
    }

    if (careType === 'support') {
      goodPoints.push('간병인 구인의 번거로움 없이 보험사를 통해 전문 인력을 직접 파견받을 수 있는 지원형 플랜을 선택하셨습니다.');
    } else {
      goodPoints.push('원하는 간병인을 가족이나 전문 업체에서 자유롭게 선택하고 실제 사용 비용을 일당으로 지급받는 유연성을 확보하셨습니다.');
    }

    if (isNursingHospital) {
      goodPoints.push('일반 병실 대비 보장이 축소되기 쉬운 요양병원 입원 시에도 든든한 간병 혜택을 연계하셨습니다.');
    }

    if (focusIntegrated) {
      goodPoints.push('병원 자체 간병 시스템을 활용하는 간호간병통합서비스 병동 이용 시 추가 지원 혜택을 확보하셨습니다.');
    }

    badPoints = [
      '간병인 지원 및 사용일당 특약은 1회 입원당 또는 연간 최대 보장 일수(최대 180일 등) 및 요양병원 입원 시 지급 차등 기준이 상이할 수 있으므로, 세부 약관상의 면책·감액 조건을 점검해 보실 것을 권장합니다.'
    ];

    actionTips = [
      '입원 병동(일반병원 vs 요양병원 vs 간호간병통합병동)에 따른 일당 지급 기준을 사전 확인하여 치료 계획을 수립하세요.',
      '만기까지 보험료 인상 걱정 없는 비갱신형 플랫레이트 구조인지 점검하여 장기 유지 안정성을 확보하세요.'
    ];
  }

  // ── [11] 치매 간병보험 ──
  else if (isDementia) {
    riskTitle = `🧠 인지장애 단계별(CDR 1~3점) 진단비 및 생활자금 보장 분석 리포트`;
    riskPercent = 80;
    riskStats = `보건복지부·중앙치매센터 대한민국 치매현황 통계에 따르면 65세 이상 노인 인구의 치매 환자 수가 지속적으로 증가하고 있습니다. 초기 일상생활이 가능한 경증 치매(CDR 1점)부터 중증 치매(CDR 3점)까지 인지장애 진행 단계별 진단비와 장기 생활비를 균형 있게 준비하는 것이 중요합니다.`;
    
    const demOpts = (analysis as any).caregiving || {};
    const isMild = demOpts.subType === 'mild' || (analysis as any).selectedDetail === 0;
    const isSevere = demOpts.subType === 'severe' || (analysis as any).selectedDetail === 1;
    const hasProxy = demOpts.hasProxyClaim ?? true;
    const serviceType = demOpts.preferredService || 'home';

    goodPoints = [];

    if (isMild) {
      goodPoints.push('초기 일상생활이 가능한 경증 치매(CDR 1점) 단계부터 조기 진단비를 수령할 수 있도록 실속 있게 설계하셨습니다.');
    } else if (isSevere) {
      goodPoints.push('장기 요양 및 지속적 간병비 지출이 발생하는 중증 치매(CDR 3점) 단계에 대비하여 매월 생활자금을 집중 대비하셨습니다.');
    } else {
      goodPoints.push('중증 치매뿐만 아니라 초기 경증 치매 단계부터 치료비와 간병 자금을 단계별로 준비하시는 접근이 훌륭합니다.');
    }

    if (hasProxy) {
      goodPoints.push('치매 발병 시 본인의 인지 저하로 인한 청구 누락을 방지하기 위해 지정대리청구인 사전 신청을 완료하셨습니다.');
    }

    if (serviceType === 'home') {
      goodPoints.push('익숙한 가정 내에서 요양보호사의 돌봄을 지원받는 재가급여 중심의 안심 케어 플랜을 채택하셨습니다.');
    } else if (serviceType === 'facility') {
      goodPoints.push('전문 요양시설이나 요양원 입소 시 발생하는 고정 요양비 부담을 완화하는 시설급여 중심 플랜을 검토 중이십니다.');
    } else {
      goodPoints.push('가정 내 재가요양과 요양원 시설 입소를 모두 아우르는 통합 간병 케어 플랜을 검토 중이십니다.');
    }

    badPoints = [
      '치매보험은 전문의(신경과·정신건강의학과)의 임상치매척도(CDR) 판정 및 뇌영상 검사(CT·MRI) 결과의 일치 여부에 따라 지급 심사가 진행되므로, 가입 전 세부 약관의 진단확정 요건을 확인해 보실 것을 권장합니다.'
    ];

    actionTips = [
      hasProxy 
        ? '치매 단계별(경도 CDR 1점 ➔ 중등도 CDR 2점 ➔ 중증 CDR 3점) 진단비 차등 지급률과 세만기 비갱신 구조를 점검하세요.'
        : '치매 발병 시 가족이 원활하게 보험금을 대리 수령할 수 있도록 가입 후 즉시 지정대리청구인을 등록하세요.',
      '만기까지 보험료 인상 없이 유지할 수 있는 비갱신형 플랫레이트 구조인지 확인하여 장기 유지 안정성을 높이세요.'
    ];
  }

  // ── [12] 재가·시설 요양보험 ──
  else if (isNursing) {
    riskTitle = `🏡 국가 장기요양등급 연계 방문요양 및 시설 입소 지원 보장 분석 리포트`;
    riskPercent = 80;
    riskStats = `보건복지부·국민건강보험공단 장기요양 실태조사에 따르면 등급 판정 후 요양원 입소나 방문요양·방문목욕 서비스를 이용하는 재가 요양 환자가 지속적으로 증가하고 있습니다. 국가 장기요양등급(1~5등급) 판정 시 발생하는 본인부담금과 간병 고정비를 안정적으로 수령하는 플랜이 권장됩니다.`;
    
    const nursingOpts = (analysis as any).nursing || {};
    const prefService = nursingOpts.preferredService || 'both';
    const homeAmt = nursingOpts.homeAmount || 500000;
    const facilityAmt = nursingOpts.facilityAmount || 500000;
    const hasProxy = nursingOpts.hasProxyClaim ?? true;

    goodPoints = [
      '국가 장기요양등급 판정 시 매월 정기 지원금을 수령할 수 있는 공적 제도 연계 안전망을 체계적으로 검토 중이십니다.'
    ];

    if (prefService === 'both') {
      goodPoints.push('가정 내 재가요양(방문요양·주야간보호)과 전문 요양원 시설 입소를 상호 보완적으로 묶어 간병 환경 변화에 빈틈없이 대비하셨습니다.');
    } else if (prefService === 'home') {
      goodPoints.push('익숙한 자택에서 가족과 함께 생활하며 방문요양·방문목욕 등 생활 밀착형 재가 케어를 안정적으로 지원받도록 실속 있게 설계하셨습니다.');
    } else {
      goodPoints.push('중증 요양 상태 시 발생하는 전문 요양원 입소 비용과 고정 요양비 부담을 집중 방어하도록 설계하셨습니다.');
    }

    if (prefService !== 'facility' && homeAmt >= 700000) {
      goodPoints.push(`재가급여 월 최대 ${(homeAmt / 10000).toLocaleString()}만 원 지원 한도를 설정하여 가정 내 전문 간병 인력 활용 여력을 충실히 확보하셨습니다.`);
    }

    if (prefService !== 'home' && facilityAmt >= 700000) {
      goodPoints.push(`시설급여 월 최대 ${(facilityAmt / 10000).toLocaleString()}만 원 지원 한도를 설정하여 요양원 비급여 식재료비 등 실비 지출에 든든하게 대비하셨습니다.`);
    }

    if (hasProxy) {
      goodPoints.push('장기요양 상태 시 본인 직접 청구의 어려움을 대비해 지정대리청구인 사전 신청을 완료하셨습니다.');
    }

    badPoints = [
      '재가·시설 요양보험은 국민건강보험공단의 노인장기요양보험 1~5등급(또는 인지지원등급) 인정 판정을 받아야 보장이 개시되며, 재가급여의 경우 월 1회 이상 실제 급여 이용 확인 등 세부 지급 요건이 적용되므로 가입 전 약관의 지급 기준을 점검해 보실 것을 권장합니다.'
    ];

    actionTips = [
      '공단 장기요양등급 인정 신청 절차와 판정 등급별(1~2등급 중증 vs 3~5등급) 보장 차등 지급 기준을 사전 확인하세요.',
      '만기까지 보험료가 인상되지 않는 비갱신형 플랫레이트 구조인지 확인하여 장기 유지 안정성을 높이세요.'
    ];
  }

  // ── [13] 어린이/신생아보험 ──
  else if (isChild) {
    riskTitle = `👼 소중한 자녀를 위한 성장기 질환 및 종합 안심 보장 분석 리포트`;
    riskPercent = 50;
    riskStats = `통계청 출생통계 및 건강보험심사평가원 소아 다빈도 질환 통계에 따르면 성장기에는 소아암 등 중대 질환뿐만 아니라 환경성 질환(아토피·비염)과 골절·화상 등 생활 안전사고 발생 빈도가 높습니다. 성장기 주요 질환 특성에 맞추어 진단비와 수술비 등 핵심 치료비를 폭넓게 구성할 수 있는 어린이 전용 플랜의 이점을 활용하는 것이 권장됩니다.`;
    
    const childOpts = (analysis as any).child || {};
    const maturity = childOpts.maturity || 30;
    const focusArea = childOpts.focusArea || 'majorDisease';
    const ageGroup = childOpts.targetAgeGroup || 'child';

    goodPoints = [
      '소아암, 심장 질환, 뇌혈관 질환 등 성장기 주요 위험에 대한 폭넓은 보장 범위를 어린이보험 전용 특약으로 균형 있게 확보하셨습니다.'
    ];

    if (maturity === 100) {
      goodPoints.push('어릴 때 저렴한 보험료로 가입하여 암·뇌·심 3대 핵심 질환을 100세까지 보험료 인상 없이 평생 보장받는 정석 플랜을 구축하셨습니다.');
    } else {
      goodPoints.push('성장기 핵심 질환을 알뜰한 보험료로 집중 보장받고, 자녀 자립 시점에 직접 맞춤형으로 리모델링할 수 있는 가성비 30세 만기 플랜을 채택하셨습니다.');
    }

    if (focusArea === 'majorDisease') {
      goodPoints.push('소아암, 백혈병 및 성인기까지 이어지는 3대 중대질환(암·뇌혈관·허혈성심장) 진단비 중심의 든든한 치료 자원을 선제 확보하셨습니다.');
    } else {
      goodPoints.push('면역력이 취약한 영유아·학령기 시절 잦은 독감/폐렴 입원 및 각종 생활 안전사고 수술비를 촘촘하게 연계하셨습니다.');
    }

    badPoints = [
      '어린이보험은 자녀의 성장 주기와 독립 시점의 경제 여건을 고려하여, 30세 만기 시 무심사로 100세까지 연장 가능한 계약전환제도 탑재 여부와 세만기 비갱신 구조를 점검해 보실 것을 권장합니다.'
    ];

    actionTips = [
      maturity === 30 
        ? '30세 만기 도래 시 자녀의 건강 상태와 무관하게 성인보험으로 연장 가능한 계약전환제도 지원 여부를 확인하세요.'
        : '만기까지 보험료 변동이 없는 비갱신형 플랫레이트 구조인지 확인하여 장기적인 가계 부담을 안정적으로 관리하세요.',
      '상법 제732조에 따라 만 15세 미만 자녀는 사망 담보 가입이 금지되므로, 진단비와 수술비 위주의 순수 생존 치료비에 집중하세요.'
    ];
  }

  // ── [14] 태아보험 ──
  else if (isPreFamily) {
    riskTitle = `🍼 출생 위험(선천이상/저체중아) 집중 보장 및 산모 안심 특약`;
    riskPercent = 45;
    riskStats = `출생 통계에 따르면 고령 임신 증가로 조산 및 저체중아 출생 빈도가 높아지고 있습니다. 임신 22주 이전에만 가입 가능한 태아 특약을 적기에 세팅하여 출생 즉시 발생하는 신생아 의료비를 대비하는 것이 현명합니다.`;
    goodPoints = [
      '임신 주수 22주 이전에만 가입 가능한 태아 특약 가입 적기를 놓치지 않고 안정적으로 검토하고 계십니다.'
    ];
    badPoints = [
      '출생 후 불필요해지는 산모 실손이나 중복 입원 일당 특약이 과다하게 포함되어 있는지 확인할 필요가 있습니다.'
    ];
    actionTips = [
      '저체중아 출산 및 신생아 인큐베이터 입원일당 등 필수 태아 담보를 중심으로 출생 후 자동 전환되는 구조를 확인하세요.',
      '임신성 당뇨/고혈압 등 산모 보장 특약의 혜택 범위를 비교 점검하세요.'
    ];
  }

  // ── [15] 유병력자 어린이보험 ──
  else if (isChildSick) {
    riskTitle = `🌱 성장기 자녀 간편고지 보장 분석 리포트`;
    riskPercent = 60;
    riskStats = `건강보험심사평가원 소아 다빈도 질환 통계에 따르면 성장기 자녀의 환경성 질환 및 지속 치료 수요가 꾸준히 발생하고 있습니다. 최근에는 간편심사 제도를 통해 심사 문턱을 낮추어 자녀에게 꼭 필요한 치료 안전망을 확보하는 사례가 늘고 있습니다.`;
    goodPoints = [
      '성장기 자녀의 치료 이력이나 지속 관리 상황을 고려하여 가입 문턱을 낮춘 간편심사 플랜을 안정적으로 검토 중이십니다.'
    ];
    badPoints = [
      '간편심사 플랜의 특성상 일반 심사 대비 보험료 및 보장 범위에 차이가 있을 수 있으므로 성장 단계별 적정성을 점검할 필요가 있습니다.'
    ];
    actionTips = [
      '치료 종결 또는 일정 기간 무사고 유지 시 일반 표준체로 전환 가능한 제도가 있는지 각 보험사별 약관을 면밀히 확인하세요.'
    ];
  }

  // ── [16] 운전자보험 ──
  else if (isDriver) {
    riskTitle = `🚗 교통사고 형사적 책임(변호사 선임비·처리지원금·벌금) 집중 진단`;
    riskPercent = 65;
    riskStats = `교통사고 통계분석에 따르면 12대 중과실 사고 및 어린이보호구역(스쿨존) 사고는 자동차보험의 민사상 보상과 별개로 운전자 개인의 형사합의금과 변호사 선임비 등 막대한 형사적 책임이 발생합니다.`;
    goodPoints = [
      '자동차보험으로 해결되지 않는 운전자의 형사적·행정적 법적 리스크를 선제적으로 방어하고 계십니다.'
    ];
    badPoints = [
      '과거 상품의 경우 스쿨존 사고 벌금 상향이나 변호사 선임 비용 조기 지급 특약이 누락되어 있을 수 있습니다.'
    ];
    actionTips = [
      '교통사고처리지원금(형사합의금), 대인·대물 벌금, 변호사선임비용 등 3대 핵심 비용 담보의 최신 개정 한도를 점검하세요.',
      '자동차부상치료비(자부상) 특약을 연계하여 가벼운 접촉사고 시에도 실질적인 치료 위로금을 보장받으세요.'
    ];
  }

  // ── [17] 자동차보험 ──
  else if (isCar) {
    riskTitle = `🚙 의무보험 대인/대물 한도 및 무보험차 상해 밸런스 리포트`;
    riskPercent = 70;
    riskStats = `자동차보험 사업실적 통계에 따르면 고가 수입차량 증가로 인해 평균 대물 사고 배상액이 가파르게 상승하고 있습니다. 법적 의무 가입 요건을 충족하면서도 대물배상 한도를 현실적으로 설정하는 것이 권장됩니다.`;
    goodPoints = [
      '도로 위 예상치 못한 대형 사고에 대비하여 법적 의무 가입 요건을 충실히 검토하고 계십니다.'
    ];
    badPoints = [
      '대물배상 한도가 낮을 경우 고가 차량과의 충돌 사고 시 개인 자산 손실 위험에 노출될 수 있습니다.'
    ];
    actionTips = [
      '대물배상 한도를 현실적인 도로 환경에 맞추어 보완하고, 전 보험사 다이렉트 할인 특약(마일리지, 블랙박스 등)을 비교하세요.',
      '자기신체사고 대신 보장 범위가 훨씬 넓은 자동차상해(자상) 특약을 선택하여 운전자 본인과 동승 가족의 보장을 강화하세요.'
    ];
  }

  // ── [18] 펫보험 (반려동물) ──
  else if (isPet) {
    riskTitle = `🐾 반려동물 슬개골/피부/구강 다빈도 질환 및 배상책임 점검`;
    riskPercent = 75;
    riskStats = `동물보호 국민의식조사에 따르면 반려견/반려묘의 노령화에 따라 슬개골 탈구, 피부 질환, 치과 치료 등 고액의 동물병원 진료비 지출이 가계의 큰 부담이 되고 있습니다. 사전 분산 설계가 반려동물의 건강권을 지킵니다.`;
    goodPoints = [
      '사람과 달리 건강보험 혜택이 없어 전액 자부담인 동물병원 진료비 부담을 사전에 분산하고 계십니다.'
    ];
    badPoints = [
      '견종별 다발 질환(슬개골 탈구, 구내염, 피부병)에 대해 면책 기간이나 보장 한도가 축소되어 있지 않은지 확인이 필요합니다.'
    ];
    actionTips = [
      '1일 통원 의료비 한도와 수술비 한도 비율을 비교하고, 자기부담금 옵션을 조율하여 월 납입료 부담을 덜어내세요.',
      '반려견 물림 사고 등 타인에 대한 손해를 보장하는 반려동물 배상책임 담보 한도를 확인하세요.'
    ];
  }

  // ── [19] 주택화재보험 ──
  else if (isFire) {
    riskTitle = `🔥 주거 공간 화재 손해 및 이웃집 화재배상·임시거주비 가이드`;
    riskPercent = 60;
    riskStats = `국가화재통계연보에 따르면 주거시설 화재는 누전, 부주의 등으로 인해 빈번하게 발생하며, 실화책임법에 따라 이웃집으로 번진 불에 대한 배상 책임은 발화 세대가 전적으로 부담해야 합니다.`;
    goodPoints = [
      '실화책임법 개정에 따라 이웃집으로 번진 불에 대한 손해배상 책임을 체계적으로 대비하고 계십니다.'
    ];
    badPoints = [
      '건물 가액과 가재도구 가액이 현재 시세에 부합하지 않거나 누수 피해(가족일상생활배상책임)가 누락되었는지 점검이 필요합니다.'
    ];
    actionTips = [
      '건물 및 가재도구 손해와 더불어 화재 대물배상, 붕괴/침강 손해 특약을 종합적으로 확인하세요.',
      '아파트 관리비에 포함된 단체 화재보험의 보장 한도가 충분한지 개별 화재보험과 대조해 보세요.'
    ];
  }

  // ── [20] 재물종합보험 (상가/사업장) ──
  else if (isProperty) {
    riskTitle = `🏢 사업장/상가 재난 배상책임 및 영업 손실 방어 플랜`;
    riskPercent = 70;
    riskStats = `소상공인 재난피해 실태조사에 따르면 사업장 화재나 침수 피해는 막대한 시설 복구 비용뿐 아니라 영업 중단으로 인한 폐업 위기까지 초래합니다. 업종별 의무 배상책임과 자산 가액 일치화가 필수적입니다.`;
    goodPoints = [
      '예기치 못한 화재나 재난 사고로 인한 영업 중단 위험과 고객 배상책임을 철저히 준비하고 계십니다.'
    ];
    badPoints = [
      '다중이용업소 화재배상책임 의무 가입 기준 및 업종별 시설물 소유자 배상책임 한도의 충족 여부를 확인할 필요가 있습니다.'
    ];
    actionTips = [
      '사업장 집기비품과 시설 가액을 현실화하고 법적 의무 배상책임 요건을 빈틈없이 매칭하세요.',
      '화재 복구 기간 동안 발생하는 고정 임대료를 보전해 주는 휴업 손해 특약을 검토해 보세요.'
    ];
  }

  // ── [21] 골프·레저보험 ──
  else if (isGolf) {
    riskTitle = `⛳ 필드 안전사고 배상책임 및 골프용품 손해·홀인원 가이드`;
    riskPercent = 50;
    riskStats = `스포츠안전사고 실태조사에 따르면 골프장 내 타구 사고 등 안전사고는 중대한 신체적 상해와 고액의 배상책임을 유발할 수 있습니다. 건전한 레저 활동을 위한 실속형 안전망 구성이 권장됩니다.`;
    goodPoints = [
      '라운딩 중 발생할 수 있는 타구 사고 등 타인에 대한 신체·재물 배상책임을 안전하게 대비하고 계십니다.'
    ];
    badPoints = [
      '골프채 파손/도난 시 보장 한도와 홀인원 비용의 실제 영수증 청구 기준 조건을 점검할 필요가 있습니다.'
    ];
    actionTips = [
      '1년 단위 소멸성 또는 일일 원데이 플랜의 비용 효율성을 비교하여 실속 있는 레저 안전망을 구성하세요.'
    ];
  }

  // ── [22] 종신보험 ──
  else if (isWholeLife) {
    riskTitle = `💼 가장 유고 시 유가족 생활 안정 및 상속세 재원 마련 가이드`;
    riskPercent = 65;
    riskStats = `생명보험 통계연보에 따르면 종신보험은 가장의 갑작스러운 부재 시 남겨진 가족의 생활 안정과 유동성 확보를 위한 가장 확실한 금융 자산입니다. 은퇴 시점 및 상속 환경에 맞춘 유연한 설계가 권장됩니다.`;
    goodPoints = [
      '소중한 가족을 위해 사망 원인에 관계없이 지급되는 절대적인 보장 자산을 책임감 있게 준비하고 계십니다.'
    ];
    badPoints = [
      '장기 납입 기간을 감안할 때 월 보험료 지출이 가계 소득 대비 과도하지 않은지 유지 가능성을 점검할 필요가 있습니다.'
    ];
    actionTips = [
      '평생 보장이 필요한 상속 재원은 종신으로, 자녀 독립 전 경제활동기 집중 보장은 정기보험으로 분산 설계를 검토하세요.',
      '노후 연금 전환 옵션이나 사망보험금 유동화 기능이 포함된 최신 구조를 확인해 보세요.'
    ];
  }

  // ── [23] 정기보험 ──
  else if (isTerm) {
    riskTitle = `⌛ 경제활동기 집중 사망 보장 및 합리적 보험료 다이어트`;
    riskPercent = 60;
    riskStats = `가계금융복지조사에 따르면 자녀 양육기에는 가장의 사망 보장이 가장 절실한 시기입니다. 종신보험 대비 경제적인 보험료로 필요한 기간만 집중 보장받는 정기보험이 실속 있는 가계 재무 관리에 기여합니다.`;
    goodPoints = [
      '종신보험 대비 경제적인 보험료로 자녀 양육기에 필요한 고액의 유가족 생활 자금을 현명하게 확보하셨습니다.'
    ];
    badPoints = [
      '보장 만기(60세, 65세, 70세 등)가 가장의 실제 은퇴 시점 및 부양가족의 독립 시기와 일치하는지 확인할 필요가 있습니다.'
    ];
    actionTips = [
      '비흡연체 및 건강검진 요건을 충족할 경우 보험료 감면 혜택을 제공하는 건강체 할인 제도를 적극 확인하세요.'
    ];
  }

  // ── [24] 연금저축보험 ──
  else if (isPension) {
    riskTitle = `🪙 연말정산 세액공제 혜택 극대화 및 노후 안정적 현금흐름 점검`;
    riskPercent = 70;
    riskStats = `연금저축 비교공시 통계에 따르면 공적연금만으로는 은퇴 후 적정 생활비를 충당하기에 부족함이 있습니다. 세액공제 혜택과 복리 이자를 활용하여 평생 든든한 사적 연금 자산을 형성하는 것이 효과적입니다.`;
    goodPoints = [
      '세제 혜택과 더불어 장기 복리 효과를 통해 은퇴 후 기본적인 국민연금 공백을 메꾸는 재정 플랜을 실천하고 계십니다.'
    ];
    badPoints = [
      '중도 해지 시 기타소득세 부과 등 세제상 불이익이 발생할 수 있으므로 중장기 납입 여력을 점검할 필요가 있습니다.'
    ];
    actionTips = [
      '연금저축 세액공제 한도를 확인하고 IRP와의 균형 있는 배분을 통해 절세 효과를 극대화하세요.',
      '은퇴 후 연금 수령 개시 연령 및 종신 연금형 수령 조건을 점검하세요.'
    ];
  }

  // ── [25] 일반저축보험 ──
  else if (isSavings) {
    riskTitle = `🏦 10년 비과세 혜택 요건 충족 및 안정적 목돈 마련 재테크 분석`;
    riskPercent = 60;
    riskStats = `가계 저축 통계에 따르면 변동성 장세 속에서 최저보증이율을 제공하고 10년 이상 유지 시 이자소득세가 면제되는 비과세 저축보험은 안전자산 포트폴리오의 필수 요소입니다.`;
    goodPoints = [
      '시중 금리 변동 위험을 방어하는 최저보증이율 기능과 비과세 통장 기능을 확보하고 계십니다.'
    ];
    badPoints = [
      '초기 사업비 차감으로 인해 가입 초기 해약 시 원금 손실 위험이 있으므로 단기 목적 자금에는 적합하지 않을 수 있습니다.'
    ];
    actionTips = [
      '관련 세법상 비과세 요건(5년 이상 납입, 10년 이상 유지 등)을 철저히 확인하고 장기 목적 자금으로 운용하세요.'
    ];
  }

  // ── [26] 변액보험 ──
  else if (isVariable) {
    riskTitle = `📈 투자 펀드 라인업 수익률 및 인플레이션 방어 자산 배분`;
    riskPercent = 65;
    riskStats = `변액보험 수익통계에 따르면 장기적인 물가 상승률을 방어하기 위해 투자형 보험의 주식/채권형 펀드 분산 운용이 유효합니다. 시장 상황에 부합하는 정기적인 펀드 변경 관리가 성패를 좌우합니다.`;
    goodPoints = [
      '화폐 가치 하락에 맞서 주식/채권형 펀드 운용 수익을 통해 실질 구매력을 방어하는 진취적 자산 운용을 지향하고 계십니다.'
    ];
    badPoints = [
      '금융 시장 변동에 따른 원금 손실 가능성이 있으며, 펀드 변경이나 추가 납입 기능을 방치하고 있는지 확인할 필요가 있습니다.'
    ];
    actionTips = [
      '시장 국면에 맞추어 주식형과 채권형 펀드 편입 비율을 정기적으로 리밸런싱하고 10년 이상 장기 투자 관점을 유지하세요.'
    ];
  }

  // ── [27] 신용보험 (대출상환보장) ──
  else if (isCredit) {
    riskTitle = `💳 대출금 미상환 리스크 방지 및 가족 채무 상속 차단 플랜`;
    riskPercent = 75;
    riskStats = `가계부채 동향 통계에 따르면 가계 대출 잔액이 증가함에 따라 채무자의 유고 시 채무가 유가족에게 상속되거나 담보물이 경매 처분되는 리스크가 큽니다. 신용보험을 통해 채무 상속 위험을 방어하는 것이 중요합니다.`;
    goodPoints = [
      '가장의 예기치 못한 사고 시 대출금 상환 의무가 가족에게 전가되지 않도록 신용 자산을 안전하게 보호하고 계십니다.'
    ];
    badPoints = [
      '대출 잔액과 보장 금액 간의 갭이 발생하지 않는지, 원리금 균등상환 일정과 일치하는지 확인할 필요가 있습니다.'
    ];
    actionTips = [
      '담보대출 및 신용대출의 만기와 금액에 맞추어 맞춤형 상환 보장 플랜을 유지하세요.'
    ];
  }

  // ── [28] 법률비용보험 ──
  else if (isLegal) {
    riskTitle = `⚖️ 일상 생활 민사·가사 소송 변호사 선임 비용 및 감정비 보전`;
    riskPercent = 55;
    riskStats = `사법연감 통계에 따르면 부동산 임대차 분쟁, 층간소음, 의료 분쟁 등 일상 속 법적 소송 건수가 매년 증가하고 있습니다. 억울한 피해 발생 시 고액의 변호사 수임료 장벽을 낮춰주는 법률 안전망이 권장됩니다.`;
    goodPoints = [
      '부동산 임대차 분쟁, 층간소음, 사기 피해 등 일상 속 법적 분쟁 시 막대한 소송 비용 장벽을 완화하고 계십니다.'
    ];
    badPoints = [
      '단순 자문 비용 외에 실제 소송 제기 시 본안 소송 변호사 비용의 보장 한도와 자기부담금 조건을 점검할 필요가 있습니다.'
    ];
    actionTips = [
      '형사뿐만 아니라 민사·가사 분쟁까지 폭넓게 담보하는 최신 특약 여부를 확인하고 가입 조건을 점검하세요.'
    ];
  }

  // ── [공통 보충: 암보험 전용 추가 특약 가드] ──
  // ※ 오직 암보험이며 고객이 실제로 해당 옵션을 선택/설정한 경우에만 가이드형 멘트를 보충합니다.
  if (isCancer) {
    const hasTargetedTherapy = (analysis.cancer as any)?.targetedTherapy || false;
    const recurrentCancer = (analysis.cancer as any)?.recurrentCancer || false;
    const treatmentCost2025 = (analysis.cancer as any)?.treatmentCost2025 || false;

    if (hasTargetedTherapy) {
      goodPoints.push(`최신 3세대 치료법인 '표적항암 및 특정약물치료비' 특약을 맞춤 플랜에 포함하여 검토 중이십니다.`);
    }
    if (recurrentCancer) {
      goodPoints.push(`암 재발이나 전이 시에도 지속적인 혜택을 지원받을 수 있는 '재진단암' 안전망을 추가 구성하셨습니다.`);
    }
    if (treatmentCost2025) {
      goodPoints.push(`최신 치료 트렌드인 '암주요치료비' 특약을 적절히 연계하여 비급여 치료 본인부담금 완화를 고려하셨습니다.`);
    }
  }

  // ── [공통 엔진 권장 항목 연동] ──
  const cleanDeficiencies = deficiencies.filter(d => 
    !d.includes('균형 잡힌') && 
    !d.includes('안정적') && 
    !d.includes('완벽 설계') &&
    !d.includes('고지 항목 대비') &&
    !d.includes('보험료 높음') &&
    !d.includes('종수술비') &&
    !d.includes('입원 일당') &&
    !d.includes('임플란트') &&
    !d.includes('크라운') &&
    !d.includes('치아') &&
    !d.includes('고지 유형') &&
    !d.includes('적정성 점검') &&
    !d.includes('심혈관질환') &&
    !d.includes('허혈성') &&
    !d.includes('뇌혈관질환') &&
    !d.includes('수술비 특약') &&
    !d.includes('보험료 지출 규모') &&
    !d.includes('뇌혈관 보장 범위') &&
    !d.includes('임의') &&
    !d.includes('3,000만') &&
    !d.includes('5,000만') &&
    !d.includes('상해수술비') &&
    !d.includes('상해사망') &&
    !d.includes('상해후유장해') &&
    !d.includes('골절진단비') &&
    !d.includes('레저스포츠') &&
    !d.includes('인건비 상승') &&
    !d.includes('체증형') &&
    !d.includes('간병') &&
    !d.includes('치매') &&
    !d.includes('대리청구인') &&
    !d.includes('생활자금') &&
    !d.includes('생활비') &&
    !d.includes('재가') &&
    !d.includes('시설') &&
    !d.includes('방문요양') &&
    !d.includes('장기요양') &&
    !d.includes('어린이') &&
    !d.includes('성장기') &&
    !d.includes('만기 플랜') &&
    !d.includes('발달지연') &&
    !d.includes('ADHD')
  );
  if (cleanDeficiencies.length > 0) {
    const rawDef = cleanDeficiencies[0];
    const tipText = rawDef.endsWith('필요') || rawDef.endsWith('권장') 
      ? rawDef 
      : `${rawDef} 여부 확인`;
    badPoints.push(`치료비 발생 시 본인부담 완화를 위해 ${tipText}을(를) 우선적으로 검토해 보실 것을 권장합니다.`);
  }

  return { riskTitle, riskPercent, riskStats, goodPoints, badPoints, actionTips };
}
