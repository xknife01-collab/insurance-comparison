import React from 'react';
import { Scale, Shield, FileText, Check, HelpCircle } from 'lucide-react';

interface Props {
  litigationType: 'civil' | 'criminal' | 'administrative';
  setLitigationType: (v: 'civil' | 'criminal' | 'administrative') => void;
  lawyerLimit: number;
  setLawyerLimit: (v: number) => void;
  courtFeeLimit: number;
  setCourtFeeLimit: (v: number) => void;
  deductibleType: 'fixed' | 'ratio';
  setDeductibleType: (v: 'fixed' | 'ratio') => void;
  suddenAccelerationRider: boolean;
  setSuddenAccelerationRider: (v: boolean) => void;
  consultationRider: boolean;
  setConsultationRider: (v: boolean) => void;
  isElectronicLitigation: boolean;
  setIsElectronicLitigation: (v: boolean) => void;
}

export const LegalFields: React.FC<Props> = ({
  litigationType,
  setLitigationType,
  lawyerLimit,
  setLawyerLimit,
  courtFeeLimit,
  setCourtFeeLimit,
  deductibleType,
  setDeductibleType,
  suddenAccelerationRider,
  setSuddenAccelerationRider,
  consultationRider,
  setConsultationRider,
  isElectronicLitigation,
  setIsElectronicLitigation,
}) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* ── SECTION 1: 소송 구분 설정 ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Scale className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-indigo-500/25 text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white">
              가장 빈번하게 우려되는 법적 분쟁 대상을 정해주세요
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setLitigationType('civil')}
              type="button"
              className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                litigationType === 'civil'
                  ? 'bg-indigo-500/15 border-indigo-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Scale className={`w-10 h-10 mb-2 ${litigationType === 'civil' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="font-black text-sm mb-1">민사소송 중심</span>
              <span className="text-[10px] text-slate-400">임대차/채무 분쟁 등 일상 민사</span>
            </button>

            <button
              onClick={() => setLitigationType('criminal')}
              type="button"
              className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                litigationType === 'criminal'
                  ? 'bg-indigo-500/15 border-indigo-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Shield className={`w-10 h-10 mb-2 ${litigationType === 'criminal' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="font-black text-sm mb-1">형사사건 방어</span>
              <span className="text-[10px] text-slate-400">교통사고/폭행/명예훼손 기소 방어</span>
            </button>

            <button
              onClick={() => setLitigationType('administrative')}
              type="button"
              className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                litigationType === 'administrative'
                  ? 'bg-indigo-500/15 border-indigo-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <FileText className={`w-10 h-10 mb-2 ${litigationType === 'administrative' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="font-black text-sm mb-1">행정처분 소송</span>
              <span className="text-[10px] text-slate-400">영업정지/과징금 처분 취소 소송</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: 보장 한도 및 자기부담금 ── */}
      <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-slate-100 text-slate-800 px-3 py-1.5 rounded-full border border-slate-200 uppercase tracking-widest">Step 02</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            소송비용 보장 한도와 자기부담 형식을 선택해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 변호사비용 한도 */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 block">
              심급별 변호사 선임비용 보장한도 (1심/2심/3심 각각 적용)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[5000000, 10000000, 20000000, 30000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLawyerLimit(val)}
                  className={`py-3 rounded-xl font-bold border transition-all text-xs ${
                    lawyerLimit === val
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-black shadow-sm'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {(val / 10000).toLocaleString()}만 원 한도
                </button>
              ))}
            </div>
          </div>

          {/* 인지대/송달료 한도 */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 block">
              사고당 법원 납부비용 한도 (인지액 및 송달 우편료 실비 보상)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[2000000, 5000000, 10000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCourtFeeLimit(val)}
                  className={`py-3 rounded-xl font-bold border transition-all text-xs ${
                    courtFeeLimit === val
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-black shadow-sm'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {(val / 10000).toLocaleString()}만 원
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 자기부담금 방식 */}
        <div className="border-t border-slate-100 pt-8 space-y-4">
          <label className="text-xs font-black text-slate-400 block">
            소송비용 발생 시 피보험자가 공제(자부담)하는 방식
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setDeductibleType('fixed')}
              className={`flex-1 py-4 px-6 rounded-2xl border text-left transition-all ${
                deductibleType === 'fixed'
                  ? 'border-indigo-600 bg-indigo-50/30'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-black ${deductibleType === 'fixed' ? 'text-indigo-900' : 'text-slate-800'}`}>
                  정액 자부담 (건당 10만원 공제)
                </span>
                {deductibleType === 'fixed' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                변호사 비용 규모에 상관없이 소송 한 건당 정액 10만 원만 제외하고 보상받는 방식입니다.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDeductibleType('ratio')}
              className={`flex-1 py-4 px-6 rounded-2xl border text-left transition-all ${
                deductibleType === 'ratio'
                  ? 'border-indigo-600 bg-indigo-50/30'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-black ${deductibleType === 'ratio' ? 'text-indigo-900' : 'text-slate-800'}`}>
                  비례 자부담 (지출액의 10% 공제)
                </span>
                {deductibleType === 'ratio' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                실제 변호사 선임비 및 인지대 합산 지출액의 10%를 자부담합니다. **(월 보장 보험료 10% 자동 할인)**
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: 특약 및 할인 요건 ── */}
      <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-slate-100 text-slate-800 px-3 py-1.5 rounded-full border border-slate-200 uppercase tracking-widest">Step 03</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            추가 보장 특약과 할인 요건을 정해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 특약 선택 */}
          <div className="space-y-4">
            <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" />
              법률 지원 필수 특약 구성
            </h5>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800">급발진 사고 분쟁 소송 특약</span>
                  <span className="text-[10px] text-slate-400 font-medium">차량 급발진 입증을 위한 심급별 소송비용 탑재</span>
                </div>
                <input
                  type="checkbox"
                  checked={suddenAccelerationRider}
                  onChange={(e) => setSuddenAccelerationRider(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800">변호사 1:1 실시간 대면상담 특약</span>
                  <span className="text-[10px] text-slate-400 font-medium">소송 전 변호사와의 사전 대면/서면 상담 비용 보전</span>
                </div>
                <input
                  type="checkbox"
                  checked={consultationRider}
                  onChange={(e) => setConsultationRider(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 전자소송 할인 */}
          <div className="space-y-4">
            <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              대한민국 법원 전자소송 할인 우대 (월 5% 즉시 절감)
            </h5>
            <div className="p-5 rounded-3xl bg-indigo-50/20 border border-indigo-100/40">
              <p className="text-[11px] text-indigo-950 font-bold leading-relaxed mb-4">
                종이 문서 없는 '대법원 전자소송 시스템'을 이용하여 법률 서류 제출 및 송달을 수령하는 것에 동의하시는 경우, 월 보장 보험료의 5%를 즉시 감면해 드립니다.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsElectronicLitigation(true)}
                  className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all border ${
                    isElectronicLitigation
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  전자소송 동의 (5% 할인)
                </button>
                <button
                  type="button"
                  onClick={() => setIsElectronicLitigation(false)}
                  className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all border ${
                    !isElectronicLitigation
                      ? 'bg-slate-900 text-white border-slate-800'
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  미동의 / 종이소송
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
