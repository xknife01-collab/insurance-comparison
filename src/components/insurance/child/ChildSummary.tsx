import React from 'react';
import { AnalysisResult } from '../../../types/insurance';
import { Baby, Calendar, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

export const ChildSummary: React.FC<Props> = ({ result }) => {
  const { analysis } = result as any;
  if (!analysis) return null;

  const child = analysis.child || {
    targetAgeGroup: 'child',
    maturity: 30,
    focusArea: 'majorDisease',
    hasPrenatalRider: false,
    weeksPregnancy: 12
  };

  const getAgeGroupLabel = (group: string) => {
    switch (group) {
      case 'prenatal': return '태아 / 임산부';
      case 'child': return '어린이 (0~15세)';
      case 'youth': return '청년 (16~35세)';
      default: return '어린이';
    }
  };

  const getMaturityLabel = (mat: number) => {
    return `${mat}세 만기형`;
  };

  const getFocusAreaLabel = (area: string) => {
    return area === 'majorDisease' ? '3대 중대질환 집중' : '입원/수술비 강화';
  };

  const items = child.isPreFamily ? [
    { 
      label: '우리아이 맞춤 병력', 
      amount: child.illnessType === 'development' ? '발달지연/놀이치료' : child.illnessType === 'adhd' ? 'ADHD/소아우울' : child.illnessType === 'puberty' ? '성조숙증' : child.illnessType === 'asthma' ? '천식/아토피' : child.illnessType === 'fracture' ? '골절/깁스' : '기타 질환', 
      status: '안심플랜', 
      color: 'text-blue-600 bg-blue-50' 
    },
    { 
      label: '무사고 간편 등급', 
      amount: `3.${child.noAccidentYears || '5'}.5 고지`, 
      status: child.noAccidentYears === '5' ? '최저할증' : '자동적용', 
      color: child.noAccidentYears === '5' ? 'text-emerald-600 bg-emerald-50' : 'text-orange-600 bg-orange-50' 
    },
    { 
      label: '보장 기간 (만기)', 
      amount: getMaturityLabel(child.maturity), 
      status: child.maturity === 100 ? '평생보장' : '실속형', 
      color: child.maturity === 100 ? 'text-indigo-600 bg-indigo-50' : 'text-blue-600 bg-blue-50' 
    },
    { 
      label: '보장 집중 선택', 
      amount: getFocusAreaLabel(child.focusArea), 
      status: '최적화', 
      color: 'text-emerald-600 bg-emerald-50' 
    },
  ] : [
    { 
      label: '가입 대상 구분', 
      amount: getAgeGroupLabel(child.targetAgeGroup), 
      status: '확인됨', 
      color: 'text-yellow-600 bg-yellow-50' 
    },
    { 
      label: '보장 기간 (만기)', 
      amount: getMaturityLabel(child.maturity), 
      status: child.maturity === 100 ? '평생보장' : '실속형', 
      color: child.maturity === 100 ? 'text-indigo-600 bg-indigo-50' : 'text-blue-600 bg-blue-50' 
    },
    { 
      label: '보장 집중 선택', 
      amount: getFocusAreaLabel(child.focusArea), 
      status: '최적화', 
      color: 'text-emerald-600 bg-emerald-50' 
    },
    { 
      label: '태아 특약 가입', 
      amount: child.targetAgeGroup === 'prenatal' 
        ? (child.hasPrenatalRider ? `포함 (${child.weeksPregnancy}주차)` : '미포함') 
        : '대상 아님', 
      status: child.targetAgeGroup === 'prenatal' 
        ? (child.hasPrenatalRider && child.weeksPregnancy <= 22 ? '안전' : '보장 제한 주의') 
        : '정상', 
      color: child.targetAgeGroup === 'prenatal' 
        ? (child.hasPrenatalRider && child.weeksPregnancy <= 22 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50') 
        : 'text-gray-500 bg-gray-50' 
    },
  ];

  const currentPremium = analysis.monthlyPremium || 0;
  const recommendedPremium = result.recommendations?.upgrade?.estimatedPremium || 0;
  const savings = currentPremium - recommendedPremium;

  return (
    <div className="space-y-6">
      <div className="rounded-[2.5rem] p-10 border bg-yellow-50/20 border-yellow-100">
        <h3 className="text-xl font-black mb-8 flex items-center gap-2 text-slate-800">
          <Baby className={child.isPreFamily ? "text-blue-500 w-6 h-6" : "text-yellow-500 w-6 h-6"} />
          {child.isPreFamily ? '유병자 어린이 보험 상세 설계 현황' : '어린이 / 신생아(태아) 보험 상세 설계 현황'}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-50/50 flex flex-col justify-center gap-2 group hover:border-yellow-200 transition-all">
              <div className="flex justify-between items-center w-full">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.label}</p>
                <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${item.color}`}>{item.status}</span>
              </div>
              <p className="text-lg font-black text-gray-800">{item.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 월 예상 절감액 섹션 */}
      <div className={`rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden ${child.isPreFamily ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-yellow-500 to-amber-600'}`}>
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-4 -translate-y-4">
          <Baby className="w-48 h-48 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-black text-yellow-100 uppercase tracking-widest bg-yellow-900/30 px-3 py-1 rounded-full mb-4 inline-block">
              Child & Prenatal Care Analysis
            </span>
            <h4 className="text-2xl font-black mb-2">어린이 보험료 포트폴리오 최적화 결과</h4>
            <p className="text-yellow-50 text-sm font-bold opacity-80">
              불필요한 중복 보장을 덜어내고 자녀 성장 시기별 핵심 보장만 채워 실속 있는 보험료로 전환할 수 있습니다.
            </p>
          </div>
          <div className="text-right">
            {savings > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-white">
                  {savings.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-yellow-100">원 절감 가능</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter text-white">
                  최적의 맞춤형 신규 추천 플랜
                </span>
              </div>
            )}
            <p className="text-[10px] text-yellow-200 font-bold mt-2 opacity-60 uppercase tracking-widest">
              * 국내 Top 6 보험사 종합 실시간 비교 기준
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
