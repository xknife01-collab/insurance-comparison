import React from 'react';
import { AnalysisResult } from '../../../types/insurance';

interface Props {
  result: AnalysisResult;
  formatAmount: (amt: number) => string;
}

export const PreExistingSummary: React.FC<Props> = ({ result, formatAmount }) => {
  const { analysis } = result as any;
  if (!analysis) return null;

  const currentPremium = analysis.monthlyPremium || 0;
  // Use the recommended upgrade plan's premium for savings calculation
  const recommendedPremium = result.recommendations?.upgrade?.estimatedPremium || 0;
  const savings = currentPremium - recommendedPremium;

  const items = [
    { label: '건강 고지 유형', amount: analysis.preExistingType || '3.5.5', status: '유병자 전용', color: 'text-blue-500' },
    { label: '3개월 내 치료 이력', amount: analysis.silson?.threeMonthTreatment === 'yes' ? '있음' : '없음', status: analysis.silson?.threeMonthTreatment === 'yes' ? '주의' : '정상', color: analysis.silson?.threeMonthTreatment === 'yes' ? 'text-orange-500' : 'text-emerald-500' },
    { label: '5년 내 중대질환', amount: analysis.silson?.fiveYearTreatment === 'yes' ? '있음' : '없음', status: analysis.silson?.fiveYearTreatment === 'yes' ? '주의' : '정상', color: analysis.silson?.fiveYearTreatment === 'yes' ? 'text-orange-500' : 'text-emerald-500' },
    { label: '납입/갱신 유형', amount: '갱신형(추천)', status: '정상', color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[2.5rem] p-10 border bg-blue-50/30 border-blue-100">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-blue-900">
          <div className="w-1.5 h-6 rounded-full bg-blue-500"></div>
          유병자 보험 상세 보장 현황
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50 flex flex-col justify-center gap-2 group hover:border-blue-200 transition-all">
              <div className="flex justify-between items-center w-full">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.label}</p>
                <span className={`text-[10px] font-black px-3 py-1 bg-gray-50 rounded-lg ${item.color}`}>{item.status}</span>
              </div>
              <p className="text-lg font-black text-gray-800">{item.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 월 예상 절감액 섹션 */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-4 -translate-y-4">
          <div className="w-48 h-48 rounded-full border-8 border-white"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-black text-blue-200 uppercase tracking-widest bg-blue-900/30 px-3 py-1 rounded-full mb-4 inline-block">
              Pre-existing Condition Analysis
            </span>
            <h4 className="text-2xl font-black mb-2">기존 보험료 대비 월 예상 절감액</h4>
            <p className="text-blue-100 text-sm font-bold opacity-80">
              사용자님의 연령과 상황에 맞춘 최적의 유병자 플랜으로 전환 시 절감되는 금액입니다.
            </p>
          </div>
          <div className="text-right">
            {savings > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-yellow-300">
                  {savings.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-blue-100">원 절감</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter text-white">
                  현재 납입금액 유지/추가 보강 필요
                </span>
              </div>
            )}
            <p className="text-[10px] text-blue-200 font-bold mt-2 opacity-60 uppercase tracking-widest">
              * 추천 상품 기준 예상 수치
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
