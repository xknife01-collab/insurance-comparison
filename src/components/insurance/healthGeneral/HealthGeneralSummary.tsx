import React from 'react';

interface Props {
  result: any;
  formatAmount: (amt: number) => string;
}

export const HealthGeneralSummary: React.FC<Props> = ({ result, formatAmount }) => {
  const { analysis } = result;
  if (!analysis) return null;

  const opts = analysis.healthGeneral || {
    cancerLimit: 50000000,
    similarCancerLimit: 10000000,
    brainLimit: 20000000,
    heartLimit: 20000000,
    cardioLimit: 10000000,
    has1to5Surgery: true,
    hasTargetedTherapy: true,
    hasThrombolysis: false,
    hasLiability: true,
    paymentPeriod: 20,
    coveragePeriod: 90,
    isRenewable: false,
    refundType: 'low'
  };

  const getStatus = (current: number, target: number) => {
    const ratio = current / target;
    if (ratio >= 1.0) return { text: '충분', color: 'text-emerald-500 bg-emerald-50' };
    if (ratio >= 0.6) return { text: '보통', color: 'text-orange-500 bg-orange-50' };
    return { text: '부족', color: 'text-red-500 bg-red-50' };
  };

  const items = [
    { 
      label: '일반암 진단비', 
      amount: formatAmount(opts.cancerLimit), 
      status: getStatus(opts.cancerLimit, 50000000).text, 
      color: getStatus(opts.cancerLimit, 50000000).color 
    },
    { 
      label: '유사암 진단비', 
      amount: formatAmount(opts.similarCancerLimit), 
      status: getStatus(opts.similarCancerLimit, 10000000).text, 
      color: getStatus(opts.similarCancerLimit, 10000000).color 
    },
    { 
      label: '뇌혈관 진단비', 
      amount: formatAmount(opts.brainLimit), 
      status: getStatus(opts.brainLimit, 30000000).text, 
      color: getStatus(opts.brainLimit, 30000000).color 
    },
    { 
      label: '허혈성 심장 진단비', 
      amount: formatAmount(opts.heartLimit), 
      status: getStatus(opts.heartLimit, 20000000).text, 
      color: getStatus(opts.heartLimit, 20000000).color 
    },
    { 
      label: '심혈관 진단비', 
      amount: opts.cardioLimit === 0 ? '미가입' : formatAmount(opts.cardioLimit), 
      status: opts.cardioLimit === 0 ? '공백' : getStatus(opts.cardioLimit, 10000000).text, 
      color: opts.cardioLimit === 0 ? 'text-red-600 bg-red-100/60 font-bold' : getStatus(opts.cardioLimit, 10000000).color 
    },
    { 
      label: '가입 계약 조건', 
      amount: `${opts.paymentPeriod}년납 / ${opts.coveragePeriod}세만기`, 
      status: opts.isRenewable ? '갱신형' : '비갱신형', 
      color: opts.isRenewable ? 'text-orange-600 bg-orange-50 font-bold' : 'text-emerald-600 bg-emerald-50 font-bold' 
    }
  ];

  const riders = [
    { label: '질병·상해 1-5종 수술비', active: opts.has1to5Surgery },
    { label: '표적항암 약물 치료비', active: opts.hasTargetedTherapy },
    { label: '급성 혈전용해 치료비', active: opts.hasThrombolysis },
    { label: '가족 일상생활 배상책임', active: opts.hasLiability }
  ];

  return (
    <div className="rounded-[2.5rem] p-10 border bg-orange-50/10 border-orange-100/30 text-left">
      <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
        <div className="w-1.5 h-6 rounded-full bg-orange-500"></div>
        종합건강보험 가입 설계 리포트
      </h3>
      
      {/* 3대 진단비 및 기본 조건 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {items.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:border-orange-200 transition-all">
            <div>
              <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-widest">{item.label}</p>
              <p className="text-base font-black text-slate-800">{item.amount}</p>
            </div>
            <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${item.color}`}>{item.status}</span>
          </div>
        ))}
      </div>

      {/* 특약 가입 상태 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-8">
        <p className="text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">주요 조립 특약 가입 상태</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {riders.map((rider, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${rider.active ? 'bg-slate-900 border-slate-850 text-white shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
              <span className="text-xs font-black">{rider.label}</span>
              <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-md ${rider.active ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {rider.active ? '가입' : '미가입'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 월 예상 절감액 섹션 */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-4 -translate-y-4">
          <div className="w-48 h-48 rounded-full border-8 border-white"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-black text-orange-200 uppercase tracking-widest bg-orange-950/30 px-3 py-1 rounded-full mb-4 inline-block">
              Comprehensive Health Analysis
            </span>
            <h4 className="text-2xl font-black mb-2">기존 보험료 대비 월 예상 절감액</h4>
            <p className="text-orange-100 text-sm font-bold opacity-80">
              선택하신 맞춤 보장 설계 대비 가장 저렴하고 탄탄한 추천 플랜으로 교체 시 세이브되는 고정 비용입니다.
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
