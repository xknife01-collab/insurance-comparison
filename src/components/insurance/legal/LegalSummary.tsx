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
      {/* 1. Header: Legal Coverage Summary */}
      <div className="bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
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
                소송의 규모(소가)가 큰 경우 인지대와 변호사 선임료가 크게 증가합니다. 변호사 선임 한도가 낮으면 본인 자부담 공백이 발생할 수 있으므로, 권장 기준 한도를 충족시키는지 지속 점검하시기 바랍니다.
              </p>
            </div>
          </div>

          {/* 세부 상태 리스트 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            {[
              { label: '변호사비 한도', targetId: 'input-legal-fields', val: `${(legalOpts.lawyerLimit / 10000).toLocaleString()}만원`, status: '보장' },
              { label: '인지액/송달료', targetId: 'input-legal-fields', val: `${(legalOpts.courtFeeLimit / 10000).toLocaleString()}만원`, status: '보장' },
              { label: '추가 특약 수준', targetId: 'input-legal-fields', val: (legalOpts.suddenAccelerationRider || legalOpts.consultationRider) ? '특약 조립완료' : '특약 미선택', status: (legalOpts.suddenAccelerationRider || legalOpts.consultationRider) ? '조립' : '기본' },
              { label: '전자소송 할인', targetId: 'input-legal-fields', val: legalOpts.isElectronicLitigation ? '5% 할인대상' : '할인 미동의', status: legalOpts.isElectronicLitigation ? '할인' : '미적용' },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => scrollToInputAndHighlight((item as any).targetId)}
                className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center gap-2 group hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all duration-300"
              >
                <div className="flex justify-between items-center w-full">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700">{item.status}</span>
                </div>
                <p className="text-sm font-black text-slate-800">{item.val}</p>
              </div>
            ))}
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

      {/* 3. 진단 결과 법적 유의사항 디스클레이머 */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed text-left space-y-1">
        <p className="font-black text-slate-700">※ 법률비용 분석 결과 안내 유의사항</p>
        <p>• 본 분석 리포트 및 점수는 고객님의 입력 데이터와 표준 보장 가이드라인을 바탕으로 산출된 단순 참고용 진단 결과입니다.</p>
        <p>• 실제 변호사 보수는 소송가액(소가)에 따라 대법원 「변호사보수의 소송비용 산입에 관한 규칙」에서 정한 기준 금액 한도 내에서 실손 보상되며, 약관상 가입금액 한도를 초과할 수 없습니다.</p>
        <p>• 가입 전 발생 분쟁, 계약일로부터 3개월(90일) 이내 제기 소송, 가족 간 소송, 고의·불법행위 관련 소송은 약관상 보상하지 않으므로 청약 전 반드시 약관 및 상품설명서를 확인하시기 바랍니다.</p>
      </div>
    </div>
  );
};
