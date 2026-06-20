import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, CheckCircle2, Scale, Star, AlertCircle, HelpCircle } from 'lucide-react';

interface Props {
  result: {
    scores: {
      lawyerScore: number;
      courtFeeScore: number;
      riderScore: number;
      totalScore: number;
    };
    efficiency: number;
    deficiencies: string[];
    recommendations: any;
    analysis: any;
  };
}

export const LegalSummary: React.FC<Props> = ({ result }) => {
  const { scores, efficiency, deficiencies } = result;
  const { analysis } = result;
  const legalOpts = analysis?.legal || {
    litigationType: 'civil',
    lawyerLimit: 10000000,
    courtFeeLimit: 5000000,
    deductibleType: 'fixed',
    suddenAccelerationRider: false,
    consultationRider: false,
    isElectronicLitigation: false,
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-indigo-600';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-12">
      {/* 1. Header: Status Card & Total Score Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <Scale size={200} className="text-indigo-600" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Scale size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  설계 법률비용 보장 분석 결과
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  구분: {legalOpts.litigationType === 'civil' ? '민사소송 중심' : legalOpts.litigationType === 'criminal' ? '형사사건 방어' : '행정처분 소송'} · {legalOpts.deductibleType === 'fixed' ? '10만원 정액 공제' : '10% 비례 자부담'}
                </p>
              </div>
            </div>

            {/* 법률 설명 인포 */}
            <div className="p-5 rounded-2xl bg-indigo-50/30 border border-indigo-100/30 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black text-indigo-900">법률 비용 리스크 조언</p>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  소송의 규모(소가)가 큰 경우 인지대와 변호사 선임료가 기하급수적으로 증가합니다. 변호사 선임 한도가 낮으면 본인 자부담 공백이 발생할 수 있으므로, 권장 기준 한도를 충족시키는지 지속 점검하시기 바랍니다.
                </p>
              </div>
            </div>

            {/* 세부 점수 리스트 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
              {[
                { label: '변호사비 한도', targetId: 'input-legal-fields', val: `${(legalOpts.lawyerLimit / 10000).toLocaleString()}만원`, score: scores.lawyerScore },
                { label: '인지액/송달료', targetId: 'input-legal-fields', val: `${(legalOpts.courtFeeLimit / 10000).toLocaleString()}만원`, score: scores.courtFeeScore },
                { label: '추가 특약 수준', targetId: 'input-legal-fields', val: (legalOpts.suddenAccelerationRider || legalOpts.consultationRider) ? '특약 조립완료' : '특약 미선택', score: scores.riderScore },
                { label: '전자소송 할인', targetId: 'input-legal-fields', val: legalOpts.isElectronicLitigation ? '5% 할인대상' : '할인 미동의', score: legalOpts.isElectronicLitigation ? 95 : 50 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-sm font-black text-slate-800">{item.val}</p>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      className={`h-full ${getProgressColor(item.score)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 종합 점수 카드 */}
        <div className="bg-indigo-600 rounded-[3.5rem] p-12 text-white shadow-[0_30px_70px_-20px_rgba(79,70,229,0.3)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Zap size={200} fill="currentColor" />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-100 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">OPTIMIZATION SCORE</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter">{scores.totalScore}</span>
              <span className="text-2xl font-bold opacity-80">점</span>
            </div>
          </div>
          <div className="relative z-10 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <CheckCircle2 size={16} className="text-indigo-200" />
              <span className="text-xs font-bold">
                {scores.totalScore >= 85 ? '아주 견고한 법률 안심망 설계입니다!' : scores.totalScore >= 65 ? '보통 수준의 법률비용 보장입니다.' : '변호사 한도 조절이 시급합니다.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 부족한 보장 공백 안내 */}
      {deficiencies.length > 0 && (
        <div className="bg-rose-50/50 border border-rose-100 rounded-[2.5rem] p-8 md:p-10 space-y-4">
          <h4 className="text-base font-black text-rose-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-rose-500 fill-rose-500" />
            진단된 보장 공백 ({deficiencies.length}건)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deficiencies.map((def, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-rose-100/50">
                <span className="w-2 h-2 bg-rose-500 rounded-full shrink-0" />
                <span className="text-xs font-bold text-slate-700">{def}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
