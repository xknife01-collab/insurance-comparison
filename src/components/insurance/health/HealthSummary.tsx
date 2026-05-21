import React from 'react';
import { HealthAnalysisResult } from '../../../types/insurance/health';

interface Props {
  result: HealthAnalysisResult;
  formatAmount: (amt: number) => string;
}

export const HealthSummary: React.FC<Props> = ({ result, formatAmount }) => {
  const { analysis } = result as any;
  if (!analysis) return null;
  const getStatus = (current: number, target: number, label: string) => {
    const ratio = current / target;
    if (ratio >= 1.0) return { text: '정상', color: 'text-emerald-500' };
    if (label.includes('뇌혈관') || label.includes('심혈관')) {
      if (ratio >= 0.3) return { text: '주의', color: 'text-orange-500' };
    }
    if (label.includes('후유장해') && ratio <= 0.4) return { text: '경고', color: 'text-red-600' };
    if (label.includes('수술비') && ratio < 0.5) return { text: '부족', color: 'text-red-500' };
    if (ratio >= 0.8) return { text: '정상', color: 'text-emerald-500' };
    if (ratio >= 0.6) return { text: '주의', color: 'text-orange-500' };
    if (ratio >= 0.3) return { text: '부족', color: 'text-red-500' };
    return { text: '경고', color: 'text-red-600' };
  };

  const items = [
    { label: '일반암 진단비', amount: formatAmount(analysis.cancer.currentAmount), status: getStatus(analysis.cancer.currentAmount, analysis.cancer.targetAmount, '일암').text, color: getStatus(analysis.cancer.currentAmount, analysis.cancer.targetAmount, '일암').color },
    { label: '뇌혈관 질환', amount: formatAmount(analysis.cerebrovascular.currentAmount), status: getStatus(analysis.cerebrovascular.currentAmount, analysis.cerebrovascular.targetAmount, '뇌').text, color: getStatus(analysis.cerebrovascular.currentAmount, analysis.cerebrovascular.targetAmount, '뇌').color },
    { label: '심혈관 질환', amount: formatAmount(analysis.cardiovascular.currentAmount), status: getStatus(analysis.cardiovascular.currentAmount, analysis.cardiovascular.targetAmount, '심').text, color: getStatus(analysis.cardiovascular.currentAmount, analysis.cardiovascular.targetAmount, '심').color },
    { label: '수술비(질병/상해)', amount: formatAmount(analysis.surgery.currentAmount), status: getStatus(analysis.surgery.currentAmount, analysis.surgery.targetAmount, '수').text, color: getStatus(analysis.surgery.currentAmount, analysis.surgery.targetAmount, '수').color },
    { label: '질병후유장해', amount: formatAmount(analysis.postDisability.currentAmount), status: getStatus(analysis.postDisability.currentAmount, analysis.postDisability.targetAmount, '질').text, color: getStatus(analysis.postDisability.currentAmount, analysis.postDisability.targetAmount, '질').color },
    { label: '납입면제 범위', amount: analysis.paymentExemption === 'premium' ? '고급형' : '표준형', status: analysis.paymentExemption === 'premium' ? '우수' : '정상', color: 'text-emerald-500' },
  ];

  return (
    <div className="rounded-[2.5rem] p-10 border bg-gray-50 border-gray-100">
      <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
        <div className="w-1.5 h-6 rounded-full bg-orange-500"></div>
        상세 보장 분석 현황
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-orange-200 transition-all">
            <div>
              <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-widest">{item.label}</p>
              <p className="text-lg font-black text-gray-800">{item.amount}</p>
            </div>
            <span className={`text-[10px] font-black px-3 py-1 bg-gray-50 rounded-lg ${item.color}`}>{item.status}</span>
          </div>
        ))}
      </div>

      {/* 월 예상 절감액 섹션 */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden mt-6">
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-4 -translate-y-4">
          <div className="w-48 h-48 rounded-full border-8 border-white"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-black text-orange-200 uppercase tracking-widest bg-orange-900/30 px-3 py-1 rounded-full mb-4 inline-block">
              Comprehensive Health Analysis
            </span>
            <h4 className="text-2xl font-black mb-2">기존 보험료 대비 월 예상 절감액</h4>
            <p className="text-orange-100 text-sm font-bold opacity-80">
              사용자님의 연령과 상황에 맞춘 최적의 통합 건강 플랜으로 전환 시 절감되는 금액입니다.
            </p>
          </div>
          <div className="text-right">
            {(analysis.monthlyPremium || 0) - (result.recommendations?.upgrade?.estimatedPremium || 0) > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-yellow-300">
                  {((analysis.monthlyPremium || 0) - (result.recommendations?.upgrade?.estimatedPremium || 0)).toLocaleString()}
                </span>
                <span className="text-xl font-bold text-orange-100">원 절감</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter text-white">
                  현재 납입금액 유지/추가 보강 필요
                </span>
              </div>
            )}
            <p className="text-[10px] text-orange-200 font-bold mt-2 opacity-60 uppercase tracking-widest">
              * 추천 상품 기준 예상 수치
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
