import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, ShieldAlert, Zap } from 'lucide-react';
import { InsuranceAnalysis } from '../types/insurance';

interface AIPremiumReportProps {
  analysis: InsuranceAnalysis;
  deficiencies: string[];
  scores: {
    cancerScore: number;
    cerebrovascularScore: number;
    cardiovascularScore: number;
    totalScore: number;
  };
}

export const AIPremiumReport: React.FC<AIPremiumReportProps> = ({ analysis, deficiencies, scores }) => {
  const age = analysis.age || 40;
  const gender = analysis.gender === 'F' ? '여성' : '남성';
  const category = analysis.selectedCategory ?? '';

  // 1. 카테고리 판별
  const isDental = category.includes('치아');
  const isSilbi = category.includes('실손') || category.includes('실비');
  const isCaregiving = category.includes('간병');
  const isNursing = category === '재가/시설' || category.includes('재가') || category.includes('시설');
  const isChild = category.includes('어린이') || category.includes('태아') || ['child', 'pre_family', 'child_sick'].includes(category);
  const isCar = category.includes('자동차') || category === 'car';
  const isDriver = category.includes('운전자') || category === 'driver';
  const isPet = category.includes('펫') || category === 'pet';
  const isGolf = category.includes('골프') || category === 'golf';
  const isProperty = category.includes('재물') || category === 'property' || category === 'home';
  const isFire = (category.includes('주택화재') || category.includes('화재') || category === 'fire_real') && !isProperty;
  const isAnnuity = category.includes('연금') || category === 'annuity_savings';
  const isWholeLife = category.includes('종신') || category === 'whole';
  const isVariable = category.includes('변액') || category.includes('정기') || ['variable', 'term'].includes(category);
  const isHealthGeneral = category.includes('종합건강') || category === 'health_general' || category === 'remodeling';
  const getReportData = () => {
    // 0. 상세 입력값 추출
    const coverage = (analysis as any)._remodelingCoverage;
    const isSimple = analysis.healthStatus === 'simple' || category.includes('유병자') || (category.includes('어린이') && analysis.child?.isPreFamily);
    const preExistingType = analysis.preExistingType || (analysis.child?.isPreFamily ? '3.N.5' : undefined);
    const familyHistory = (analysis.cancer as any)?.familyHistory || false;
    const isRenewable = (analysis.cancer as any)?.paymentType === 'renewable' || (analysis.cerebrovascular as any)?.paymentType === 'renewable';
    const hasTargetedTherapy = (analysis.cancer as any)?.targetedTherapy || false;
    const recurrentCancer = (analysis.cancer as any)?.recurrentCancer || false;
    const currentAmount = coverage ? (coverage.cancer_diagnosis || 0) : ((analysis.cancer as any)?.currentAmount || 0);
    const treatmentCost2025 = (analysis.cancer as any)?.treatmentCost2025 || false;

    // 기본 암/종합 건강보험 리스크 및 추천
    let riskTitle = `${age}대 ${gender} 생애주기 주요 건강 리스크 진단`;
    let riskPercent = 75; // 통계 위험도 지수
    let riskStats = `국가 보건 의료 빅데이터에 따르면, ${age}대 ${gender}은 면역 기능 저하와 유전/환경적 요인으로 인해 3대 질병(암, 뇌혈관, 심혈관) 발병 빈도가 이전 연령대 대비 급증합니다. 특히 소득 상실 리스크가 가장 높은 시기이므로 철저한 대비가 필수적입니다.`;
    
    let goodPoints = ['가입 시점이 빨라 현재 유지 중인 핵심 특약의 가격 경쟁력이 우수합니다.'];
    let badPoints = ['통계 평균 치료 비용 대비 전체적인 진단 자산 규모가 보강이 필요한 수준입니다.'];
    let actionTips = ['불필요한 적립 보험료나 중복 특약을 축소하고, 절약된 차액으로 핵심 진단비를 추가 보강하세요.'];

    // 40대 암/종합건강보험 특화 팁
    if ((isHealthGeneral || !category || category.includes('암')) && age >= 40 && age < 50) {
      riskTitle = `🚨 40대 ${gender} 암 발병률 2.5배 급증 구간 진입`;
      riskPercent = 88;
      riskStats = `국가암등록통계에 따르면 40대부터 위암, 대장암, 갑상선암 등의 발병률이 30대 대비 약 240% 급상승합니다. 이 시기는 가정 내 소비 지출 및 교육비 부담이 가장 큰 정점 구간이므로, 치료비는 물론 최소 1년간의 생활비 공백을 메꿀 수 있는 고액 진단비 준비가 반드시 수반되어야 합니다.`;
      goodPoints = [
        '일반 실손 보장을 안정적으로 유지하고 있어 기본적인 입원/통원 치료비 방어선은 마련되어 있습니다.',
        '만기 설정이 안정적으로 유지되어 노년기 이전까지의 집중 보장은 양호한 편입니다.'
      ];
      badPoints = [
        '현재 설계된 암 진단비는 치료비와 간병비, 생활 자금을 모두 감당하기에 평균 대비 최소 2,000만 원가량 부족합니다.',
        '갑상선암, 제자리암 등 발생 빈도가 높은 유사암 진단비 한도가 비교적 협소하게 축소되어 있습니다.'
      ];
      actionTips = [
        '암 진단비의 합리적인 안전 마지노선인 5,000만 원 이상으로 보장 한도를 업그레이드할 것을 추천합니다.',
        '신규 업그레이드 시에는 일반 표준형 상품 대신 보험료가 최대 30% 저렴한 "무해지환급형" 또는 "간편 세만기" 구조를 선택하여 월 납입 부담을 덜어내세요.'
      ];
    }
    // 50대 이상 암/종합건강보험
    else if ((isHealthGeneral || !category || category.includes('암')) && age >= 50) {
      riskTitle = `🚨 50대 이상 혈관 질환 및 퇴행성 리스크 임계점 도달`;
      riskPercent = 94;
      riskStats = `질병관리청 통계에 따르면 50대부터 혈관의 노화가 심화되어 뇌졸중, 급성심근경색증 등 급성 중증 질환 발병률이 30~40대 대비 3배 이상 폭증합니다. 이 시기 질병 발생은 장기 간병으로 이어지는 비중이 대단히 높으므로 종합적인 간병 특약과 보장 범위가 넓은 혈관 진단비 세팅이 시급합니다.`;
      goodPoints = [
        '종합 보장 중 뼈대 역할을 하는 실비 및 기본 상해 수술 특약이 튼튼하게 탑재되어 있습니다.'
      ];
      badPoints = [
        '뇌출혈이나 급성심근경색처럼 보장 범위가 좁은(전체 혈관 질환의 10% 미만 보장) 과거 특약 위주로 가입되어 있어 실질적인 보장 혜택을 받기 어렵습니다.',
        '진단 시 가계 고정비 지출을 완전 대체할 장기 요양 자금이 설계되어 있지 않습니다.'
      ];
      actionTips = [
        '보장 범위가 가장 넓은 "뇌혈관질환" 및 "허혈성/심혈관질환" 진단비 특약으로 전환하거나 별도 추가하십시오.',
        '당뇨나 혈압 약을 복용 중이시더라도 최근 출시된 초간편(3.N.5) 유병자 간편건강 보험을 활용하면 할증 없는 합리적인 설계가 가능합니다.'
      ];
    }
    // 30대 이하 종합/암
    else if ((isHealthGeneral || !category || category.includes('암')) && age < 40) {
      riskTitle = `🌱 2030 청년기 - 저비용 고효율 무해지 황금기`;
      riskPercent = 45;
      riskStats = `20대와 30대는 평생 보장의 주춧돌을 세우는 가장 최적의 시기입니다. 연령이 낮아 보험료가 전 생애 중 가장 저렴하며, 면책 기간이나 납입 면제 조건이 가장 유리하게 제공되므로 건강할 때 종신형 보장 자산을 준비하는 것이 합리적인 금융 선택이 될 수 있습니다.`;
      goodPoints = [
        '젊고 건강한 연령대로서 어떠한 보험 상품이든 가장 유리한 표준체 무할증 조건으로 가입이 가능합니다.'
      ];
      badPoints = [
        '기존 가입 내역이 만기가 지나치게 짧거나(예: 80세 만기 이하), 갱신형 위주로 되어 있어 향후 40~50대에 보험료가 상승할 수 있는 갱신 리스크가 존재합니다.'
      ];
      actionTips = [
        '향후 납입료가 오르지 않는 "비갱신형 세만기(90세 또는 100세)"를 기본 뼈대로 세우세요.',
        '해지 시 환급금이 없는 대신 월 납입료를 대폭 낮춰주는 "무해지환급형 종합보험"을 활용하여 가성비를 높이는 데 효과적인 대안이 될 수 있습니다.'
      ];
    }
    // 실손/실비 보험 팁
    else if (isSilbi) {
      riskTitle = `💧 실손의료보험 세대 교체 및 가격 다이어트 전략`;
      riskPercent = 70;
      riskStats = `실손보험은 가입 시기(1~4세대)에 따라 자기부담금과 갱신율 차이가 매우 큽니다. 연간 병원 방문 횟수가 적은 우량 고객임에도 1~2세대 실비를 유지하며 매년 인상될 수 있는 갱신 보험료를 납입하는 것은 장기적인 고정비 부담의 요인이 될 수 있습니다.`;
      goodPoints = [
        '기존 실손 보장의 의료비 보장 한도 및 본인 부담 비율이 매우 낮아 보장의 폭 자체는 뛰어납니다.'
      ];
      badPoints = [
        '만일 병원에 자주 가지 않는 건강 상태임에도 과거 고비용 실손을 유지하고 계신다면 불필요한 기회비용 지출이 지나치게 큽니다.'
      ];
      actionTips = [
        '최근 2년간 입원 치료나 비급여 치료를 거의 받지 않았다면, 최대 70%까지 보험료 절감이 가능한 4세대 실손으로의 전환을 적극 검토해 보세요.',
        '반면 도수치료, 영양제 주사 등 비급여 진료를 정기적으로 받고 있다면 기존 실손 유지가 유리할 수 있으니 병원 이용 패턴을 꼼꼼히 확인하고 전환 결정을 내려야 합니다.'
      ];
    }
    // 치아 보험 팁
    else if (isDental) {
      riskTitle = `🦷 치과 치료비 폭탄 방지 - 보철 및 보존 집중 가이드`;
      riskPercent = 65;
      riskStats = `치과 진료는 국민건강보험의 비급여 항목 비율이 가장 높아 개인이 감당하는 비용이 큽니다. 특히 영구치 보존 및 임플란트 치료는 개당 100만~150만 원 이상의 고액 비용이 청구되므로 치아 건강 상태에 따른 맞춤형 플랜 준비가 요구됩니다.`;
      goodPoints = [
        '치료 한도가 큰 보철 특약을 검토 중이시며, 최근 구강 정밀 진단 내역이 양호하여 가입 조건이 유연합니다.'
      ];
      badPoints = [
        '충치 치료(레진, 인레이) 같은 다빈도 치료는 보장 횟수가 작게 묶여 있어 소액 치료 혜택이 다소 부족합니다.'
      ];
      actionTips = [
        '향후 임플란트 예정 개수가 많다면 보장 한도 제한이 없는 "무제한 임플란트 플랜"을 선택하고, 간단한 충치 치료가 목적이라면 비용이 가벼운 "보존 중심 플랜"으로 조율하세요.',
        '치과 치료는 가입 즉시 90일간 면책 기간이 적용되므로, 치료 계획을 세우기 최소 3개월 전에 가입을 완료하는 팁을 기억하세요.'
      ];
    }
    // 간병/요양 보험 팁
    else if (isCaregiving || isNursing) {
      riskTitle = `👵 초고령 사회 필수 대비 - 간병/요양(재가/시설) 준비`;
      riskPercent = 85;
      riskStats = `평균 수명이 매년 연장되면서 노후 간병 리스크는 가계 경제를 파탄 내는 가장 무서운 요인 중 하나입니다. 전문 간병인 고용 비용이 일일 15만 원(월 450만 원 상당)을 넘어섰으며, 요양원이나 요양병원 이용 시 장기적인 가계 고정 지출 부담이 치명적입니다.`;
      goodPoints = [
        '노후 리스크의 가장 큰 산인 장기 케어(Long-term Care) 필요성을 조기에 인지하고 자산 방어선을 설계 중이십니다.'
      ];
      badPoints = [
        '간병 서비스 지원 한도가 체증되지 않는 일반 고정형에 머물러 있어, 향후 10~20년 뒤 인플레이션(물가 상승, 간병인 인건비 상승) 위험을 방어하기 어렵습니다.'
      ];
      actionTips = [
        '간병인 고용 시 지원 금액이 매년 5~10%씩 복리로 늘어나는 "체증형 간병인 지원/사용일당" 특약을 필히 선택하십시오.',
        '국가 장기요양등급 판정 시 매달 재가 지원금을 받을 수 있는 "재가/시설 지원 특약"을 결합하여 요양원 입소 비용 및 가정 간병 서비스 비용 이중 방어막을 구축하세요.'
      ];
    }
    // 어린이/태아 보험 팁
    else if (isChild) {
      riskTitle = `👼 소중한 아이를 위한 생애 첫 보장 설계`;
      riskPercent = 50;
      riskStats = `어린이보험(태아보험)은 출생 시 발생할 수 있는 저체중아, 선천이상 수술비부터 성장기 소아암, 아토피, 골절, ADHD 등 다양한 성장 위험을 빈틈없이 커버해야 합니다. 최근에는 만기를 30세와 100세 중 부모의 재정 상황과 보장 가치관에 따라 영리하게 조율하는 추세입니다.`;
      goodPoints = [
        '태아 시기 필수 특약인 저체중아 육아비용 및 선천이상 수술 보장을 놓치지 않고 꼼꼼히 확인하고 계십니다.'
      ];
      badPoints = [
        '100세 만기로 모든 담보를 고가로 설정할 시 성인이 되어 독립하기 전 부모의 보험료 불입 부담이 과도해질 수 있습니다.'
      ];
      actionTips = [
        '가성비를 원한다면 30세 만기로 저렴하게 집중 구성한 뒤 성인이 되어 계약 전환권을 행사하는 방향을 추천하고, 자녀의 평생 안심 보장을 위한다면 "비갱신형 100세 만기 무해지환급형"을 조기에 세팅해 주는 것을 추천합니다.',
        '임신 주수 22주 이전에만 가입 가능한 태아 보장 특약 시기를 절대로 놓치지 마세요.'
      ];
    }
    // 종신/변액/연금/저축 등 금융형 보험
    else if (isAnnuity || isWholeLife || isVariable) {
      riskTitle = `💼 가계 자산 포트폴리오 최적화 - 보장성 vs 저축성`;
      riskPercent = 60;
      riskStats = `사망 보장을 위한 종신보험과 미래 연금 재원 마련을 위한 연금보험은 금융 목적이 완전히 다른 상품입니다. 종신보험을 단순한 연금 대용 저축 상품으로 오인해 가입할 경우, 초기 사업비 지출이 막대하여 심각한 환급금 손실을 초래할 위험이 있습니다.`;
      goodPoints = [
        '가족을 위한 유고 시 사망 보장 또는 은퇴 시점 목적 자금 준비라는 훌륭한 재무적 책임감을 발휘하고 계십니다.'
      ];
      badPoints = [
        '적립금에 부과되는 사업비 차감 비율과 납입 만기 유지 가능성을 고려하지 않고 단기 환급률만 보고 대형 저축 상품에 가입할 위험이 있습니다.'
      ];
      actionTips = [
        '순수 사망 보장을 원한다면 보험료가 종신 대비 1/3 수준으로 저렴한 "정기보험"을 가입하고, 남는 차액을 적립식 펀드나 세액공제용 연금저축에 직접 불입하는 것이 훨씬 스마트한 분산 투자입니다.',
        '보험 가입 후 중도 해지 시 불이익이 가장 큰 카테고리이므로, 10년 이상 꾸준히 납입 가능한 합리적인 예산 한도(월 소득의 5~7% 미만) 내에서만 설정을 결정하세요.'
      ];
    }

    // ----------------------------------------------------
    // [초정밀 데이터 동적 바인딩 추가]
    // ----------------------------------------------------

    // 1. 유병자 고지형(Simple) 데이터 연동
    if (isSimple) {
      riskStats += ` 또한, 현재 간편심사(유병자)형 설계를 선택하셨으므로 일반 표준심사 대비 가입 조건 및 보험료율 산정의 민감도가 큽니다. 고지 기준을 정확히 매칭하는 설계가 중요합니다.`;
      goodPoints.unshift(`과거 치료력이 있으시더라도 핵심 3대 중증 질환에 대해 가입 가능한 ${preExistingType ? `${preExistingType} 간편형` : '유병자 간편형'} 플랜으로 보장 장벽을 극복하고 계십니다.`);
      badPoints.unshift(`유병자 간편보험 특성상 일반 표준형 대비 약 20%~30%가량의 할증 보험료가 포함되어 있어, 불필요하게 긴 갱신 기간이나 중복 담보가 있을 시 장기 재정 부담이 심화됩니다.`);
      actionTips.push(`최근 병원 내원 이력(3개월/2년/5년 등)을 면밀히 대조하여 할증률이 가장 낮고 저렴한 간편 심사 등급(${preExistingType || '3.5.5/3.3.5'})으로 필터링 설계를 제안 드립니다.`);
    }

    // 2. 가족력 고지 데이터 연동
    if (familyHistory) {
      riskStats += ` 특히 가족력(암 등)이 있으신 경우 유전적 고위험군 구간에 해당하므로, 일반적인 통계치보다 더욱 안전하고 두터운 보장 준비가 추천됩니다.`;
      goodPoints.push(`가족력을 사전에 인지하여 조기에 보장 공백을 진단하고 리모델링을 대비하시는 재무적 판단이 매우 현명하십니다.`);
      badPoints.push(`가족력 고위험군에 대비하기에는 현재 책정된 주요 진단비 규모가 치료 중 생계 유지비와 간병 부담을 완전히 충당하기에 상대적으로 불안정합니다.`);
      actionTips.unshift(`가족력이 있으신 주요 질병(일반암/유사암 등)의 진단 자산 한도를 가성비가 높은 비갱신형 위주로 최소 5,000만 원 이상 넉넉히 확보하십시오.`);
    }

    // 3. 갱신형 선택 여부 연동
    if (isRenewable) {
      badPoints.push(`현재 설계에 포함된 갱신형 구조는 초기 보험료는 합리적이나, 갱신 시점마다 보험료가 인상되어 향후 유지 시점에 납입 부담이 상대적으로 커질 수 있습니다.`);
      actionTips.push(`초기 지출은 크더라도 만기까지 금액이 동일한 비갱신형(90세 또는 100세 만기)을 결합하여 장기 납입 안정성을 확보해 보세요.`);
    }

    // 4. 최신 치료비 특약 연동
    if (hasTargetedTherapy) {
      goodPoints.push(`치료 효과가 우수하고 부작용이 적은 최신 3세대 치료법인 '표적항암 및 중입자 약물치료비' 특약을 선제적으로 장착하셨습니다.`);
    }
    if (recurrentCancer) {
      goodPoints.push(`암 재발이나 전이 시에도 1회성 보장에 그치지 않고 지속적인 치료비 혜택을 지원받을 수 있도록 '재진단암' 안전망을 추가 구성하셨습니다.`);
    }

    // 5. 일반암 진단비 연동
    if (currentAmount > 0) {
      if (currentAmount < 50000000) {
        badPoints.push(`현재 설정된 일반암 진단비(${(currentAmount / 10000).toLocaleString()}만 원)는 고액 암 치료 및 생계 유지비 부담을 감당하기에 다소 보강이 필요한 수준입니다.`);
        actionTips.push(`일반암 진단비 보장 한도를 가족력 및 소득 수준에 맞추어 최소 5,000만 원 이상으로 든든하게 늘리십시오.`);
      } else if (currentAmount >= 50000000 && currentAmount < 100000000) {
        goodPoints.push(`일반암 진단비를 ${(currentAmount / 10000).toLocaleString()}만 원으로 충분히 설계하여 암 치료와 생계 공백을 안정적으로 방어할 준비가 되었습니다.`);
      } else {
        goodPoints.push(`일반암 진단비 1억 원을 든든하게 확보하여 치료비 및 생계 공백에 안정적으로 대비하고 자산을 효율적으로 보호하도록 설계하셨습니다.`);
      }
    }

    // 6. 2025 암주요치료비 연동
    if (treatmentCost2025) {
      goodPoints.push(`최신 암 치료 트렌드인 '2025 암주요치료비' 특약을 적절히 추가하여 실제 고액 비급여 치료 시 발생하는 환자 본인부담금을 연간 최대 1억 원 한도로 메꿀 수 있습니다.`);
    } else {
      badPoints.push(`실제 암 치료비(수술, 항암, 방사선 등)를 매년 보장하는 최신 '2025 암주요치료비' 특약이 누락되어 있어 고비용 암 치료 시 재정적 부담이 생길 수 있습니다.`);
      actionTips.push(`가장 가성비 높게 대안 치료비를 확보할 수 있는 '암 주요 치료비' 특약을 보완하여 고액 비급여 치료 공백을 채우세요.`);
    }

    // 결함 항목이 있으면 동적으로 가이드 추가
    const realDeficiencies = deficiencies.filter(d => 
      !d.includes('균형 잡힌 설계') && 
      !d.includes('안정적입니다') && 
      !d.includes('완벽 설계')
    );
    if (realDeficiencies.length > 0) {
      badPoints.push(`현재 긴급 보강이 필요한 항목인 [ ${realDeficiencies.slice(0, 3).join(', ')} ] 담보가 아예 누락되었거나 가입 금액이 기준 미달입니다.`);
    } else if (badPoints.length === 0) {
      badPoints = ['현재 설계 분석 기준 상 긴급하게 보완이 필요한 보장 공백이 발견되지 않았습니다. 주요 핵심 보장이 고르게 구성된 균형 있는 설계입니다.'];
    }

    return { riskTitle, riskPercent, riskStats, goodPoints, badPoints, actionTips };
  };

  const { riskTitle, riskPercent, riskStats, goodPoints, badPoints, actionTips } = getReportData();

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gradient-to-br from-[#120731] via-[#1a0b47] to-slate-950 text-white rounded-[3.5rem] p-8 md:p-14 shadow-[0_50px_100px_-20px_rgba(12,3,43,0.4)] border border-[#2b1767]/60 relative overflow-hidden"
    >
      {/* 백그라운드 미세 파스텔 그라데이션 광원 */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 헤더 AI 배지 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-[#2b1767]/60 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-purple-500/20 text-purple-300 rounded-full text-sm md:text-base font-black tracking-wide border border-purple-500/30 shadow-sm">
            <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
            <span className="text-orange-400">당신을 위한 AI 1:1 정밀분석 리포트</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            {riskTitle}
          </h3>
        </div>

        {/* 실시간 진단 상태 배지 */}
        <div className="flex-shrink-0 flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl text-white shadow-lg shadow-black/25 border border-white/10">
          <div className="w-3 h-3 rounded-full bg-purple-400 animate-ping" />
          <div className="text-left">
            <span className="text-[10px] text-gray-400 font-bold block">ANALYSIS RUNTIME</span>
            <span className="text-sm font-black text-purple-300 tracking-tighter">0.1초 이내 실시간 분석 완료</span>
          </div>
        </div>
      </div>

      {/* 리포트 콘텐츠 그리드 */}
      <div className="grid lg:grid-cols-12 gap-10 md:gap-14 relative z-10">
        
        {/* 왼쪽: 질병 통계 및 리스크 요인 */}
        <div className="lg:col-span-5 space-y-8 bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-inner flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-lg font-black text-gray-200">생애주기 통계적 위험 요인</h4>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              {riskStats}
            </p>
          </div>

          <div className="border-t border-white/10 pt-6 mt-8 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400">
              <span>동일 성별/연령대 건강 취약 리스크 지표</span>
              <span className="text-purple-400 font-black">{riskPercent}% 위험 노출</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${riskPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
              />
            </div>
            <p className="text-[10px] text-gray-400 font-bold leading-normal">
              *국가통계포털(KOSIS) 및 국민건강보험공단 건강검진 통계 기준
            </p>
          </div>
        </div>

        {/* 오른쪽: AI 상세 진단 (Good, Bad, Solution) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Good & Bad 그리드 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Good */}
            <div className="bg-emerald-950/20 backdrop-blur-md border border-emerald-900/30 p-8 rounded-[2.5rem] space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <CheckCircle className="w-5 h-5 fill-current bg-slate-900 rounded-full" />
                <h5 className="font-black text-sm uppercase tracking-wider">현행 설계 강점 (Good)</h5>
              </div>
              <ul className="space-y-3 text-xs text-gray-300 font-medium leading-relaxed list-disc list-inside">
                {goodPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Bad */}
            <div className="bg-rose-950/20 backdrop-blur-md border border-rose-900/30 p-8 rounded-[2.5rem] space-y-4">
              <div className="flex items-center gap-2.5 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                <h5 className="font-black text-sm uppercase tracking-wider">긴급 보강 요소 (Bad)</h5>
              </div>
              <ul className="space-y-3 text-xs text-gray-300 font-medium leading-relaxed list-disc list-inside">
                {badPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan (보완 솔루션) */}
          <div className="bg-[#1c0d3e]/60 backdrop-blur-md border border-[#2b1767]/50 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.04]">
              <Zap className="w-32 h-32 text-purple-400" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-lg font-black text-gray-200">AI 정밀 솔루션 가이드</h4>
            </div>

            <ul className="space-y-4 relative z-10">
              {actionTips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-sm font-semibold text-gray-300 leading-relaxed">
                  <span className="text-purple-300 font-black">Step {idx + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </motion.section>
  );
};
